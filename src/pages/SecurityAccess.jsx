import React, { useState } from 'react';
import {
  Lock,
  Shield,
  UserCheck,
  Check,
  X,
  AlertTriangle,
  FileText,
  KeyRound,
  Eye,
  Settings,
  Users,
  ShieldAlert
} from 'lucide-react';

export default function SecurityAccess() {
  const [selectedRole, setSelectedRole] = useState('investigator');

  const roles = [
    {
      id: 'investigator',
      name: 'Digital Forensic Investigator',
      badge: 'INVESTIGATOR',
      color: 'teal',
      description: 'Acquires raw digital evidence from endpoints, calculates cryptographic hashes, and logs initial custody baseline.',
      permissions: [
        { name: 'Register Digital Evidence', allowed: true },
        { name: 'Perform SHA-256 Integrity Checks', allowed: true },
        { name: 'View Evidence Repository', allowed: true },
        { name: 'Record Custody Handover', allowed: false },
        { name: 'Review Chain of Custody History', allowed: true },
        { name: 'System User & Role Administration', allowed: false }
      ]
    },
    {
      id: 'custodian',
      name: 'Evidence Vault Custodian',
      badge: 'CUSTODIAN',
      color: 'blue',
      description: 'Manages physical and logical storage of forensic artifacts, verifies tamper seals, and authorizes custody transfers.',
      permissions: [
        { name: 'Register Digital Evidence', allowed: false },
        { name: 'Perform SHA-256 Integrity Checks', allowed: true },
        { name: 'View Evidence Repository', allowed: true },
        { name: 'Record Custody Handover', allowed: true },
        { name: 'Review Chain of Custody History', allowed: true },
        { name: 'System User & Role Administration', allowed: false }
      ]
    },
    {
      id: 'auditor',
      name: 'Independent Legal / Compliance Auditor',
      badge: 'AUDITOR',
      color: 'green',
      description: 'Inspects tamper-evident audit logs, verifies forensic integrity before court presentation, and validates legal compliance.',
      permissions: [
        { name: 'Register Digital Evidence', allowed: false },
        { name: 'Perform SHA-256 Integrity Checks', allowed: true },
        { name: 'View Evidence Repository', allowed: true },
        { name: 'Record Custody Handover', allowed: false },
        { name: 'Review Chain of Custody History', allowed: true },
        { name: 'System User & Role Administration', allowed: false }
      ]
    },
    {
      id: 'admin',
      name: 'DFIR System Administrator',
      badge: 'ADMINISTRATOR',
      color: 'amber',
      description: 'Maintains system health, configures smart contract endpoints, and oversees user accounts.',
      permissions: [
        { name: 'Register Digital Evidence', allowed: true },
        { name: 'Perform SHA-256 Integrity Checks', allowed: true },
        { name: 'View Evidence Repository', allowed: true },
        { name: 'Record Custody Handover', allowed: true },
        { name: 'Review Chain of Custody History', allowed: true },
        { name: 'System User & Role Administration', allowed: true }
      ]
    }
  ];

  const currentRoleObj = roles.find((r) => r.id === selectedRole) || roles[0];

  return (
    <div className="security-page">
      {/* Honest Disclaimer Callout as Required */}
      <div className="cyber-callout cyber-callout-warning">
        <ShieldAlert size={24} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.86rem' }}>
          <strong>Access Control Demonstration Notice:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Frontend role displays are for demonstration. Real access control must be enforced by the backend and, where applicable, the smart contract (via cryptographic wallet signatures and <code>onlyCustodian</code> modifier guards). No fake user session or mock authentication is claimed.
          </p>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="roles-overview-grid">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <div
              key={role.id}
              className={`cyber-card role-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="role-card-top">
                <span className={`badge badge-${role.color === 'teal' ? 'teal' : role.color === 'blue' ? 'demo' : role.color === 'green' ? 'verified' : 'pending'}`}>
                  {role.badge}
                </span>
                <KeyRound size={16} className="text-secondary" />
              </div>

              <h3 className="role-name">{role.name}</h3>
              <p className="role-description">{role.description}</p>

              <div className="role-card-footer">
                <span className="permission-count">
                  {role.permissions.filter((p) => p.allowed).length} of {role.permissions.length} Permissions Active
                </span>
                <button className="btn btn-outline btn-sm">
                  {isSelected ? 'Currently Viewing' : 'Select Role'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Permission Matrix Table */}
      <div className="cyber-card permissions-matrix-card">
        <div className="cyber-card-header">
          <div className="cyber-card-title">
            <Lock className="text-teal" size={20} />
            <span>Forensic Access Control Matrix (RBAC Model)</span>
          </div>
          <span className="badge badge-demo">Specification Preview</span>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          This matrix establishes the segregation of duties required by digital forensic standards (NIST SP 800-86). In production, smart contract modifier guards enforce these rules on-chain.
        </p>

        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Operation / Forensic Capability</th>
                <th style={{ textAlign: 'center' }}>Investigator</th>
                <th style={{ textAlign: 'center' }}>Custodian</th>
                <th style={{ textAlign: 'center' }}>Auditor</th>
                <th style={{ textAlign: 'center' }}>Administrator</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Register Digital Evidence</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Calculate SHA-256 and establish initial evidence entry
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><X size={18} className="text-muted" /></td>
                <td style={{ textAlign: 'center' }}><X size={18} className="text-muted" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
              </tr>

              <tr>
                <td>
                  <strong>Perform SHA-256 Integrity Checks</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Verify suspect files against registered reference hash
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
              </tr>

              <tr>
                <td>
                  <strong>View Evidence Repository</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Inspect evidence catalog, case IDs, and metadata
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
              </tr>

              <tr>
                <td>
                  <strong>Record Custody Transfer</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Authorize and document evidence handover between personnel
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}><X size={18} className="text-muted" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><X size={18} className="text-muted" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
              </tr>

              <tr>
                <td>
                  <strong>Review Chain of Custody History</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Audit chronological timeline of handlers and integrity verifications
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
              </tr>

              <tr>
                <td>
                  <strong>Manage Users and Smart Contract Configuration</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Manage access credentials, RPC endpoints, and contract upgrades
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}><X size={18} className="text-muted" /></td>
                <td style={{ textAlign: 'center' }}><X size={18} className="text-muted" /></td>
                <td style={{ textAlign: 'center' }}><X size={18} className="text-muted" /></td>
                <td style={{ textAlign: 'center' }}><Check size={18} className="text-green" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .security-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .roles-overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
        }

        .role-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-fast);
        }

        .role-card:hover {
          border-color: var(--accent-teal);
          transform: translateY(-2px);
        }

        .role-card.selected {
          border-color: var(--accent-teal);
          box-shadow: 0 0 20px var(--accent-teal-glow);
          background-color: #1A253C;
        }

        .role-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .role-name {
          font-size: 1.05rem;
          color: var(--text-main);
        }

        .role-description {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.45;
          flex: 1;
        }

        .role-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          gap: 8px;
        }

        .permission-count {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .permissions-matrix-card {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
