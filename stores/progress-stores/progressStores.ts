import { create } from "zustand";
import { getDashboardData } from "@/api/services/progressService";

export interface DayVolume {
  day: string;
  date: string;
  count: number;
  weightVolume: number;
}

export interface WeeklyStats {
  totalCompleted: number;
  totalPlanned: number;
  completionRate: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
  totalSets: number;
  weightVolume: number;
  level: number;
}

export interface DashboardData {
  weeklyVolume: DayVolume[];
  weeklyStats: WeeklyStats;
  totalSets: number;
  totalReps: number;
  totalWeightVolume: number;
  streak: number;
  previousWeekStats: WeeklyStats | null;
  heatmap: HeatmapDay[];
}

interface ProgressState {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  dashboardData: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getDashboardData();
      set({ dashboardData: response.data, loading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load dashboard data";
      set({ error: message, loading: false });
    }
  },
}));
