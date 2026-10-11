import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatsBar from '../components/StatsBar';
import type { Stats } from '../types';

const makeStats = (overrides = {}): Stats => ({
  total: 10, pending: 4, inProgress: 3, completed: 3, high: 2, overdue: 1, ...overrides,
});

describe('StatsBar', () => {
  it('renders total count', () => {
    render(<StatsBar stats={makeStats()} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders completed count', () => {
    render(<StatsBar stats={makeStats({ completed: 7 })} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders overdue count', () => {
    render(<StatsBar stats={makeStats({ overdue: 5 })} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders progress bar with correct aria', () => {
    render(<StatsBar stats={makeStats({ total: 10, completed: 5 })} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
  });

  it('shows 0% when no tasks', () => {
    render(<StatsBar stats={makeStats({ total: 0, completed: 0 })} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('shows 100% when all completed', () => {
    render(<StatsBar stats={makeStats({ total: 5, completed: 5 })} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('renders region landmark', () => {
    render(<StatsBar stats={makeStats()} />);
    expect(screen.getByRole('region', { name: /task statistics/i })).toBeInTheDocument();
  });

  it('renders all 6 stat cards', () => {
    render(<StatsBar stats={makeStats()} />);
    ['Total','Pending','In Progress','Completed','High Priority','Overdue'].forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
