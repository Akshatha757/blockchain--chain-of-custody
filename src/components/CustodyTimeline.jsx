import React from 'react';
import {
  FilePlus2,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  ArrowRight,
  Database
} from 'lucide-react';

export default function CustodyTimeline({ events = [], evidenceFilter = 'ALL' }) {
  const filteredEvents = events.filter((ev) => {
    if (evidenceFilter === 'ALL') return true;
    return ev.evidenceId?.toLowerCase() === evidenceFilter.toLowerCase();
  });

  const getEventIcon = (type, status) => {
    switch (type) {
      case 'EVIDENCE_REGISTERED':
        return <FilePlus2 size={16} className="text-teal" />;
      case 'CUSTODY_TRANSFER':
        return <GitCommit size={16} className="text-blue" />;
      case 'INTEGRITY_VERIFIED':
        return <CheckCircle2 size={16} className="text-green" />;
      case 'INTEGRITY_MISMATCH':
        return <AlertTriangle size={16} className="text-red" />;
      default:
        return <Clock size={16} className="text-secondary" />;
    }
  };

  const getEventBorderClass = (type, status) => {
    if (type === 'INTEGRITY_MISMATCH') return 'border-mismatch';
    if (type === 'INTEGRITY_VERIFIED') return 'border-verified';
    if (type === 'CUSTODY_TRANSFER') return 'border-transfer';
    return 'border-registered';
  };

  return (
    <div className="custody-timeline-wrapper">
      <div className="timeline-header-meta">
        <span className="timeline-count-badge">
          Showing {filteredEvents.length} Chain of Custody Event{filteredEvents.length !== 1 ? 's' : ''}
        </span>
        <span className="badge badge-demo">Local Demo Records</span>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="empty-timeline-state">
          <Clock size={36} className="empty-timeline-icon" />
          <h4>No Custody Events Logged</h4>
          <p>Register evidence or perform custody handovers to populate the audit timeline.</p>
        </div>
      ) : (
        <div className="timeline-track">
          {filteredEvents.map((event, idx) => (
            <div key={event.id || idx} className={`timeline-node ${getEventBorderClass(event.type, event.status)}`}>
              <div className="timeline-marker">
                <div className="marker-icon-box">
                  {getEventIcon(event.type, event.status)}
                </div>
                {idx !== filteredEvents.length - 1 && <div className="marker-connector" />}
              </div>

              <div className="timeline-card">
                <div className="timeline-card-header">
                  <div className="card-header-left">
                    <span className="event-type-badge font-mono">{event.evidenceId || 'CORE'}</span>
                    <strong className="event-title">{event.title}</strong>
                  </div>
                  <span className="event-timestamp">
                    {new Date(event.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="event-description">{event.description}</p>

                <div className="event-meta-footer">
                  <div className="actor-info">
                    <span className="meta-label">Handler / Actor:</span>
                    <span className="meta-actor-name">{event.actor}</span>
                  </div>

                  <div className="integrity-status-pill">
                    <span className="status-indicator-dot" />
                    <span>{event.status || 'RECORDED'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="timeline-honesty-disclaimer">
        <Database size={15} className="text-secondary" />
        <span>
          <strong>Forensic Integrity Note:</strong> In this local release, timeline entries are recorded via browser localStorage. Once connected, smart contract events (<code>EvidenceRegistered</code>, <code>CustodyTransferred</code>) will provide decentralized provenance.
        </span>
      </div>

      <style>{`
        .custody-timeline-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-header-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
        }

        .timeline-count-badge {
          font-size: 0.82rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .empty-timeline-state {
          padding: 48px 24px;
          text-align: center;
          background-color: var(--bg-card);
          border: 1px dashed var(--border-light);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .empty-timeline-icon {
          color: var(--text-muted);
        }

        .empty-timeline-state h4 {
          color: var(--text-main);
          font-size: 1.05rem;
        }

        .empty-timeline-state p {
          color: var(--text-secondary);
          font-size: 0.85rem;
          max-width: 400px;
        }

        .timeline-track {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .timeline-node {
          display: flex;
          gap: 16px;
          position: relative;
          padding-bottom: 24px;
        }

        .timeline-node:last-child {
          padding-bottom: 8px;
        }

        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 38px;
          flex-shrink: 0;
        }

        .marker-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #0F172A;
          border: 2px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }

        .timeline-node.border-verified .marker-icon-box {
          border-color: var(--status-success);
          background-color: rgba(16, 185, 129, 0.1);
        }

        .timeline-node.border-mismatch .marker-icon-box {
          border-color: var(--status-error);
          background-color: rgba(239, 68, 68, 0.15);
        }

        .timeline-node.border-transfer .marker-icon-box {
          border-color: var(--accent-blue);
          background-color: rgba(59, 130, 246, 0.1);
        }

        .timeline-node.border-registered .marker-icon-box {
          border-color: var(--accent-teal);
          background-color: rgba(20, 184, 166, 0.1);
        }

        .marker-connector {
          width: 2px;
          flex: 1;
          background: linear-gradient(180deg, var(--border-light) 0%, rgba(51, 65, 85, 0.3) 100%);
          margin: 6px 0 -12px;
        }

        .timeline-card {
          flex: 1;
          background-color: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: var(--shadow-card);
          transition: border-color var(--transition-fast);
        }

        .timeline-card:hover {
          border-color: var(--border-light);
        }

        .timeline-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .card-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .event-type-badge {
          font-size: 0.72rem;
          color: var(--accent-teal);
          background-color: rgba(20, 184, 166, 0.1);
          border: 1px solid var(--border-accent);
          padding: 2px 7px;
          border-radius: 4px;
        }

        .event-title {
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .event-timestamp {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .event-description {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .event-meta-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          font-size: 0.78rem;
          flex-wrap: wrap;
          gap: 8px;
        }

        .actor-info {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .meta-label {
          color: var(--text-muted);
        }

        .meta-actor-name {
          color: var(--text-primary);
          font-weight: 600;
        }

        .integrity-status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
          background-color: #0F172A;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .status-indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-teal);
        }

        .timeline-honesty-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background-color: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
