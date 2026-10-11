// ── API client — typed calls to the backend REST API ─────────────
import type { Task, TaskFormData, Stats } from './types';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res  = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.errors?.[0] || 'Request failed');
  return json as T;
}

export const api = {
  // Stats
  getStats: () =>
    request<{ data: Stats }>('/api/tasks/stats'),

  // Tasks CRUD
  getTasks: (params = '') =>
    request<{ data: Task[]; count: number }>(`/api/tasks${params}`),

  getTask: (id: number) =>
    request<{ data: Task }>(`/api/tasks/${id}`),

  createTask: (body: TaskFormData) =>
    request<{ data: Task }>('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),

  updateTask: (id: number, body: Partial<TaskFormData>) =>
    request<{ data: Task }>(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  updateStatus: (id: number, status: string) =>
    request<{ data: Task }>(`/api/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  deleteTask: (id: number) =>
    request<{ success: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' }),

  clearCompleted: () =>
    request<{ success: boolean }>('/api/tasks', { method: 'DELETE' }),
};
