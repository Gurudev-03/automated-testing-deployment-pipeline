import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../components/Header';

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header onNewTask={vi.fn()} />);
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });

  it('renders pipeline subtitle', () => {
    render(<Header onNewTask={vi.fn()} />);
    expect(screen.getByText(/Automated Testing/i)).toBeInTheDocument();
  });

  it('renders New Task button', () => {
    render(<Header onNewTask={vi.fn()} />);
    expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument();
  });

  it('calls onNewTask when button clicked', () => {
    const onNewTask = vi.fn();
    render(<Header onNewTask={onNewTask} />);
    fireEvent.click(screen.getByRole('button', { name: /new task/i }));
    expect(onNewTask).toHaveBeenCalled();
  });

  it('renders pipeline badge', () => {
    render(<Header onNewTask={vi.fn()} />);
    expect(screen.getByLabelText(/pipeline status/i)).toBeInTheDocument();
  });

  it('renders as banner landmark', () => {
    render(<Header onNewTask={vi.fn()} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
