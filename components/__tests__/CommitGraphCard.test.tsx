import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CommitGraphCard from '@/components/progress-components/progress-dashboard-components/CommitGraphCard';
import { HeatmapDay } from '@/stores/progress-stores/progressStores';

const mockHeatmapData: HeatmapDay[] = [
  { date: '2026-06-15', count: 0, totalSets: 0, weightVolume: 0, level: 0 },
  { date: '2026-06-16', count: 1, totalSets: 3, weightVolume: 150, level: 1 },
  { date: '2026-06-17', count: 3, totalSets: 9, weightVolume: 1200, level: 2 },
  { date: '2026-06-18', count: 5, totalSets: 15, weightVolume: 3500, level: 3 },
  { date: '2026-06-19', count: 7, totalSets: 21, weightVolume: 6000, level: 4 },
];

describe('CommitGraphCard', () => {
  it('renders card header, day labels, and legend', () => {
    render(<CommitGraphCard heatmap={mockHeatmapData} />);

    // Header
    expect(screen.getByText('Activity')).toBeTruthy();

    // Legend
    expect(screen.getByText('Less')).toBeTruthy();
    expect(screen.getByText('More')).toBeTruthy();

    // Day labels
    expect(screen.getByText('Mon')).toBeTruthy();
    expect(screen.getByText('Wed')).toBeTruthy();
    expect(screen.getByText('Fri')).toBeTruthy();
  });

  it('renders cells with testIDs for each heatmap day', () => {
    render(<CommitGraphCard heatmap={mockHeatmapData} />);

    expect(screen.getByTestId('heatmap-cell-2026-06-15')).toBeTruthy();
    expect(screen.getByTestId('heatmap-cell-2026-06-16')).toBeTruthy();
    expect(screen.getByTestId('heatmap-cell-2026-06-17')).toBeTruthy();
    expect(screen.getByTestId('heatmap-cell-2026-06-18')).toBeTruthy();
    expect(screen.getByTestId('heatmap-cell-2026-06-19')).toBeTruthy();
  });

  it('shows default helper text before any cell is pressed', () => {
    render(<CommitGraphCard heatmap={mockHeatmapData} />);

    expect(screen.getByText('Tap a square to view details')).toBeTruthy();
  });

  it('displays workout details when an active day cell is pressed', () => {
    render(<CommitGraphCard heatmap={mockHeatmapData} />);

    const activeCell = screen.getByTestId('heatmap-cell-2026-06-18');
    fireEvent.press(activeCell);

    expect(screen.getByText('2026-06-18')).toBeTruthy();
    expect(screen.getByText(/5 exercises/i)).toBeTruthy();
    expect(screen.getByText(/15 sets/i)).toBeTruthy();
    expect(screen.getByText(/3,500 kg/i)).toBeTruthy();
  });

  it('displays rest day message when an inactive day cell is pressed', () => {
    render(<CommitGraphCard heatmap={mockHeatmapData} />);

    const inactiveCell = screen.getByTestId('heatmap-cell-2026-06-15');
    fireEvent.press(inactiveCell);

    expect(screen.getByText('2026-06-15')).toBeTruthy();
    expect(screen.getByText(/No workouts logged/i)).toBeTruthy();
  });
});
