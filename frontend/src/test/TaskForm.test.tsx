import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from '../components/TaskForm';
import type { Task } from '../types';

const makeTask = (overrides = {}): Task => ({
  id: 1, title: 'Existing Task', description: 'Desc', priority: 'high',
  status: 'in-progress', category: 'work', due_date: null,
  created_at: '', updated_at: '', ...overrides,
});

describe('TaskForm', () => {
  it('renders add task form by default', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    expect(screen.getByRole('form', { name: /add task form/i })).toBeInTheDocument();
    expect(screen.getByText(/add new task/i)).toBeInTheDocument();
  });

  it('renders edit task form with initial data', () => {
    render(<TaskForm onSubmit={vi.fn()} initial={makeTask()} />);
    expect(screen.getByRole('form', { name: /edit task form/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
  });

  it('shows validation error when title is empty', async () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => expect(screen.getByText(/title is required/i)).toBeInTheDocument());
  });

  it('calls onSubmit with correct data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);
    fireEvent.change(document.getElementById('tf-title')!, { target: { value: 'My Task' } });
    fireEvent.change(document.getElementById('tf-priority')!, { target: { value: 'high' } });
    fireEvent.change(document.getElementById('tf-category')!, { target: { value: 'college' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'My Task', priority: 'high', category: 'college' })
    ));
  });

  it('calls onCancel when cancel clicked', () => {
    const onCancel = vi.fn();
    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getAllByRole('button', { name: /cancel/i })[0]);
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<TaskForm onSubmit={vi.fn()} loading={true} />);
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('clears title error on input change', async () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => expect(screen.getByText(/title is required/i)).toBeInTheDocument());
    fireEvent.change(document.getElementById('tf-title')!, { target: { value: 'Fixed' } });
    await waitFor(() => expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument());
  });

  it('renders all priority options', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    const sel = document.getElementById('tf-priority') as HTMLSelectElement;
    expect(Array.from(sel.options).map(o => o.value)).toEqual(['low','medium','high']);
  });

  it('renders all category options', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    const sel = document.getElementById('tf-category') as HTMLSelectElement;
    expect(Array.from(sel.options).map(o => o.value))
      .toEqual(['general','work','personal','college','bug','feature']);
  });

  it('renders due date input', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    expect(document.getElementById('tf-due')).toBeInTheDocument();
  });
});
