import { MAIN_COLORS } from '@/constants/MainColors';
import StatCard from '@/components/log-components/stat-components/StatCard';
import { render, screen } from '@testing-library/react-native';

describe('StatCard', () => {
  it('renders the label, value, and detail text', () => {
    render(<StatCard label="Volume" value="12,400" detail="kg" />);

    screen.getByText('Volume');
    screen.getByText('12,400');
    screen.getByText('kg');
  });

  it('renders the value with the large bold styling', () => {
    render(<StatCard label="Volume" value="12,400" detail="kg" />);

    const value = screen.getByText('12,400');
    expect(value.props.className).toContain('font-bold');
    expect(value.props.className).toContain('text-[20px]');
  });

  it('styles label and detail with the medium grey color', () => {
    render(<StatCard label="Volume" value="12,400" detail="kg" />);

    expect(screen.getByText('Volume').props.style).toEqual({ color: MAIN_COLORS.mediumGrey });
    expect(screen.getByText('kg').props.style).toEqual({ color: MAIN_COLORS.mediumGrey });
  });
});