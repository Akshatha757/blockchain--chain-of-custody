import React, { useState } from 'react';
import {
  Menu,
  Bell,
  User,
  RotateCcw,
  Sparkles,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { SYNTHETIC_SAMPLE_FILES, resetDemoData, getAllActivities } from '../services/evidenceService';

export default function Topbar({
  activePage,
  setIsMobileOpen,
  onResetData,
  onNotify
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTestFilesModal, setShowTestFilesModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activities = getAllActivities().slice(0, 5);

  const pageTitles = {
    dashboard: 'Forensic Operations Dashboard',
    register: 'Register Digital Evidence',
    verify: 'Cryptographic Integrity Verification',
    custody: 'Chain of Custody Tracking',
    repository: 'Evidence Master Repository',
    security: 'Role-Based Security & Access Control',
    blockchain: 'Blockchain Integrity Ledger',
    about: 'About ForensiChain Project'
  };

  const downloadSampleFile = (key, isTampered = false) => {
    const fileData = SYNTHETIC_SAMPLE_FILES[key];
    if (!fileData) return;

    const content = isTampered ? fileData.tamperedContent : fileData.content;
    const filename = isTampered 
      ? `TAMPERED_${fileData.name}` 
      : fileData.name;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onNotify?.({
      type: isTampered ? 'warning' : 'success',
      title: isTampered ? 'Tampered File Downloaded' : 'Sample File Downloaded',
      message: `Downloaded ${filename} for integrity testing.`
    });
  };

  const handleResetConfirm = async () => {
    await resetDemoData();
    setShowResetConfirm(false);
    onNotify?.({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'Restored original synthetic demonstration records.'
    });
    if (onResetData) onResetData();
  };

  return (
    <>
      <header className="forensi-topbar">
        <div className="topbar-left">
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb-box">
            <span className="breadcrumb-root">ForensiChain</span>
            <span className="breadcrumb-separator">/</span>
            <h1 className="breadcrumb-current">{pageTitles[activePage] || 'Dashboard'}</h1>
          </div>
        </div>

        <div className="topbar-right">
          {/* Test Sandbox Helper Button */}
          <button
            className="btn btn-outline btn-sm test-sandbox-btn"
            onClick={() => setShowTestFilesModal(true)}
            title="Download synthetic test files for verification scenarios"
          >
            <Sparkles size={15} />
            <span>Test Files Sandbox</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowResetConfirm(true)}
            title="Reset to default synthetic demo data"
          >
            <RotateCcw size={14} />
            <span className="hide-on-mobile">Reset Demo</span>
          </button>

          {/* Notification Bell */}
          <div className="notification-dropdown-wrapper">
            <button
              className="topbar-icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View activity alerts"
              title="Activity notifications"
            >
              <Bell size={18} />
              {activities.length > 0 && <span className="notification-dot" />}
            </button>

            {showNotifications && (
              <div className="notification-panel">
                <div className="notification-panel-header">
                  <span className="panel-title">Recent Activity Log</span>
                  <span className="badge badge-demo">Local Demo</span>
                </div>
                <div className="notification-list">
                  {activities.length === 0 ? (
                    <div className="no-notifications">No recent activities recorded</div>
                  ) : (
                    activities.map((act) => (
                      <div key={act.id} className="notification-item">
                        <div className="notification-icon-box">
                          {act.status === 'VERIFIED' ? (
                            <CheckCircle size={15} className="text-green" />
                          ) : act.status === 'ALERT' ? (
                            <AlertTriangle size={15} className="text-red" />
                          ) : (
                            <Clock size={15} className="text-teal" />
                          )}
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">{act.title}</div>
                          <div className="notification-desc">{act.description}</div>
                          <div className="notification-time">
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.actor}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="notification-panel-footer">
                  <span>Saved in Browser LocalStorage</span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="user-profile-badge">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-details hide-on-mobile">
              <span className="user-name">Forensic Investigator</span>
              <span className="user-unit">DFIR Operations Unit</span>
            </div>
            <span className="role-pill">OFFICER</span>
          </div>
        </div>
      </header>

      {/* Test Sandbox Modal */}
      {showTestFilesModal && (
        <div className="modal-overlay" onClick={() => setShowTestFilesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cyber-card-header" style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="cyber-card-title">
                <Sparkles className="text-teal" size={22} />
                <span>Synthetic Test Files Sandbox</span>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowTestFilesModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <div className="cyber-callout cyber-callout-info" style={{ marginBottom: '20px' }}>
                <ShieldCheck size={20} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.85rem' }}>
                  Use these instant sample files to perform <strong>Scenario Testing</strong> (Test 1 to 7).
                  Upload the original file to see <strong>INTEGRITY VERIFIED</strong>. Upload the tampered file to see <strong>INTEGRITY MISMATCH</strong> with zero manual file creation needed!
                </div>
              </div>

              <div className="test-files-grid">
                {Object.entries(SYNTHETIC_SAMPLE_FILES).map(([key, item]) => (
                  <div key={key} className="test-file-card">
                    <div className="test-file-info">
                      <span className="test-file-id">{key}</span>
                      <strong className="test-file-name">{item.name}</strong>
                      <span className="badge badge-neutral" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                        {item.type}
                      </span>
                    </div>

                    <div className="test-file-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => downloadSampleFile(key, false)}
                      >
                        <Download size={13} />
                        <span>Download Original</span>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => downloadSampleFile(key, true)}
                        title="Modified copy with altered payload to test mismatch detection"
                      >
                        <AlertTriangle size={13} />
                        <span>Download Tampered</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowTestFilesModal(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <AlertTriangle className="text-amber" size={26} />
                <h3 style={{ fontSize: '1.2rem' }}>Reset Demonstration Data?</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                This will restore the initial synthetic sample evidence records (EVD-001, EVD-002, EVD-003) and clear any locally registered evidence or custom custody transfers.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleResetConfirm}
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .forensi-topbar {
          height: var(--topbar-height);
          background-color: rgba(17, 24, 39, 0.75);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mobile-menu-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        .breadcrumb-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .breadcrumb-root {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: var(--border-light);
          font-size: 0.8rem;
        }

        .breadcrumb-current {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .test-sandbox-btn {
          border-color: rgba(20, 184, 166, 0.4);
          background: rgba(20, 184, 166, 0.08);
        }

        .topbar-icon-btn {
          position: relative;
          background-color: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .topbar-icon-btn:hover {
          color: var(--text-main);
          border-color: var(--border-light);
          background-color: #1E293B;
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-teal);
          box-shadow: 0 0 8px var(--accent-teal);
        }

        .notification-dropdown-wrapper {
          position: relative;
        }

        .notification-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 360px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          z-index: 1000;
          animation: fadeIn 0.15s ease-out;
        }

        .notification-panel-header {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-subtle);
          background-color: #0F172A;
        }

        .panel-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .notification-list {
          max-height: 320px;
          overflow-y: auto;
        }

        .notification-item {
          padding: 12px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background-color var(--transition-fast);
        }

        .notification-item:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .notification-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .notification-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin: 2px 0 4px;
          line-height: 1.35;
        }

        .notification-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .no-notifications {
          padding: 24px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .notification-panel-footer {
          padding: 10px 16px;
          font-size: 0.72rem;
          color: var(--text-muted);
          text-align: center;
          background-color: #0E1424;
          border-top: 1px solid var(--border-subtle);
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          background-color: #172033;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(59, 130, 246, 0.2));
          border: 1px solid var(--border-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-teal);
        }

        .user-name {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .user-unit {
          display: block;
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .role-pill {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          background: rgba(20, 184, 166, 0.15);
          color: var(--accent-teal);
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .test-files-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .test-file-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          gap: 16px;
        }

        .test-file-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .test-file-id {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--accent-teal);
        }

        .test-file-name {
          font-size: 0.9rem;
          color: var(--text-main);
        }

        .test-file-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 900px) {
          .forensi-topbar {
            padding: 0 16px;
          }
          .mobile-menu-toggle {
            display: block;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
