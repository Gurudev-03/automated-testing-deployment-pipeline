import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../components/TaskCard';
import type { Task } from '../types';

const makeTask = (overrides = {}): Task => ({
  id: 1, title: 'Test Task', description: 'Details here',
  priority: 'medium', status: 'pending', category: 'general',
  due_date: null, created_at: '2026-01-01T00:00:00', updated_at: '2026-01-01T00:00:00',
  ...overrides,
});

describe('TaskCard', () => {
  it('renders title', () => {
    render(<TaskCard task={makeTask()} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={vi.fn()} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<TaskCard task={makeTask()} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={vi.fn()} />);
    expect(screen.getByText('Details here')).toBeInTheDocument();
  });

  it('renders priority, status and category badges', () => {
    render(<TaskCard task={makeTask()} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={vi.fn()} />);
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText(/general/i)).toBeInTheDocument();
  });

  it('calls onEdit when edit clicked', () => {
    const onEdit = vi.fn();
    const task = makeTask();
    render(<TaskCard task={task} onEdit={onEdit} onDelete={vi.fn()} onStatus={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it('calls onDelete when delete clicked', () => {
    const onDelete = vi.fn();
    render(<TaskCard task={makeTask()} onEdit={vi.fn()} onDelete={onDelete} onStatus={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('calls onStatus with in-progress for pending task', () => {
    const onStatus = vi.fn();
    render(<TaskCard task={makeTask({ status:'pending' })} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={onStatus} />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(onStatus).toHaveBeenCalledWith(1, 'in-progress');
  });

  it('calls onStatus with completed for in-progress task', () => {
    const onStatus = vi.fn();
    render(<TaskCard task={makeTask({ status:'in-progress' })} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={onStatus} />);
    fireEvent.click(screen.getByRole('button', { name: /complete/i }));
    expect(onStatus).toHaveBeenCalledWith(1, 'completed');
  });

  it('calls onStatus with pending for completed task (reopen)', () => {
    const onStatus = vi.fn();
    render(<TaskCard task={makeTask({ status:'completed' })} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={onStatus} />);
    fireEvent.click(screen.getByRole('button', { name: /reopen/i }));
    expect(onStatus).toHaveBeenCalledWith(1, 'pending');
  });

  it('applies done class on completed title', () => {
    render(<TaskCard task={makeTask({ status:'completed' })} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={vi.fn()} />);
    expect(screen.getByText('Test Task')).toHaveClass('done');
  });

  it('shows overdue badge for past due date', () => {
    render(<TaskCard task={makeTask({ due_date:'2020-01-01', status:'pending' })} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={vi.fn()} />);
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  it('shows due date when set', () => {
    render(<TaskCard task={makeTask({ due_date:'2030-12-31' })} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={vi.fn()} />);
    expect(screen.getByText(/due:/i)).toBeInTheDocument();
  });

  it('has accessible article landmark', () => {
    render(<TaskCard task={makeTask()} onEdit={vi.fn()} onDelete={vi.fn()} onStatus={vi.fn()} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});
