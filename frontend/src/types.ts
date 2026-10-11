// ── Shared TypeScript types ───────────────────────────────────────

export type Priority = 'low' | 'medium' | 'high';
export type Status   = 'pending' | 'in-progress' | 'completed';
export type Category = 'general' | 'work' | 'personal' | 'college' | 'bug' | 'feature';

export interface Task {
  id:          number;
  title:       string;
  description: string;
  priority:    Priority;
  status:      Status;
  category:    Category;
  due_date:    string | null;
  created_at:  string;
  updated_at:  string;
}

export interface TaskFormData {
  title:       string;
  description: string;
  priority:    Priority;
  status:      Status;
  category:    Category;
  due_date:    string;
}

export type FilterStatus   = 'all' | Status;
export type FilterPriority = 'all' | Priority;
export type FilterCategory = 'all' | Category;

export interface Stats {
  total:       number;
  pending:     number;
  inProgress:  number;
  completed:   number;
  high:        number;
  overdue:     number;
}
