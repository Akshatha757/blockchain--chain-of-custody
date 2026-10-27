import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Shield,
  FileText,
  Clock,
  User,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Blocks,
  ArrowRight
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getAllTransfers } from '../services/evidenceService';

export default function EvidenceDetailModal({
  evidence,
  onClose,
  onNavigateToVerify,
  onNavigateToTransfer,
  onNotify
}) {
  const [copied, setCopied] = useState(false);

  if (!evidence) return null;

  const allTransfers = getAllTransfers();
  const evidenceTransfers = allTransfers.filter(
    (t) => t.evidenceId.toLowerCase() === evidence.id.toLowerCase()
  );

  const handleCopyHash = () => {
    navigator.clipboard.writeText(evidence.originalHash);
    setCopied(true);
    onNotify?.({
      type: 'success',
      title: 'Hash Copied',
      message: 'SHA-256 hash copied to clipboard.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-badge">
              <FileText size={20} className="text-teal" />
            </div>
            <div>
              <div className="modal-evidence-id">{evidence.id}</div>
              <h2 className="modal-title">{evidence.name}</h2>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Status Row */}
          <div className="modal-status-banner">
            <div className="status-banner-left">
              <span className="status-banner-label">Integrity Status:</span>
              <StatusBadge status={evidence.integrityStatus} />
            </div>
            <div className="status-banner-right">
              <span className="status-banner-label">Blockchain Anchor:</span>
              <span className="badge badge-demo">Off-Chain Local Record</span>
            </div>
          </div>

          {/* SHA-256 Hash Display */}
          <div className="detail-section">
            <div className="section-label-row">
              <span className="section-label">REGISTERED REFERENCE SHA-256 HASH</span>
              <span className="hash-length-indicator">256-bit (64 Hex Characters)</span>
            </div>
            <div className="hash-display-box">
              <span className="hash-mono-text">{evidence.originalHash}</span>
              <button
                className="btn btn-secondary btn-sm copy-btn"
                onClick={handleCopyHash}
                title="Copy full 64-char hash"
              >
                {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="hash-helper-text">
              Calculated at ingestion using browser Web Crypto API (SubtleCrypto.digest SHA-256).
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="metadata-grid">
            <div className="metadata-item">
              <span className="meta-label">Case ID</span>
              <strong className="meta-value font-mono">{evidence.caseId || 'N/A'}</strong>
            </div>

            <div className="metadata-item">
              <span className="meta-label">Evidence Type</span>
              <strong className="meta-value">{evidence.type}</strong>
            </div>

            <div className="metadata-item">
              <span className="meta-label">File Size</span>
              <strong className="meta-value">
                {evidence.fileSize ? `${(evidence.fileSize / 1024).toFixed(2)} KB (${evidence.fileSize} bytes)` : 'Synthetic Record'}
              </strong>
            </div>

            <div className="metadata-item">
              <span className="meta-label">Registered Date</span>
              <strong className="meta-value">
                {new Date(evidence.registeredAt).toLocaleString()}
              </strong>
            </div>

            <div className="metadata-item">
              <span className="meta-label">Initial Investigator</span>
              <strong className="meta-value">{evidence.investigator}</strong>
            </div>

            <div className="metadata-item">
              <span className="meta-label">Current Custodian</span>
              <strong className="meta-value text-teal">{evidence.custodian}</strong>
            </div>
          </div>

          {/* Description */}
          {evidence.description && (
            <div className="detail-section">
              <span className="section-label">EVIDENCE DESCRIPTION & NOTES</span>
              <div className="description-box">{evidence.description}</div>
            </div>
          )}

          {/* Custody Transfer History */}
          <div className="detail-section">
            <div className="section-label-row">
              <span className="section-label">CHAIN OF CUSTODY LOG ({evidenceTransfers.length} TRANSFERS)</span>
            </div>
            {evidenceTransfers.length === 0 ? (
              <div className="empty-transfers-note">
                Initial custody retained by original registering investigator. No handovers recorded yet.
              </div>
            ) : (
              <div className="transfers-mini-list">
                {evidenceTransfers.map((trf) => (
                  <div key={trf.id} className="transfer-mini-item">
                    <div className="transfer-mini-header">
                      <span className="font-mono text-teal" style={{ fontSize: '0.75rem' }}>{trf.id}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(trf.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="transfer-parties">
                      <span className="party-box">{trf.previousCustodian}</span>
                      <ArrowRight size={14} className="text-secondary" />
                      <span className="party-box highlight">{trf.newCustodian}</span>
                    </div>
                    <div className="transfer-reason-line">
                      <strong>Reason:</strong> {trf.reason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blockchain Integration Explainer */}
          <div className="blockchain-notice-box">
            <Blocks size={18} className="text-blue" style={{ flexShrink: 0 }} />
            <div>
              <strong>Blockchain Architecture Specification:</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Upon smart contract deployment, this evidence record's SHA-256 hash ({evidence.originalHash.slice(0, 10)}...) will be anchored into <code>ForensiChain.sol</code> along with the EIP-712 custody transfer signatures.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <div className="footer-actions">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                onClose();
                onNavigateToVerify?.(evidence.id);
              }}
            >
              <CheckCircle2 size={15} />
              <span>Verify Integrity</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                onClose();
                onNavigateToTransfer?.(evidence.id);
              }}
            >
              <GitCommit size={15} />
              <span>Transfer Custody</span>
            </button>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <style>{`
        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #0F172A;
        }

        .modal-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .modal-icon-badge {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          background-color: var(--accent-teal-glow);
          border: 1px solid var(--border-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-evidence-id {
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--accent-teal);
          font-weight: 600;
        }

        .modal-title {
          font-size: 1.15rem;
          color: var(--text-main);
          margin-top: 2px;
        }

        .modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .modal-status-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #0B1120;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .status-banner-left, .status-banner-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-banner-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }

        .hash-length-indicator {
          font-size: 0.7rem;
          color: var(--accent-teal);
          font-family: var(--font-mono);
        }

        .hash-display-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #0B1120;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          gap: 12px;
        }

        .hash-mono-text {
          font-family: var(--font-mono);
          font-size: 0.84rem;
          color: #38BDF8;
          word-break: break-all;
          line-height: 1.4;
        }

        .copy-btn {
          flex-shrink: 0;
        }

        .hash-helper-text {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .metadata-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
        }

        .metadata-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-value {
          font-size: 0.88rem;
          color: var(--text-primary);
        }

        .description-box {
          background-color: #0B1120;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .empty-transfers-note {
          background-color: #0B1120;
          border: 1px dashed var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
        }

        .transfers-mini-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .transfer-mini-item {
          background-color: #0B1120;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .transfer-mini-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .transfer-parties {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
        }

        .party-box {
          background-color: #1E293B;
          padding: 3px 8px;
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .party-box.highlight {
          color: var(--accent-teal);
          border: 1px solid var(--border-accent);
          background-color: rgba(20, 184, 166, 0.08);
        }

        .transfer-reason-line {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .blockchain-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background-color: rgba(59, 130, 246, 0.06);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          font-size: 0.82rem;
          color: #93C5FD;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #0F172A;
        }

        .footer-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
