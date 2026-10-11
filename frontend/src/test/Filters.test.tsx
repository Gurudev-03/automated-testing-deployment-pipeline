import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Filters from '../components/Filters';

const defaultProps = {
  status: 'all' as const, priority: 'all' as const,
  category: 'all' as const, search: '', total: 5,
  onStatus: vi.fn(), onPriority: vi.fn(), onCategory: vi.fn(),
  onSearch: vi.fn(), onClear: vi.fn(),
};

describe('Filters', () => {
  it('renders search input', () => {
    render(<Filters {...defaultProps} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders all status tabs', () => {
    render(<Filters {...defaultProps} />);
    ['All','Pending','Progress','Completed'].forEach(t =>
      expect(screen.getByRole('tab', { name: new RegExp(t,'i') })).toBeInTheDocument()
    );
  });

  it('shows result count', () => {
    render(<Filters {...defaultProps} total={7} />);
    expect(screen.getByText(/7 tasks/i)).toBeInTheDocument();
  });

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn();
    render(<Filters {...defaultProps} onSearch={onSearch} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'fix bug' } });
    expect(onSearch).toHaveBeenCalledWith('fix bug');
  });

  it('calls onStatus when tab clicked', () => {
    const onStatus = vi.fn();
    render(<Filters {...defaultProps} onStatus={onStatus} />);
    fireEvent.click(screen.getByRole('tab', { name: /pending/i }));
    expect(onStatus).toHaveBeenCalledWith('pending');
  });

  it('marks active tab with aria-selected', () => {
    render(<Filters {...defaultProps} status="completed" />);
    expect(screen.getByRole('tab', { name: /completed/i })).toHaveAttribute('aria-selected','true');
  });

  it('shows clear button when filter active', () => {
    render(<Filters {...defaultProps} status="pending" />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('hides clear button when no filter', () => {
    render(<Filters {...defaultProps} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('calls onClear when clear clicked', () => {
    const onClear = vi.fn();
    render(<Filters {...defaultProps} status="pending" onClear={onClear} />);
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(onClear).toHaveBeenCalled();
  });

  it('renders category dropdown', () => {
    render(<Filters {...defaultProps} />);
    expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
  });

  it('calls onCategory when changed', () => {
    const onCategory = vi.fn();
    render(<Filters {...defaultProps} onCategory={onCategory} />);
    fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: 'work' } });
    expect(onCategory).toHaveBeenCalledWith('work');
  });
});
