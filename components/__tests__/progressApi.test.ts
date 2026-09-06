import apiClient from '@/api/axiosInstance';
import { getDashboardData } from '@/api/services/progressService';
import { useProgressStore, HeatmapDay, DashboardData } from '@/stores/progress-stores/progressStores';

jest.mock('@/api/axiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockHeatmap: HeatmapDay[] = [
  { date: '2026-06-15', count: 0, totalSets: 0, weightVolume: 0, level: 0 },
  { date: '2026-06-16', count: 1, totalSets: 3, weightVolume: 150, level: 1 },
  { date: '2026-06-17', count: 3, totalSets: 9, weightVolume: 1200, level: 2 },
  { date: '2026-06-18', count: 5, totalSets: 15, weightVolume: 3500, level: 3 },
  { date: '2026-06-19', count: 7, totalSets: 21, weightVolume: 6000, level: 4 },
];

const mockDashboardResponse: { data: DashboardData } = {
  data: {
    weeklyVolume: [
      { day: 'Sun', date: '2026-09-06', count: 2, weightVolume: 500 },
    ],
    weeklyStats: {
      totalCompleted: 5,
      totalPlanned: 10,
      completionRate: 0.5,
    },
    totalSets: 15,
    totalReps: 150,
    totalWeightVolume: 5000,
    streak: 4,
    previousWeekStats: null,
    heatmap: mockHeatmap,
  },
};

describe('Progress API & Store Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProgressStore.setState({
      dashboardData: null,
      loading: false,
      error: null,
    });
  });

  describe('getDashboardData API service', () => {
    it('calls /progress/dashboardData endpoint and returns response data', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockDashboardResponse,
      });

      const result = await getDashboardData();

      expect(apiClient.get).toHaveBeenCalledWith('/progress/dashboardData');
      expect(result).toEqual(mockDashboardResponse);
    });

    it('throws error when apiClient.get fails', async () => {
      const error = new Error('Network error');
      (apiClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(getDashboardData()).rejects.toThrow('Network error');
    });
  });

  describe('useProgressStore fetchDashboard with heatmap', () => {
    it('fetches and populates dashboardData including heatmap', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockDashboardResponse,
      });

      await useProgressStore.getState().fetchDashboard();

      const state = useProgressStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.dashboardData).toBeDefined();
      expect(state.dashboardData?.heatmap).toBeDefined();
      expect(state.dashboardData?.heatmap).toHaveLength(5);
      expect(state.dashboardData?.heatmap[0].level).toBe(0);
      expect(state.dashboardData?.heatmap[4].level).toBe(4);
    });

    it('sets error message when fetchDashboard fails', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

      await useProgressStore.getState().fetchDashboard();

      const state = useProgressStore.getState();
      expect(state.loading).toBe(false);
      expect(state.dashboardData).toBeNull();
      expect(state.error).toBe('Server error');
    });
  });
});
