import React from 'react';
import {
  Shield,
  LayoutDashboard,
  FilePlus2,
  CheckCircle2,
  GitCommit,
  FolderGit2,
  Lock,
  Blocks,
  Info,
  ChevronRight,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'register', label: 'Register Evidence', icon: FilePlus2 },
    { id: 'verify', label: 'Verify Integrity', icon: CheckCircle2 },
    { id: 'custody', label: 'Chain of Custody', icon: GitCommit },
    { id: 'repository', label: 'Evidence Repository', icon: FolderGit2 },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'blockchain', label: 'Blockchain Records', icon: Blocks },
    { id: 'about', label: 'About Project', icon: Info }
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 998
          }}
        />
      )}

      <aside className={`forensi-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo and Brand */}
        <div className="sidebar-header">
          <div className="brand-logo-container">
            <div className="brand-icon-shield">
              <Shield className="shield-icon" size={26} />
              <div className="chain-link-overlay">
                <span className="chain-dot"></span>
              </div>
            </div>
            <div className="brand-text">
              <span className="brand-name">
                Forensi<span className="brand-accent">Chain</span>
              </span>
              <span className="brand-badge">DFIR CORE</span>
            </div>
          </div>
          {setIsMobileOpen && (
            <button 
              className="mobile-close-btn"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Tagline / Subtitle */}
        <div className="sidebar-tagline-box">
          <span className="sidebar-tagline">Secure Evidence. Verified Integrity.</span>
          <span className="sidebar-subtagline">Traceable Custody.</span>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav" aria-label="Main Navigation">
          <div className="nav-section-title">CORE OPERATIONS</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="nav-item-icon">
                  <Icon size={18} />
                </div>
                <span className="nav-item-label">{item.label}</span>
                {isActive && <ChevronRight size={14} className="active-chevron" />}
              </button>
            );
          })}
        </nav>

        {/* Footer Status Indicators */}
        <div className="sidebar-footer">
          <div className="sidebar-status-card">
            <div className="status-indicator-row">
              <span className="status-dot green pulse"></span>
              <span className="status-label">Web Crypto Engine: Active</span>
            </div>
            <div className="status-indicator-row">
              <span className="status-dot gray"></span>
              <span className="status-label">Blockchain: Local Demo Mode</span>
            </div>
          </div>
          <div className="sidebar-version-info">
            <span>ForensiChain v1.0.0</span>
            <span className="demo-tag">DEMO</span>
          </div>
        </div>
      </aside>

      <style>{`
        .forensi-sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 999;
          transition: transform var(--transition-smooth);
        }

        .sidebar-header {
          padding: 20px 20px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .brand-logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon-shield {
          position: relative;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(59, 130, 246, 0.2));
          border: 1px solid var(--border-accent);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-teal);
          box-shadow: 0 0 15px rgba(20, 184, 166, 0.15);
        }

        .brand-name {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #FFFFFF;
        }

        .brand-accent {
          color: var(--accent-teal);
        }

        .brand-badge {
          display: block;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .mobile-close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: none;
        }

        .sidebar-tagline-box {
          padding: 12px 20px;
          background-color: rgba(15, 23, 42, 0.4);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-tagline {
          font-size: 0.72rem;
          color: var(--accent-teal);
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .sidebar-subtagline {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .sidebar-nav {
          flex: 1;
          padding: 18px 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-section-title {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          padding: 6px 12px 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          color: var(--text-main);
          background-color: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .nav-item.active {
          color: #FFFFFF;
          background: linear-gradient(90deg, rgba(20, 184, 166, 0.16) 0%, rgba(20, 184, 166, 0.04) 100%);
          border-color: rgba(20, 184, 166, 0.35);
          font-weight: 600;
        }

        .nav-item.active .nav-item-icon {
          color: var(--accent-teal);
        }

        .nav-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }

        .nav-item:hover .nav-item-icon {
          color: var(--accent-teal);
        }

        .nav-item-label {
          flex: 1;
        }

        .active-chevron {
          color: var(--accent-teal);
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: #0E1424;
        }

        .sidebar-status-card {
          background-color: var(--bg-dark);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .status-indicator-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .status-dot.green {
          background-color: var(--status-success);
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        .status-dot.gray {
          background-color: var(--text-muted);
        }

        .status-dot.pulse {
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }

        .status-label {
          font-size: 0.74rem;
          color: var(--text-secondary);
        }

        .sidebar-version-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-muted);
          padding: 0 4px;
        }

        .demo-tag {
          background-color: rgba(59, 130, 246, 0.2);
          color: #93C5FD;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
        }

        @media (max-width: 900px) {
          .forensi-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
          }

          .forensi-sidebar.mobile-open {
            transform: translateX(0);
          }

          .mobile-close-btn {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
