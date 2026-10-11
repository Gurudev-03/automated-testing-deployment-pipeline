import { useEffect } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info';
export interface ToastMsg { id: number; message: string; type: ToastType; }

interface Props {
  toasts:   ToastMsg[];
  onRemove: (id: number) => void;
}

const ICONS: Record<ToastType, string> = { success: '✅', error: '❌', info: 'ℹ️' };

export default function Toast({ toasts, onRemove }: Props) {
  return (
    <div className="toast-container" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMsg; onRemove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`toast toast-${toast.type} slide-in`} role="alert">
      <span className="toast-icon">{ICONS[toast.type]}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove(toast.id)} aria-label="Dismiss">✕</button>
    </div>
  );
}
