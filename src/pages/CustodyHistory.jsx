import React, { useState, useEffect } from 'react';
import {
  GitCommit,
  UserCheck,
  ArrowRight,
  Shield,
  Clock,
  Filter,
  CheckCircle2,
  FileText,
  BadgeAlert,
  Send
} from 'lucide-react';
import CustodyTimeline from '../components/CustodyTimeline';
import {
  getAllEvidence,
  recordCustodyTransfer,
  getAllActivities
} from '../services/evidenceService';
import { truncateHash } from '../services/hashService';

export default function CustodyHistory({ preselectedId, onNotify }) {
  const evidenceList = getAllEvidence();
  const activities = getAllActivities();

  const [selectedEvidenceId, setSelectedEvidenceId] = useState(
    preselectedId || (evidenceList.length > 0 ? evidenceList[0].id : '')
  );

  const [timelineFilter, setTimelineFilter] = useState('ALL');

  const selectedEvidence = evidenceList.find(
    (e) => e.id.toLowerCase() === selectedEvidenceId.toLowerCase()
  );

  const [transferForm, setTransferForm] = useState({
    newCustodian: '',
    reason: 'Forensic Lab Ingestion & Detailed Examination',
    notes: '',
    badge: 'DFIR-OFFICER-772'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (preselectedId) {
      setSelectedEvidenceId(preselectedId);
    }
  }, [preselectedId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();

    if (!selectedEvidence) {
      onNotify?.({
        type: 'error',
        title: 'Selection Required',
        message: 'Please choose an evidence record for transfer.'
      });
      return;
    }

    const newErrors = {};
    if (!transferForm.newCustodian.trim()) {
      newErrors.newCustodian = 'New Custodian name / entity is required';
    }
    if (!transferForm.reason.trim()) {
      newErrors.reason = 'Transfer reason is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const prevCustodian = selectedEvidence.custodian;
      recordCustodyTransfer({
        evidenceId: selectedEvidence.id,
        previousCustodian: prevCustodian,
        newCustodian: transferForm.newCustodian.trim(),
        reason: transferForm.reason.trim(),
        notes: transferForm.notes.trim(),
        badge: transferForm.badge.trim()
      });

      onNotify?.({
        type: 'success',
        title: 'Custody Handover Logged',
        message: `Custody of ${selectedEvidence.id} successfully transferred to ${transferForm.newCustodian.trim()}.`
      });

      // Clear input
      setTransferForm({
        newCustodian: '',
        reason: 'Forensic Lab Ingestion & Detailed Examination',
        notes: '',
        badge: 'DFIR-OFFICER-772'
      });
      setErrors({});
    } catch (err) {
      console.error('Error logging custody transfer:', err);
      onNotify?.({
        type: 'error',
        title: 'Transfer Error',
        message: 'Could not record custody transfer in local demonstration storage.'
      });
    }
  };

  return (
    <div className="custody-page">
      {/* Informational Callout */}
      <div className="cyber-callout cyber-callout-info">
        <GitCommit size={22} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem' }}>
          <strong>Digital Forensics Chain of Custody Standard (ISO/IEC 27037)</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Every handover of physical or logical evidence must document the previous handler, new custodian, time, purpose, and integrity baseline to remain admissible in court.
          </p>
        </div>
      </div>

      <div className="custody-grid">
        {/* Left Column: Evidence Snapshot & Transfer Form */}
        <div className="custody-form-col">
          {/* Evidence Selector Card */}
          <div className="cyber-card">
            <div className="cyber-card-header">
              <div className="cyber-card-title">
                <FileText className="text-teal" size={18} />
                <span>Evidence Selection</span>
              </div>
              <span className="badge badge-demo">Local Record</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="custody-ev-select">
                Target Evidence Record
              </label>
              <select
                id="custody-ev-select"
                className="form-select"
                value={selectedEvidenceId}
                onChange={(e) => setSelectedEvidenceId(e.target.value)}
              >
                {evidenceList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} — {item.name} ({item.custodian})
                  </option>
                ))}
              </select>
            </div>

            {selectedEvidence && (
              <div className="evidence-dossier-summary">
                <div className="summary-field">
                  <span className="summary-label">Evidence ID:</span>
                  <strong className="summary-value font-mono text-teal">{selectedEvidence.id}</strong>
                </div>

                <div className="summary-field">
                  <span className="summary-label">Evidence Name:</span>
                  <strong className="summary-value">{selectedEvidence.name}</strong>
                </div>

                <div className="summary-field">
                  <span className="summary-label">Registration Date:</span>
                  <strong className="summary-value font-mono">
                    {new Date(selectedEvidence.registeredAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </strong>
                </div>

                <div className="summary-field">
                  <span className="summary-label">Current Custodian:</span>
                  <strong className="summary-value text-teal" style={{ fontSize: '0.95rem' }}>
                    {selectedEvidence.custodian}
                  </strong>
                </div>

                <div className="summary-field">
                  <span className="summary-label">Reference SHA-256:</span>
                  <span className="hash-pill verified" title={selectedEvidence.originalHash}>
                    {truncateHash(selectedEvidence.originalHash, 8, 8)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Transfer Form Card */}
          <form className="cyber-card form-card" onSubmit={handleTransferSubmit}>
            <div className="cyber-card-header">
              <div className="cyber-card-title">
                <UserCheck className="text-blue" size={18} />
                <span>Record Custody Transfer</span>
              </div>
              <span className="badge badge-teal">Handover Protocol</span>
            </div>

            <div className="form-group">
              <label className="form-label">Previous Custodian (Auto-Populated)</label>
              <input
                type="text"
                className="form-control"
                value={selectedEvidence ? selectedEvidence.custodian : 'N/A'}
                disabled
                style={{ opacity: 0.75, backgroundColor: '#090E1A' }}
              />
              <span className="form-help">Current possessor from evidence registry</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newCustodian">
                New Custodian (Receiver) <span className="required">*</span>
              </label>
              <input
                id="newCustodian"
                name="newCustodian"
                type="text"
                className={`form-control ${errors.newCustodian ? 'is-invalid' : ''}`}
                placeholder="e.g., Evidence Locker Vault #4 or Agent Marcus Vance"
                value={transferForm.newCustodian}
                onChange={handleInputChange}
              />
              {errors.newCustodian && <div className="form-error">{errors.newCustodian}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="transferReason">
                Reason for Custody Handover <span className="required">*</span>
              </label>
              <select
                id="transferReason"
                name="reason"
                className="form-select"
                value={transferForm.reason}
                onChange={handleInputChange}
              >
                <option value="Forensic Lab Ingestion & Detailed Examination">
                  Forensic Lab Ingestion & Detailed Examination
                </option>
                <option value="Court Presentation & Legal Proceedings">
                  Court Presentation & Legal Proceedings
                </option>
                <option value="Secure Climate-Controlled Long-Term Vault Storage">
                  Secure Climate-Controlled Long-Term Vault Storage
                </option>
                <option value="Defense Counsel Inspection under Supervision">
                  Defense Counsel Inspection under Supervision
                </option>
                <option value="Secondary Independent Forensic Re-Acquisition">
                  Secondary Independent Forensic Re-Acquisition
                </option>
                <option value="Incident Response Remediation Handover">
                  Incident Response Remediation Handover
                </option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="badgeId">
                Authorizing Officer Badge / ID
              </label>
              <input
                id="badgeId"
                name="badge"
                type="text"
                className="form-control"
                placeholder="e.g., DFIR-OFFICER-772"
                value={transferForm.badge}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="transferNotes">
                Transfer Observations & Container Integrity Notes
              </label>
              <textarea
                id="transferNotes"
                name="notes"
                className="form-textarea"
                placeholder="e.g., Tamper-evident seal #7781 intact. Stored in Faraday protective bag..."
                value={transferForm.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              disabled={!selectedEvidence}
            >
              <Send size={16} />
              <span>Submit & Record Transfer Event</span>
            </button>
          </form>
        </div>

        {/* Right Column: Chronological Custody Timeline */}
        <div className="custody-timeline-col">
          <div className="cyber-card">
            <div className="cyber-card-header">
              <div className="cyber-card-title">
                <Clock className="text-teal" size={18} />
                <span>Forensic Chain of Custody Audit Trail</span>
              </div>
              <div className="filter-select-wrapper">
                <select
                  className="filter-select"
                  value={timelineFilter}
                  onChange={(e) => setTimelineFilter(e.target.value)}
                >
                  <option value="ALL">All Evidence Events</option>
                  {evidenceList.map((item) => (
                    <option key={item.id} value={item.id}>
                      Only {item.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <CustodyTimeline
              events={activities}
              evidenceFilter={timelineFilter}
            />
          </div>
        </div>
      </div>

      <style>{`
        .custody-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .custody-grid {
          display: grid;
          grid-template-columns: 460px 1fr;
          gap: 24px;
        }

        .custody-form-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .evidence-dossier-summary {
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .summary-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 6px;
          gap: 8px;
        }

        .summary-field:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .summary-label {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .summary-value {
          font-size: 0.84rem;
          color: var(--text-primary);
        }

        .custody-timeline-col {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1080px) {
          .custody-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
