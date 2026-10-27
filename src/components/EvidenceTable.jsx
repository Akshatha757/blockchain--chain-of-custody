import React, { useState } from 'react';
import {
  Copy,
  Check,
  Eye,
  CheckCircle2,
  GitCommit,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { truncateHash } from '../services/hashService';

export default function EvidenceTable({
  evidenceList = [],
  onViewDetails,
  onVerify,
  onTransfer,
  onNotify,
  showSearchAndFilter = true,
  maxRows = null,
  compact = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyHash = (id, hash, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    onNotify?.({
      type: 'success',
      title: 'Hash Copied',
      message: `SHA-256 for ${id} copied to clipboard.`
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = evidenceList.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.caseId && item.caseId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.custodian && item.custodian.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || item.integrityStatus === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const displayedList = maxRows ? filtered.slice(0, maxRows) : filtered;

  return (
    <div className="evidence-table-component">
      {showSearchAndFilter && (
        <div className="table-controls-row">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by Evidence ID, filename, or case..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-dropdowns">
            <div className="filter-select-wrapper">
              <Filter size={14} className="filter-icon" />
              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="Log File">Log File</option>
                <option value="Network Capture">Network Capture</option>
                <option value="System Report">System Report</option>
                <option value="Image">Image</option>
                <option value="Document">Document</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="MISMATCH">Mismatch</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
      )}

      <div className="cyber-table-container">
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Evidence ID</th>
              <th>Evidence Name</th>
              <th>Type</th>
              {!compact && <th>Registered By</th>}
              <th>Registration Date</th>
              <th>Reference Hash</th>
              <th>Integrity Status</th>
              <th>Current Custodian</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedList.length === 0 ? (
              <tr>
                <td colSpan={compact ? 8 : 9} className="table-empty-state">
                  <FileText size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <div>No forensic evidence records found matching your query.</div>
                </td>
              </tr>
            ) : (
              displayedList.map((item) => (
                <tr key={item.id} className="table-row-item">
                  <td>
                    <div className="evidence-id-cell">
                      <span className="id-text font-mono">{item.id}</span>
                      {item.isDemoData && <span className="demo-dot" title="Synthetic Demo Record">DEMO</span>}
                    </div>
                  </td>

                  <td>
                    <div className="evidence-name-cell">
                      <span className="filename-text" title={item.name}>{item.name}</span>
                      {item.caseId && <span className="case-id-sub font-mono">{item.caseId}</span>}
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-neutral">{item.type}</span>
                  </td>

                  {!compact && (
                    <td>
                      <span className="investigator-text">{item.investigator}</span>
                    </td>
                  )}

                  <td>
                    <span className="date-text">
                      {new Date(item.registeredAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>

                  <td>
                    <div className="hash-cell">
                      <span className="hash-code font-mono" title={item.originalHash}>
                        {truncateHash(item.originalHash, 6, 6)}
                      </span>
                      <button
                        className="btn-icon-subtle"
                        onClick={(e) => handleCopyHash(item.id, item.originalHash, e)}
                        title="Copy SHA-256 hash"
                      >
                        {copiedId === item.id ? (
                          <Check size={13} className="text-green" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </td>

                  <td>
                    <StatusBadge status={item.integrityStatus} size="small" />
                  </td>

                  <td>
                    <span className="custodian-pill">{item.custodian}</span>
                  </td>

                  <td>
                    <div className="row-actions">
                      <button
                        className="action-btn"
                        onClick={() => onViewDetails?.(item)}
                        title="View Full Forensic Dossier"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="action-btn verify-action"
                        onClick={() => onVerify?.(item.id)}
                        title="Verify File Integrity"
                      >
                        <CheckCircle2 size={15} />
                      </button>
                      <button
                        className="action-btn transfer-action"
                        onClick={() => onTransfer?.(item.id)}
                        title="Record Custody Transfer"
                      >
                        <GitCommit size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 260px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          background-color: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 9px 14px 9px 38px;
          color: var(--text-primary);
          font-size: 0.88rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .search-input:focus {
          border-color: var(--accent-teal);
        }

        .filter-dropdowns {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .filter-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .filter-select {
          background-color: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 9px 12px 9px 30px;
          color: var(--text-secondary);
          font-size: 0.84rem;
          outline: none;
          cursor: pointer;
        }

        .evidence-id-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .id-text {
          color: var(--accent-teal);
          font-weight: 600;
          font-size: 0.84rem;
        }

        .demo-dot {
          font-size: 0.58rem;
          background-color: rgba(59, 130, 246, 0.2);
          color: #93C5FD;
          padding: 1px 4px;
          border-radius: 3px;
          font-weight: 700;
        }

        .evidence-name-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .filename-text {
          font-weight: 600;
          color: var(--text-primary);
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .case-id-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .investigator-text {
          font-size: 0.84rem;
          color: var(--text-secondary);
        }

        .date-text {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .hash-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hash-code {
          font-size: 0.78rem;
          color: #38BDF8;
          background-color: #0A0F1D;
          padding: 3px 6px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .btn-icon-subtle {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
          transition: all var(--transition-fast);
        }

        .btn-icon-subtle:hover {
          color: var(--text-main);
          background-color: rgba(255, 255, 255, 0.06);
        }

        .custodian-pill {
          font-size: 0.8rem;
          color: var(--text-primary);
          background-color: #0F172A;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
          display: inline-block;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .row-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .action-btn {
          background-color: #1E293B;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .action-btn:hover {
          background-color: #2D3A4F;
          color: var(--text-main);
          border-color: var(--border-light);
        }

        .action-btn.verify-action:hover {
          color: var(--status-success);
          border-color: var(--status-success-border);
        }

        .action-btn.transfer-action:hover {
          color: var(--accent-teal);
          border-color: var(--border-accent);
        }

        .table-empty-state {
          text-align: center;
          padding: 48px 24px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
