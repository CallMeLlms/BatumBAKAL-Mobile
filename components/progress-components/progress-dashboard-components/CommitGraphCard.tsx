import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { HeatmapDay } from "@/stores/progress-stores/progressStores";

interface CommitGraphCardProps {
  heatmap?: HeatmapDay[];
}

const LEVEL_COLORS = [
  "#222222", // Level 0: No activity
  "#064E3B", // Level 1: Light
  "#047857", // Level 2: Moderate
  "#10B981", // Level 3: High
  "#34D399", // Level 4: Peak
];

export default function CommitGraphCard({ heatmap = [] }: CommitGraphCardProps) {
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);

  // Group days into columns of 7 (weeks)
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < heatmap.length; i += 7) {
    weeks.push(heatmap.slice(i, i + 7));
  }

  const activeDaysCount = heatmap.filter((d) => d.count > 0).length;

  return (
    <View className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4">
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-white font-semibold text-sm">Activity</Text>
          <Text className="text-gray-500 text-[11px] mt-0.5">
            {activeDaysCount} active days in past 12 weeks
          </Text>
        </View>

        {/* Legend */}
        <View className="flex-row items-center gap-x-1">
          <Text className="text-[10px] text-gray-500 mr-0.5">Less</Text>
          {LEVEL_COLORS.map((color, index) => (
            <View
              key={index}
              style={{
                width: 9,
                height: 9,
                borderRadius: 2,
                backgroundColor: color,
              }}
            />
          ))}
          <Text className="text-[10px] text-gray-500 ml-0.5">More</Text>
        </View>
      </View>

      {/* Grid container with Day Labels */}
      <View className="flex-row items-center">
        <View className="justify-between pr-2" style={{ height: 7 * 14 + 6 * 3 }}>
          <Text className="text-[10px] text-gray-500 font-medium">Mon</Text>
          <Text className="text-[10px] text-gray-500 font-medium">Wed</Text>
          <Text className="text-[10px] text-gray-500 font-medium">Fri</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-1 py-1">
            {weeks.map((week, wIndex) => (
              <View key={wIndex} className="gap-1">
                {week.map((day) => {
                  const isSelected = selectedDay?.date === day.date;
                  return (
                    <TouchableOpacity
                      key={day.date}
                      testID={`heatmap-cell-${day.date}`}
                      onPress={() => setSelectedDay(day)}
                      activeOpacity={0.7}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        backgroundColor: LEVEL_COLORS[day.level] || LEVEL_COLORS[0],
                        borderWidth: isSelected ? 1.5 : 0,
                        borderColor: isSelected ? "#FFFFFF" : "transparent",
                      }}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Detail / Tooltip Inspection Banner */}
      <View className="mt-3 p-2.5 bg-[#141414] rounded-xl border border-[#262626] min-h-[44px] justify-center">
        {selectedDay ? (
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-xs font-semibold">
              {selectedDay.date}
            </Text>
            {selectedDay.count > 0 ? (
              <Text className="text-gray-300 text-xs">
                {selectedDay.count} exercises • {selectedDay.totalSets} sets •{" "}
                {selectedDay.weightVolume.toLocaleString()} kg
              </Text>
            ) : (
              <Text className="text-gray-500 text-xs">No workouts logged</Text>
            )}
          </View>
        ) : (
          <Text className="text-gray-500 text-xs text-center">
            Tap a square to view details
          </Text>
        )}
      </View>
    </View>
  );
}
