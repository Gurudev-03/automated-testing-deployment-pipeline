import './Header.css';

interface Props { onNewTask: () => void; }

export default function Header({ onNewTask }: Props) {
  return (
    <header className="header" role="banner">
      <div className="container header-inner">
        <div className="header-brand">
          <div className="header-logo" aria-hidden="true">
            <span>✅</span>
          </div>
          <div>
            <h1 className="header-title">TaskFlow</h1>
            <p className="header-sub">Automated Testing &amp; Deployment Pipeline</p>
          </div>
        </div>
        <div className="header-right">
          <div className="pipeline-badge" aria-label="Pipeline status">
            <span className="pipeline-dot" aria-hidden="true" />
            Pipeline Active
          </div>
          <button className="btn btn-primary" onClick={onNewTask} aria-label="Create new task">
            ＋ New Task
          </button>
        </div>
      </div>
    </header>
  );
}
