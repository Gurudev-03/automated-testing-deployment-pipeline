import type { FilterStatus, FilterPriority, FilterCategory } from '../types';
import './Filters.css';

interface Props {
  status:     FilterStatus;
  priority:   FilterPriority;
  category:   FilterCategory;
  search:     string;
  onStatus:   (v: FilterStatus)   => void;
  onPriority: (v: FilterPriority) => void;
  onCategory: (v: FilterCategory) => void;
  onSearch:   (v: string)         => void;
  onClear:    () => void;
  total:      number;
}

const STATUS_TABS = [
  { value: 'all',         label: 'All'         },
  { value: 'pending',     label: '⏳ Pending'   },
  { value: 'in-progress', label: '🔄 Progress'  },
  { value: 'completed',   label: '✅ Completed' },
] as const;

export default function Filters({ status, priority, category, search, onStatus, onPriority, onCategory, onSearch, onClear, total }: Props) {
  const isFiltered = status !== 'all' || priority !== 'all' || category !== 'all' || search !== '';

  return (
    <div className="filters-wrap" role="search" aria-label="Filter and search tasks">
      {/* Search */}
      <div className="search-row">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search" placeholder="Search tasks by title or description..."
            value={search} onChange={e => onSearch(e.target.value)}
            aria-label="Search tasks" className="search-input"
          />
          {search && <button className="search-clear" onClick={() => onSearch('')} aria-label="Clear search">✕</button>}
        </div>
        <span className="results-count" aria-live="polite">{total} task{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Status tabs + dropdowns */}
      <div className="filters-row">
        <div className="status-tabs" role="tablist" aria-label="Filter by status">
          {STATUS_TABS.map(t => (
            <button key={t.value} role="tab" aria-selected={status === t.value}
              className={`status-tab${status === t.value ? ' active' : ''}`}
              onClick={() => onStatus(t.value as FilterStatus)}>{t.label}</button>
          ))}
        </div>

        <div className="filter-dropdowns">
          <select value={priority} onChange={e => onPriority(e.target.value as FilterPriority)}
            aria-label="Filter by priority" className="filter-select">
            <option value="all">All Priority</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <select value={category} onChange={e => onCategory(e.target.value as FilterCategory)}
            aria-label="Filter by category" className="filter-select">
            <option value="all">All Categories</option>
            <option value="general">📋 General</option>
            <option value="work">💼 Work</option>
            <option value="personal">👤 Personal</option>
            <option value="college">🎓 College</option>
            <option value="bug">🐛 Bug</option>
            <option value="feature">✨ Feature</option>
          </select>

          {isFiltered && (
            <button className="btn btn-ghost btn-sm" onClick={onClear} aria-label="Clear all filters">
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
