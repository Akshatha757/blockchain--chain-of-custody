import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastNotification({ notifications, onDismiss }) {
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(notifications[0].id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notifications, onDismiss]);

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {notifications.map((n) => {
        const isSuccess = n.type === 'success';
        const isError = n.type === 'error';
        const isWarning = n.type === 'warning';

        return (
          <div key={n.id} className={`toast toast-${n.type || 'info'}`}>
            <div className="toast-icon">
              {isSuccess && <CheckCircle2 size={18} className="text-green" />}
              {isError && <AlertTriangle size={18} className="text-red" />}
              {isWarning && <AlertTriangle size={18} className="text-amber" />}
              {!isSuccess && !isError && !isWarning && <Info size={18} className="text-blue" />}
            </div>
            <div className="toast-body">
              {n.title && <div className="toast-title">{n.title}</div>}
              <div className="toast-message">{n.message}</div>
            </div>
            <button 
              className="toast-close"
              onClick={() => onDismiss(n.id)}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}

      <style>{`
        .toast-body {
          flex: 1;
        }
        .toast-title {
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .toast-message {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }
        .toast-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color var(--transition-fast);
        }
        .toast-close:hover {
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
}
