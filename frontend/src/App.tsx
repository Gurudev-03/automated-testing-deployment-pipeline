import { useState, useEffect, useCallback, useRef } from 'react';
import Header   from './components/Header';
import StatsBar from './components/StatsBar';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import Filters  from './components/Filters';
import Toast, { type ToastMsg, type ToastType } from './components/Toast';
import { api }  from './api';
import type { Task, TaskFormData, FilterStatus, FilterPriority, FilterCategory, Stats } from './types';
import './App.css';

const EMPTY_STATS: Stats = { total: 0, pending: 0, inProgress: 0, completed: 0, high: 0, overdue: 0 };

export default function App() {
  const [tasks,    setTasks]    = useState<Task[]>([]);
  const [stats,    setStats]    = useState<Stats>(EMPTY_STATS);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [status,   setStatus]   = useState<FilterStatus>('all');
  const [priority, setPriority] = useState<FilterPriority>('all');
  const [category, setCategory] = useState<FilterCategory>('all');
  const [search,   setSearch]   = useState('');
  const [toasts,   setToasts]   = useState<ToastMsg[]>([]);
  const toastId = useRef(0);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  // ── Fetch tasks + stats ────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true); setError('');
      const params = new URLSearchParams();
      if (status   !== 'all') params.set('status',   status);
      if (priority !== 'all') params.set('priority', priority);
      if (category !== 'all') params.set('category', category);
      const q = params.toString();
      const [tasksRes, statsRes] = await Promise.all([
        api.getTasks(q ? `?${q}` : ''),
        api.getStats(),
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch {
      setError('Cannot connect to backend. Make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  }, [status, priority, category]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Client-side search filter ─────────────────────────────────
  const filtered = tasks.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
  });

  // ── Handlers ──────────────────────────────────────────────────
  const handleCreate = async (data: TaskFormData) => {
    setSaving(true);
    try {
      await api.createTask(data);
      setShowForm(false);
      await fetchAll();
      toast('Task created successfully!');
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Failed to create task', 'error');
    } finally { setSaving(false); }
  };

  const handleUpdate = async (data: TaskFormData) => {
    if (!editTask) return;
    setSaving(true);
    try {
      await api.updateTask(editTask.id, data);
      setEditTask(null);
      await fetchAll();
      toast('Task updated successfully!');
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Failed to update task', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await api.deleteTask(id);
      await fetchAll();
      toast('Task deleted.', 'info');
    } catch { toast('Failed to delete task', 'error'); }
  };

  const handleStatus = async (id: number, newStatus: string) => {
    try {
      await api.updateStatus(id, newStatus);
      await fetchAll();
      const label = newStatus === 'completed' ? '✅ Marked complete!' : `Status → ${newStatus}`;
      toast(label);
    } catch { toast('Failed to update status', 'error'); }
  };

  const handleClearCompleted = async () => {
    if (!window.confirm('Clear all completed tasks?')) return;
    try {
      await api.clearCompleted();
      await fetchAll();
      toast('Completed tasks cleared.', 'info');
    } catch { toast('Failed to clear tasks', 'error'); }
  };

  const openNew = () => { setShowForm(true); setEditTask(null); };
  const closeForm = () => { setShowForm(false); setEditTask(null); };

  return (
    <div className="app">
      <Header onNewTask={openNew} />

      <main className="main" id="main-content">
        <div className="container main-inner">

          {/* Stats */}
          <StatsBar stats={stats} />

          {/* Task Form */}
          {(showForm || editTask) && (
            <div className="form-panel fade-in">
              <TaskForm
                onSubmit={editTask ? handleUpdate : handleCreate}
                onCancel={closeForm}
                initial={editTask ?? undefined}
                loading={saving}
              />
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="error-banner" role="alert">
              <span>⚠️ {error}</span>
              <button onClick={() => setError('')} aria-label="Dismiss">✕</button>
            </div>
          )}

          {/* Filters */}
          <Filters
            status={status} priority={priority} category={category} search={search}
            onStatus={setStatus} onPriority={setPriority} onCategory={setCategory}
            onSearch={setSearch} onClear={() => { setStatus('all'); setPriority('all'); setCategory('all'); setSearch(''); }}
            total={filtered.length}
          />

          {/* Toolbar */}
          <div className="task-toolbar">
            <h2 className="task-heading">
              Tasks
              <span className="task-count">{filtered.length}</span>
            </h2>
            <div className="toolbar-actions">
              {stats.completed > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={handleClearCompleted}>
                  🗑️ Clear completed ({stats.completed})
                </button>
              )}
              <button className="btn btn-primary btn-sm" onClick={openNew}>
                ＋ New Task
              </button>
            </div>
          </div>

          {/* Task Grid */}
          {loading ? (
            <div className="state-box" aria-live="polite">
              <div className="spinner" aria-hidden="true" />
              <p>Loading tasks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="state-box empty" role="status">
              <span className="empty-icon" aria-hidden="true">{tasks.length === 0 ? '📋' : '🔍'}</span>
              <p className="empty-title">{tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</p>
              <p className="empty-sub">
                {tasks.length === 0
                  ? 'Create your first task to get started.'
                  : 'Try changing your filters or search query.'}
              </p>
              {tasks.length === 0 && (
                <button className="btn btn-primary" onClick={openNew}>➕ Add First Task</button>
              )}
            </div>
          ) : (
            <div className="task-grid" role="list" aria-label="Task list">
              {filtered.map(t => (
                <TaskCard key={t.id} task={t}
                  onEdit={task => { setEditTask(task); setShowForm(false); }}
                  onDelete={handleDelete}
                  onStatus={handleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span>✅ TaskFlow</span>
            <span className="footer-pipe">|</span>
            <span>Automated Testing &amp; Deployment Pipeline</span>
          </div>
          <div className="footer-team">
            Team: Kaviyarasan · Kesavaram · Kishorekumar · Gurudev · Logeswaran
          </div>
        </div>
      </footer>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
