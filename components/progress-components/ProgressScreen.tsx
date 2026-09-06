import { View, Text, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { MAIN_COLORS } from "@/constants/MainColors";
import { useProgressStore } from "@/stores/progress-stores/progressStores";
import ProgressVolumeCard from "./progress-dashboard-components/ProgressVolumeCard";
import ProgressStatCard from "./progress-dashboard-components/ProgressStatCard";
import CommitGraphCard from "./progress-dashboard-components/CommitGraphCard";

export default function ProgressScreen () {
    const { dashboardData, loading, error, fetchDashboard } = useProgressStore();

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading && !dashboardData) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator color={MAIN_COLORS.primary} size="large" />
            </View>
        );
    }

    const dd = dashboardData;

    return (
        <View>
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Text className="text-white font-bold text-[28px] font-sans tracking-tight">
                        Progress
                    </Text>
                    <Text
                        className="text-[13px] mt-1 font-sans"
                        style={{ color: MAIN_COLORS.mediumGrey }}
                    >
                        Watch strength, volume, and habits move
                    </Text>
                </View>
            </View>

            {error && (
                <Text className="text-red-400 text-sm mb-3">{error}</Text>
            )}

            {dd && (
                <>
                    <CommitGraphCard heatmap={dd.heatmap} />

                    <ProgressVolumeCard
                        weeklyVolume={dd.weeklyVolume}
                        weeklyStats={dd.weeklyStats}
                        totalWeightVolume={dd.totalWeightVolume}
                        previousWeekStats={dd.previousWeekStats}
                    />

                    <View className="flex-row gap-3 mt-4">
                        <ProgressStatCard
                            label="Sets"
                            value={dd.totalSets.toLocaleString()}
                            detail="this week"
                        />
                        <ProgressStatCard
                            label="Reps"
                            value={dd.totalReps.toLocaleString()}
                            detail="this week"
                        />
                    </View>

                    <View className="flex-row gap-3 mt-3">
                        <ProgressStatCard
                            label="Volume"
                            value={`${dd.totalWeightVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg`}
                            detail="total weight"
                        />
                        <ProgressStatCard
                            label="Streak"
                            value={dd.streak.toString()}
                            detail={dd.streak === 1 ? "day" : "days"}
                        />
                    </View>
                </>
            )}
        </View>
    );
}
