import type { Task } from '../types';
import './TaskCard.css';

interface Props {
  task:     Task;
  onEdit:   (task: Task) => void;
  onDelete: (id: number) => void;
  onStatus: (id: number, status: string) => void;
}

const NEXT_STATUS: Record<string, string>  = { 'pending': 'in-progress', 'in-progress': 'completed', 'completed': 'pending' };
const NEXT_LABEL:  Record<string, string>  = { 'pending': 'Start',       'in-progress': 'Complete',  'completed': 'Reopen'  };
const NEXT_ICON:   Record<string, string>  = { 'pending': '▶',           'in-progress': '✅',         'completed': '🔄'      };
const CAT_ICON:    Record<string, string>  = { general:'📋', work:'💼', personal:'👤', college:'🎓', bug:'🐛', feature:'✨' };

function isOverdue(task: Task) {
  if (!task.due_date || task.status === 'completed') return false;
  return new Date(task.due_date) < new Date();
}

function formatDue(due: string | null) {
  if (!due) return null;
  return new Date(due).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TaskCard({ task, onEdit, onDelete, onStatus }: Props) {
  const overdue  = isOverdue(task);
  const dueLabel = formatDue(task.due_date);

  return (
    <article
      className={`task-card card fade-up priority-${task.priority}${task.status === 'completed' ? ' completed-card' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      {/* Top row — badges */}
      <div className="tc-top">
        <div className="tc-badges">
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          <span className={`badge badge-${task.status}`}>{task.status}</span>
          <span className={`badge badge-${task.category}`}>{CAT_ICON[task.category]} {task.category}</span>
        </div>
        {overdue && <span className="badge badge-overdue">⚠️ Overdue</span>}
      </div>

      {/* Title */}
      <h3 className={`tc-title${task.status === 'completed' ? ' done' : ''}`}>{task.title}</h3>

      {/* Description */}
      {task.description && <p className="tc-desc">{task.description}</p>}

      {/* Due date */}
      {dueLabel && (
        <div className={`tc-due${overdue ? ' overdue' : ''}`}>
          📅 Due: {dueLabel}
        </div>
      )}

      {/* Actions */}
      <div className="tc-actions">
        <button
          className={`btn btn-xs ${task.status === 'completed' ? 'btn-ghost' : 'btn-success'}`}
          onClick={() => onStatus(task.id, NEXT_STATUS[task.status])}
          aria-label={`${NEXT_LABEL[task.status]} task ${task.title}`}
        >
          {NEXT_ICON[task.status]} {NEXT_LABEL[task.status]}
        </button>
        <button className="btn btn-xs btn-ghost" onClick={() => onEdit(task)} aria-label={`Edit task ${task.title}`}>
          ✏️ Edit
        </button>
        <button className="btn btn-xs btn-danger" onClick={() => onDelete(task.id)} aria-label={`Delete task ${task.title}`}>
          🗑️
        </button>
      </div>
    </article>
  );
}
