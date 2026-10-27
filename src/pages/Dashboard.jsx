import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  ShieldAlert,
  Cpu,
  Server,
  Blocks,
  FilePlus2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import StatCard from '../components/StatCard';
import EvidenceTable from '../components/EvidenceTable';
import StatusBadge from '../components/StatusBadge';
import { getForensicStatistics, getAllEvidence, getAllActivities } from '../services/evidenceService';

export default function Dashboard({
  onNavigate,
  onViewDetails,
  onVerifyEvidence,
  onTransferEvidence,
  onNotify
}) {
  const stats = getForensicStatistics();
  const evidenceList = getAllEvidence();
  const activities = getAllActivities().slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Top Banner / Scenario Testing Quick Guide */}
      <div className="dashboard-welcome-banner">
        <div className="banner-left">
          <div className="banner-badge">
            <span className="pulse-dot" />
            <span>DFIR FORENSIC INCIDENT DISPATCH</span>
          </div>
          <h2>Cryptographic Digital Evidence Integrity & Custody</h2>
          <p>
            Demonstrating tamper-evident evidence acquisition, SHA-256 integrity verification, and verifiable custody transfer trails.
          </p>
        </div>
        <div className="banner-actions">
          <button
            className="btn btn-primary"
            onClick={() => onNavigate('register')}
          >
            <FilePlus2 size={16} />
            <span>Register New Evidence</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate('verify')}
          >
            <CheckCircle2 size={16} />
            <span>Verify File Hash</span>
          </button>
        </div>
      </div>

      {/* System Status Indicators Row */}
      <div className="system-status-grid">
        <div className="status-metric-card operational">
          <div className="status-metric-header">
            <Cpu size={18} className="text-teal" />
            <span className="status-name">Frontend Architecture</span>
          </div>
          <div className="status-metric-value">
            <span className="status-bullet green" />
            <strong>Operational</strong>
          </div>
          <span className="status-note">React 18 + Vite (SPA)</span>
        </div>

        <div className="status-metric-card operational">
          <div className="status-metric-header">
            <ShieldCheck size={18} className="text-green" />
            <span className="status-name">SHA-256 Hashing Engine</span>
          </div>
          <div className="status-metric-value">
            <span className="status-bullet green" />
            <strong>Active</strong>
          </div>
          <span className="status-note">Native Web Crypto API</span>
        </div>

        <div className="status-metric-card disconnected">
          <div className="status-metric-header">
            <Server size={18} className="text-secondary" />
            <span className="status-name">Backend API Server</span>
          </div>
          <div className="status-metric-value">
            <span className="status-bullet gray" />
            <strong>Not Connected</strong>
          </div>
          <span className="status-note">Demo Persistence (LocalStorage)</span>
        </div>

        <div className="status-metric-card disconnected">
          <div className="status-metric-header">
            <Blocks size={18} className="text-secondary" />
            <span className="status-name">Blockchain Smart Contract</span>
          </div>
          <div className="status-metric-value">
            <span className="status-bullet gray" />
            <strong>Not Connected</strong>
          </div>
          <span className="status-note">Local Demo Mode (No RPC)</span>
        </div>
      </div>

      {/* Forensic Statistics Cards */}
      <div className="stats-row">
        <StatCard
          title="Total Registered Evidence"
          value={stats.totalRegistered}
          icon={FileText}
          accentColor="teal"
          subtitle="Artifacts logged in local catalog"
          badgeText="Demo Data"
          onClick={() => onNavigate('repository')}
        />
        <StatCard
          title="Integrity Verified"
          value={stats.integrityVerified}
          icon={CheckCircle2}
          accentColor="green"
          subtitle="SHA-256 matches verified baseline"
          badgeText="Demo Data"
          onClick={() => onNavigate('verify')}
        />
        <StatCard
          title="Integrity Mismatch"
          value={stats.integrityMismatch}
          icon={AlertTriangle}
          accentColor="red"
          subtitle="Modifications / tampering alerts"
          badgeText="Demo Data"
          onClick={() => onNavigate('verify')}
        />
        <StatCard
          title="Custody Transfers"
          value={stats.totalTransfers}
          icon={GitCommit}
          accentColor="blue"
          subtitle="Verified handovers between custodians"
          badgeText="Demo Data"
          onClick={() => onNavigate('custody')}
        />
      </div>

      {/* Main Grid: Recent Evidence & Activity Stream */}
      <div className="dashboard-main-grid">
        {/* Left Column: Recent Evidence */}
        <div className="cyber-card dashboard-evidence-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <FileText className="text-teal" size={20} />
              <span>Recent Evidence Records</span>
              <span className="badge badge-demo">Synthetic Demo Data</span>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('repository')}
            >
              <span>View All Repository</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <EvidenceTable
            evidenceList={evidenceList}
            onViewDetails={onViewDetails}
            onVerify={onVerifyEvidence}
            onTransfer={onTransferEvidence}
            onNotify={onNotify}
            showSearchAndFilter={false}
            maxRows={4}
            compact={false}
          />
        </div>

        {/* Right Column: Recent Activities */}
        <div className="cyber-card dashboard-activity-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Clock className="text-blue" size={20} />
              <span>Forensic Activity Stream</span>
            </div>
            <span className="badge badge-neutral">Live Session</span>
          </div>

          <div className="dashboard-activity-list">
            {activities.length === 0 ? (
              <div className="empty-activities">No recorded activities</div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="dash-activity-item">
                  <div className="dash-activity-icon">
                    {act.status === 'VERIFIED' ? (
                      <CheckCircle2 size={16} className="text-green" />
                    ) : act.status === 'ALERT' ? (
                      <AlertTriangle size={16} className="text-red" />
                    ) : act.type === 'CUSTODY_TRANSFER' ? (
                      <GitCommit size={16} className="text-blue" />
                    ) : (
                      <FilePlus2 size={16} className="text-teal" />
                    )}
                  </div>
                  <div className="dash-activity-body">
                    <div className="dash-activity-header">
                      <span className="dash-activity-title">{act.title}</span>
                      <span className="dash-activity-time font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="dash-activity-desc">{act.description}</div>
                    <div className="dash-activity-meta">
                      <span className="meta-tag">{act.evidenceId || 'CORE'}</span>
                      <span className="meta-actor">By: {act.actor}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="activity-card-footer">
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
              onClick={() => onNavigate('custody')}
            >
              <span>View Full Custody Timeline</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-welcome-banner {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
          border: 1px solid var(--border-subtle);
          border-left: 4px solid var(--accent-teal);
          border-radius: var(--radius-lg);
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          box-shadow: var(--shadow-card);
          flex-wrap: wrap;
        }

        .banner-left {
          flex: 1;
          min-width: 300px;
        }

        .banner-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent-teal);
          margin-bottom: 8px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-teal);
          box-shadow: 0 0 10px var(--accent-teal);
          animation: statusPulse 2s infinite;
        }

        .banner-left h2 {
          font-size: 1.45rem;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .banner-left p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          max-width: 680px;
          line-height: 1.45;
        }

        .banner-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        /* System Status Indicators */
        .system-status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .status-metric-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
        }

        .status-metric-card.operational {
          border-top: 2px solid var(--accent-teal);
        }

        .status-metric-card.disconnected {
          border-top: 2px solid var(--border-light);
          opacity: 0.88;
        }

        .status-metric-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-name {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .status-metric-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.05rem;
          color: var(--text-main);
        }

        .status-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-bullet.green {
          background-color: var(--status-success);
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        .status-bullet.gray {
          background-color: var(--text-muted);
        }

        .status-note {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }

        /* Main Grid */
        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
        }

        .dashboard-activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .dash-activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          transition: border-color var(--transition-fast);
        }

        .dash-activity-item:hover {
          border-color: var(--border-light);
        }

        .dash-activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #172033;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .dash-activity-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dash-activity-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .dash-activity-title {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .dash-activity-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .dash-activity-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        .dash-activity-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.7rem;
          margin-top: 2px;
        }

        .meta-tag {
          color: var(--accent-teal);
          font-family: var(--font-mono);
        }

        .meta-actor {
          color: var(--text-muted);
        }

        .activity-card-footer {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
        }

        .empty-activities {
          text-align: center;
          color: var(--text-muted);
          padding: 30px;
        }

        @media (max-width: 1200px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
