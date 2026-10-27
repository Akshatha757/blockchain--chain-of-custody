import React, { useState } from 'react';
import {
  FolderGit2,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  FilePlus2,
  Copy,
  Check,
  Eye,
  CheckCircle2,
  GitCommit,
  Sparkles,
  FileText
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { getAllEvidence, getAllTransfers } from '../services/evidenceService';
import { truncateHash } from '../services/hashService';

export default function EvidenceRepository({
  onViewDetails,
  onVerify,
  onTransfer,
  onNavigate,
  onNotify
}) {
  const evidenceList = getAllEvidence();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('registeredAt');
  const [sortOrder, setSortOrder] = useState('desc');
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

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(evidenceList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ForensiChain_Evidence_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onNotify?.({
      type: 'info',
      title: 'Repository Exported',
      message: 'Evidence catalogue downloaded as structured JSON.'
    });
  };

  // Filtering & Sorting
  const filteredList = evidenceList.filter((item) => {
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

  const sortedList = [...filteredList].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'registeredAt') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="repository-page">
      {/* Top Banner / Actions */}
      <div className="cyber-card repo-header-card">
        <div className="repo-header-left">
          <div className="repo-icon-badge">
            <FolderGit2 size={24} className="text-teal" />
          </div>
          <div>
            <h2>Evidence Master Repository</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
              Searchable, filterable digital forensics evidence registry with SHA-256 baselines and custodian tracking.
            </p>
          </div>
        </div>

        <div className="repo-header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportJSON}
            title="Export repository catalog as JSON file"
          >
            <Download size={14} />
            <span>Export Catalog (JSON)</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('register')}
          >
            <FilePlus2 size={15} />
            <span>Register Evidence</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="cyber-card controls-card">
        <div className="controls-grid">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by Evidence ID, file name, case ID, or custodian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters-group">
            <div className="filter-item">
              <label className="filter-label">Type:</label>
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

            <div className="filter-item">
              <label className="filter-label">Status:</label>
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
        </div>

        <div className="results-count-bar">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{sortedList.length}</strong> of <strong>{evidenceList.length}</strong> registered artifacts
          </span>
          <span className="badge badge-demo">Local Demo Persistence</span>
        </div>
      </div>

      {/* Repository Table */}
      <div className="cyber-card table-card">
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('id')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Evidence ID</span>
                    <ArrowUpDown size={12} className="text-muted" />
                  </div>
                </th>
                <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Evidence Name</span>
                    <ArrowUpDown size={12} className="text-muted" />
                  </div>
                </th>
                <th>Case ID</th>
                <th>Type</th>
                <th onClick={() => toggleSort('registeredAt')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Registration Date</span>
                    <ArrowUpDown size={12} className="text-muted" />
                  </div>
                </th>
                <th>SHA-256 Hash</th>
                <th>Current Custodian</th>
                <th>Integrity Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedList.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <FileText size={40} className="text-muted" style={{ marginBottom: '12px' }} />
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '4px' }}>
                      No Evidence Records Found
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      No forensic records matched your search parameters. Try adjusting your filter.
                    </p>
                  </td>
                </tr>
              ) : (
                sortedList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="font-mono text-teal" style={{ fontWeight: 600 }}>{item.id}</span>
                        {item.isDemoData && <span className="demo-dot">DEMO</span>}
                      </div>
                    </td>

                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{item.name}</strong>
                    </td>

                    <td>
                      <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {item.caseId || 'N/A'}
                      </span>
                    </td>

                    <td>
                      <span className="badge badge-neutral">{item.type}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(item.registeredAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="font-mono hash-pill" style={{ fontSize: '0.76rem', padding: '2px 6px' }}>
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
                      <span className="custodian-pill">{item.custodian}</span>
                    </td>

                    <td>
                      <StatusBadge status={item.integrityStatus} size="small" />
                    </td>

                    <td>
                      <div className="row-actions">
                        <button
                          className="action-btn"
                          onClick={() => onViewDetails?.(item)}
                          title="View Evidence Details"
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
                          title="Transfer Custody"
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
      </div>

      <style>{`
        .repository-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .repo-header-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .repo-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .repo-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background-color: var(--accent-teal-glow);
          border: 1px solid var(--border-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .repo-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .controls-card {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .controls-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 280px;
        }

        .filters-group {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .results-count-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .table-card {
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
