import { useState, type FormEvent } from 'react';
import type { Task, TaskFormData } from '../types';
import './TaskForm.css';

interface Props {
  onSubmit:  (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
  initial?:  Task;
  loading?:  boolean;
}

const EMPTY: TaskFormData = {
  title: '', description: '', priority: 'medium',
  status: 'pending', category: 'general', due_date: '',
};

export default function TaskForm({ onSubmit, onCancel, initial, loading }: Props) {
  const [form, setForm]     = useState<TaskFormData>(initial
    ? { title: initial.title, description: initial.description, priority: initial.priority,
        status: initial.status, category: initial.category, due_date: initial.due_date ?? '' }
    : EMPTY);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  const validate = () => {
    const e: Partial<TaskFormData> = {};
    if (!form.title.trim())              e.title = 'Title is required';
    if (form.title.trim().length > 200)  e.title = 'Title too long (max 200 chars)';
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    await onSubmit(form);
    if (!initial) setForm(EMPTY);
  };

  const set = (k: keyof TaskFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }));
    };

  return (
    <form className="task-form card" onSubmit={handleSubmit} noValidate
      aria-label={initial ? 'Edit task form' : 'Add task form'}>
      <div className="form-header">
        <h2 className="form-title">{initial ? '✏️ Edit Task' : '➕ Add New Task'}</h2>
        {onCancel && <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>✕ Cancel</button>}
      </div>

      <div className="form-body">
        <div className="form-group span-full">
          <label htmlFor="tf-title">Title *</label>
          <input id="tf-title" type="text" placeholder="What needs to be done?"
            value={form.title} onChange={set('title')} className={errors.title ? 'error' : ''}
            aria-describedby={errors.title ? 'title-err' : undefined} autoFocus />
          {errors.title && <span id="title-err" className="field-error" role="alert">{errors.title}</span>}
        </div>

        <div className="form-group span-full">
          <label htmlFor="tf-desc">Description</label>
          <textarea id="tf-desc" rows={3} placeholder="Add more details about this task..."
            value={form.description} onChange={set('description')} />
        </div>

        <div className="form-group">
          <label htmlFor="tf-priority">Priority</label>
          <select id="tf-priority" value={form.priority} onChange={set('priority')}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tf-status">Status</label>
          <select id="tf-status" value={form.status} onChange={set('status')}>
            <option value="pending">⏳ Pending</option>
            <option value="in-progress">🔄 In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tf-category">Category</label>
          <select id="tf-category" value={form.category} onChange={set('category')}>
            <option value="general">📋 General</option>
            <option value="work">💼 Work</option>
            <option value="personal">👤 Personal</option>
            <option value="college">🎓 College</option>
            <option value="bug">🐛 Bug</option>
            <option value="feature">✨ Feature</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tf-due">Due Date</label>
          <input id="tf-due" type="date" value={form.due_date} onChange={set('due_date')}
            min={new Date().toISOString().split('T')[0]} />
        </div>
      </div>

      <div className="form-footer">
        <button type="submit" className="btn btn-primary" disabled={loading} aria-busy={loading}>
          {loading ? '⏳ Saving...' : initial ? '💾 Save Changes' : '➕ Add Task'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
