import React from 'react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  accentColor = 'teal',
  subtitle,
  badgeText = 'Demo Data',
  onClick
}) {
  const colorMap = {
    teal: {
      glow: 'rgba(20, 184, 166, 0.15)',
      border: 'rgba(20, 184, 166, 0.3)',
      text: '#14B8A6'
    },
    green: {
      glow: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#10B981'
    },
    red: {
      glow: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#EF4444'
    },
    blue: {
      glow: 'rgba(59, 130, 246, 0.15)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#3B82F6'
    }
  };

  const style = colorMap[accentColor] || colorMap.teal;

  return (
    <div 
      className="stat-card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        '--card-glow': style.glow,
        '--card-accent-border': style.border,
        '--card-accent-text': style.text
      }}
    >
      <div className="stat-card-top">
        <span className="stat-title">{title}</span>
        {badgeText && <span className="stat-demo-badge">{badgeText}</span>}
      </div>

      <div className="stat-body">
        <div className="stat-value">{value}</div>
        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={24} />
          </div>
        )}
      </div>

      {subtitle && <div className="stat-subtitle">{subtitle}</div>}

      <style>{`
        .stat-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: all var(--transition-fast);
        }

        .stat-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background-color: var(--card-accent-text);
          opacity: 0.8;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--card-accent-border);
          box-shadow: 0 8px 24px var(--card-glow);
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .stat-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .stat-demo-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
          background-color: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.25);
          color: #93C5FD;
          letter-spacing: 0.04em;
        }

        .stat-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background-color: var(--card-glow);
          border: 1px solid var(--card-accent-border);
          color: var(--card-accent-text);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
