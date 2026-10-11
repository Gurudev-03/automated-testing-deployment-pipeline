import type { Stats } from '../types';
import './StatsBar.css';

interface Props { stats: Stats; }

export default function StatsBar({ stats }: Props) {
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-bar" role="region" aria-label="Task statistics">
      <div className="stats-cards">
        <StatCard value={stats.total}      label="Total"       color="var(--text2)"   icon="📋" />
        <StatCard value={stats.pending}    label="Pending"     color="var(--text2)"   icon="⏳" />
        <StatCard value={stats.inProgress} label="In Progress" color="var(--accent)"  icon="🔄" />
        <StatCard value={stats.completed}  label="Completed"   color="var(--success)" icon="✅" />
        <StatCard value={stats.high}       label="High Priority" color="var(--danger)" icon="🔴" />
        <StatCard value={stats.overdue}    label="Overdue"     color="var(--danger)"  icon="⚠️" />
      </div>
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Overall Progress</span>
          <span className="progress-pct" style={{ color: pct === 100 ? 'var(--success)' : 'var(--accent)' }}>{pct}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pct}% of tasks completed`}
          />
        </div>
        <div className="progress-segments">
          {stats.total > 0 && <>
            <div className="seg seg-completed" style={{ width: `${(stats.completed / stats.total) * 100}%` }} title="Completed" />
            <div className="seg seg-progress"  style={{ width: `${(stats.inProgress / stats.total) * 100}%` }} title="In Progress" />
            <div className="seg seg-pending"   style={{ width: `${(stats.pending / stats.total) * 100}%` }} title="Pending" />
          </>}
        </div>
        <div className="progress-legend">
          <span className="leg leg-completed">✅ Completed</span>
          <span className="leg leg-progress">🔄 In Progress</span>
          <span className="leg leg-pending">⏳ Pending</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color, icon }: { value: number; label: string; color: string; icon: string }) {
  return (
    <div className="stat-card card">
      <div className="stat-top">
        <span className="stat-icon">{icon}</span>
        <span className="stat-val" style={{ color }}>{value}</span>
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
}
