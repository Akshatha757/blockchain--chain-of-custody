import React, { useState, useRef } from 'react';
import {
  FilePlus2,
  UploadCloud,
  FileCheck2,
  FileText,
  X,
  Hash,
  AlertCircle,
  CheckCircle2,
  Shield,
  Eye,
  Sparkles,
  Blocks,
  ArrowRight
} from 'lucide-react';
import { calculateFileSHA256, calculateTextSHA256 } from '../services/hashService';
import { registerNewEvidence, SYNTHETIC_SAMPLE_FILES } from '../services/evidenceService';

export default function RegisterEvidence({ onNavigate, onViewDetails, onNotify }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Log File',
    description: '',
    caseId: 'CASE-2026-0891',
    investigator: 'Inspector Sarah Chen',
    custodian: 'Sarah Chen (Lead Forensics)'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [calculatedHash, setCalculatedHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [errors, setErrors] = useState({});
  const [registeredRecord, setRegisteredRecord] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const processFile = async (file) => {
    if (!file) return;

    setSelectedFile(file);
    if (!formData.name) {
      setFormData((prev) => ({ ...prev, name: file.name }));
    }

    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: null }));
    }

    // Compute actual Web Crypto SHA-256
    setIsHashing(true);
    setCalculatedHash('');
    try {
      const hash = await calculateFileSHA256(file);
      setCalculatedHash(hash);
      onNotify?.({
        type: 'info',
        title: 'SHA-256 Calculated',
        message: `Digest generated for ${file.name} using Web Crypto API.`
      });
    } catch (err) {
      console.error('Error hashing file:', err);
      setErrors((prev) => ({ ...prev, file: 'Failed to compute SHA-256 hash. Please try again.' }));
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setCalculatedHash('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick preset helper to load a synthetic test log into the file dropper
  const loadPresetSample = async (key) => {
    const sample = SYNTHETIC_SAMPLE_FILES[key];
    if (!sample) return;

    const blob = new Blob([sample.content], { type: 'text/plain' });
    const file = new File([blob], sample.name, { type: 'text/plain' });
    setFormData({
      name: sample.name,
      type: sample.type,
      description: `Synthetic digital forensics test artifact (${key}) for integrity verification testing.`,
      caseId: 'CASE-2026-0891',
      investigator: 'Inspector Sarah Chen',
      custodian: 'Sarah Chen (Lead Forensics)'
    });
    await processFile(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Evidence Name is required';
    if (!formData.caseId.trim()) newErrors.caseId = 'Case ID is required';
    if (!formData.investigator.trim()) newErrors.investigator = 'Investigator Name is required';
    if (!formData.custodian.trim()) newErrors.custodian = 'Current Custodian is required';
    if (!selectedFile) newErrors.file = 'Please upload or select an evidence file to calculate SHA-256';
    if (!calculatedHash) newErrors.hash = 'SHA-256 hash calculation in progress or missing';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      onNotify?.({
        type: 'error',
        title: 'Validation Incomplete',
        message: 'Please fill in all required forensic metadata and select a file.'
      });
      return;
    }

    try {
      const newRecord = registerNewEvidence({
        name: formData.name,
        type: formData.type,
        description: formData.description,
        caseId: formData.caseId,
        investigator: formData.investigator,
        custodian: formData.custodian,
        hash: calculatedHash,
        fileSize: selectedFile.size
      });

      setRegisteredRecord(newRecord);

      onNotify?.({
        type: 'success',
        title: 'Evidence Registered Locally',
        message: `Registered ${newRecord.id} with SHA-256 hash: ${calculatedHash.slice(0, 12)}...`
      });
    } catch (err) {
      console.error('Registration failed:', err);
      onNotify?.({
        type: 'error',
        title: 'Registration Error',
        message: 'Could not save evidence record in localStorage.'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Log File',
      description: '',
      caseId: 'CASE-2026-0891',
      investigator: 'Inspector Sarah Chen',
      custodian: 'Sarah Chen (Lead Forensics)'
    });
    setSelectedFile(null);
    setCalculatedHash('');
    setRegisteredRecord(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="register-page">
      {/* Informational Callout */}
      <div className="cyber-callout cyber-callout-info">
        <Blocks size={22} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem' }}>
          <strong>Off-Chain Storage & Cryptographic Anchoring Principle:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Evidence files are kept off-chain to maintain privacy and eliminate gas costs. ForensiChain generates a 256-bit cryptographic digest (SHA-256) of the raw bytes using the browser's native Web Crypto API.
          </p>
        </div>
      </div>

      {registeredRecord ? (
        /* Success Screen */
        <div className="cyber-card registration-success-card">
          <div className="success-header">
            <div className="success-icon-badge">
              <CheckCircle2 size={36} className="text-green" />
            </div>
            <h2>Evidence Successfully Registered Locally</h2>
            <p className="success-subtitle">
              Evidence metadata and its SHA-256 hash have been saved in this browser. Blockchain registration is not available until a smart contract connection is configured.
            </p>
          </div>

          <div className="success-details-box">
            <div className="success-detail-row">
              <span className="detail-key">Assigned Evidence ID:</span>
              <strong className="detail-val font-mono text-teal">{registeredRecord.id}</strong>
            </div>

            <div className="success-detail-row">
              <span className="detail-key">Evidence Filename:</span>
              <strong className="detail-val">{registeredRecord.name}</strong>
            </div>

            <div className="success-detail-row">
              <span className="detail-key">Case Reference:</span>
              <strong className="detail-val font-mono">{registeredRecord.caseId}</strong>
            </div>

            <div className="success-detail-row">
              <span className="detail-key">Registered SHA-256 Hash:</span>
              <div className="hash-pill verified">
                <span>{registeredRecord.originalHash}</span>
              </div>
            </div>

            <div className="success-detail-row">
              <span className="detail-key">Initial Custodian:</span>
              <strong className="detail-val text-teal">{registeredRecord.custodian}</strong>
            </div>

            <div className="success-detail-row">
              <span className="detail-key">Registration Timestamp:</span>
              <strong className="detail-val font-mono">
                {new Date(registeredRecord.registeredAt).toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="disclaimer-alert">
            <Shield size={18} className="text-amber" style={{ flexShrink: 0 }} />
            <span>
              <strong>Demonstration Notice:</strong> This record is stored in browser localStorage for testing and demonstration purposes. It does not represent an immutable blockchain confirmation.
            </span>
          </div>

          <div className="success-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (onViewDetails) onViewDetails(registeredRecord);
              }}
            >
              <Eye size={16} />
              <span>View Evidence Dossier</span>
            </button>

            <button
              className="btn btn-outline"
              onClick={() => {
                if (onNavigate) onNavigate('verify');
              }}
            >
              <FileCheck2 size={16} />
              <span>Verify Integrity Now</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={resetForm}
            >
              <span>Register Another Evidence</span>
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <div className="registration-grid">
          <form className="cyber-card form-card" onSubmit={handleSubmit}>
            <div className="cyber-card-header">
              <div className="cyber-card-title">
                <FilePlus2 className="text-teal" size={20} />
                <span>Forensic Evidence Intake Form</span>
              </div>
              <span className="badge badge-demo">Local Demo Mode</span>
            </div>

            <div className="form-fields-container">
              {/* Evidence Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="ev-name">
                  Evidence Name / Filename <span className="required">*</span>
                </label>
                <input
                  id="ev-name"
                  name="name"
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g., auth_audit_ws402.log or memory_dump.raw"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              {/* Two columns: Type & Case ID */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="ev-type">
                    Evidence Type <span className="required">*</span>
                  </label>
                  <select
                    id="ev-type"
                    name="type"
                    className="form-select"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="Log File">Log File</option>
                    <option value="Network Capture">Network Capture</option>
                    <option value="System Report">System Report</option>
                    <option value="Image">Image</option>
                    <option value="Document">Document</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ev-case">
                    Case ID <span className="required">*</span>
                  </label>
                  <input
                    id="ev-case"
                    name="caseId"
                    type="text"
                    className={`form-control ${errors.caseId ? 'is-invalid' : ''}`}
                    placeholder="e.g., CASE-2026-0891"
                    value={formData.caseId}
                    onChange={handleInputChange}
                  />
                  {errors.caseId && <div className="form-error">{errors.caseId}</div>}
                </div>
              </div>

              {/* Two columns: Investigator & Custodian */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="ev-inv">
                    Investigator Name <span className="required">*</span>
                  </label>
                  <input
                    id="ev-inv"
                    name="investigator"
                    type="text"
                    className={`form-control ${errors.investigator ? 'is-invalid' : ''}`}
                    placeholder="e.g., Inspector Sarah Chen"
                    value={formData.investigator}
                    onChange={handleInputChange}
                  />
                  {errors.investigator && <div className="form-error">{errors.investigator}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ev-custodian">
                    Initial Custodian <span className="required">*</span>
                  </label>
                  <input
                    id="ev-custodian"
                    name="custodian"
                    type="text"
                    className={`form-control ${errors.custodian ? 'is-invalid' : ''}`}
                    placeholder="e.g., Sarah Chen (Lead Forensics)"
                    value={formData.custodian}
                    onChange={handleInputChange}
                  />
                  {errors.custodian && <div className="form-error">{errors.custodian}</div>}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="ev-desc">
                  Evidence Description & Acquisition Context
                </label>
                <textarea
                  id="ev-desc"
                  name="description"
                  className="form-textarea"
                  placeholder="Describe source device, acquisition tool, hash verification notes, and physical/logical handling protocol..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              {/* File Upload Zone */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Evidence File for SHA-256 Digest <span className="required">*</span>
                  </label>
                  <span className="form-help">Client-side Web Crypto hashing</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {!selectedFile ? (
                  <div
                    className={`file-dropzone ${isDragging ? 'active' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <UploadCloud size={38} className="text-teal" style={{ marginBottom: '10px' }} />
                    <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                      Click to browse or drag & drop evidence file here
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Supports logs (.txt, .log), dumps (.raw, .bin), captures (.pcap), images, or documents
                    </p>
                  </div>
                ) : (
                  <div className="selected-file-card">
                    <div className="selected-file-info">
                      <FileCheck2 size={24} className="text-teal" />
                      <div>
                        <strong className="selected-filename">{selectedFile.name}</strong>
                        <div className="selected-filesize">
                          {(selectedFile.size / 1024).toFixed(2)} KB ({selectedFile.size} bytes)
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={removeFile}
                      title="Remove selected file"
                    >
                      <X size={15} />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
                {errors.file && <div className="form-error">{errors.file}</div>}
              </div>

              {/* Real SHA-256 Hash Display Box */}
              {isHashing ? (
                <div className="hashing-indicator">
                  <span className="status-dot green pulse" />
                  <span>Computing cryptographic SHA-256 digest via SubtleCrypto...</span>
                </div>
              ) : calculatedHash ? (
                <div className="calculated-hash-box">
                  <div className="hash-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Hash size={16} className="text-teal" />
                      <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        CALCULATED SHA-256 CHECKSUM (GENUINE DIGEST)
                      </span>
                    </div>
                    <span className="badge badge-verified">64 HEX CHARACTERS</span>
                  </div>
                  <div className="hash-pill verified" style={{ width: '100%', wordBreak: 'break-all' }}>
                    {calculatedHash}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    This hash is generated directly from your file's binary stream and will serve as the immutable baseline reference.
                  </div>
                </div>
              ) : null}
            </div>

            {/* Bottom Submit Actions */}
            <div className="form-submit-row">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isHashing || !calculatedHash}
              >
                <FilePlus2 size={16} />
                <span>Register Evidence Locally</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Clear Form
              </button>
            </div>
          </form>

          {/* Right Column: Instant Preset Helper */}
          <div className="sidebar-helper-card cyber-card">
            <div className="cyber-card-header">
              <div className="cyber-card-title">
                <Sparkles size={18} className="text-teal" />
                <span>Quick Test Artifacts</span>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Want to test registration immediately without searching your local drive? Load a pre-configured synthetic forensic artifact with one click:
            </p>

            <div className="preset-buttons-list">
              <button
                type="button"
                className="preset-btn"
                onClick={() => loadPresetSample('EVD-001')}
              >
                <div className="preset-btn-top">
                  <strong>sample_log.txt</strong>
                  <span className="badge badge-neutral">Log File</span>
                </div>
                <div className="preset-btn-sub">Authentication audit log (WS-402)</div>
              </button>

              <button
                type="button"
                className="preset-btn"
                onClick={() => loadPresetSample('EVD-002')}
              >
                <div className="preset-btn-top">
                  <strong>sample_network_report.txt</strong>
                  <span className="badge badge-neutral">Network</span>
                </div>
                <div className="preset-btn-sub">Perimeter gateway packet report</div>
              </button>

              <button
                type="button"
                className="preset-btn"
                onClick={() => loadPresetSample('EVD-003')}
              >
                <div className="preset-btn-top">
                  <strong>sample_system_report.txt</strong>
                  <span className="badge badge-neutral">System</span>
                </div>
                <div className="preset-btn-sub">Forensic volatile memory dump report</div>
              </button>
            </div>

            <div className="helper-notice-box">
              <Shield size={16} className="text-teal" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <strong>No Mock Hashes:</strong> Web Crypto calculates genuine SHA-256 for all uploaded files. You can later download the file from the Topbar sandbox to perform Test 2 (match) and Test 3 (tamper mismatch).
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .register-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .registration-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        .form-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-fields-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .selected-file-card {
          background-color: #0F172A;
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .selected-file-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .selected-filename {
          display: block;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .selected-filesize {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .hashing-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .calculated-hash-box {
          background-color: #0B1120;
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .form-submit-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        /* Success Card */
        .registration-success-card {
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          max-width: 820px;
          margin: 0 auto;
          width: 100%;
        }

        .success-icon-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: var(--status-success-bg);
          border: 1px solid var(--status-success-border);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }

        .success-subtitle {
          color: var(--text-secondary);
          font-size: 0.92rem;
          max-width: 620px;
          margin: 6px auto 0;
          line-height: 1.45;
        }

        .success-details-box {
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }

        .success-detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 10px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .success-detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .detail-key {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .detail-val {
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .disclaimer-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          font-size: 0.82rem;
          color: #FCD34D;
          text-align: left;
          width: 100%;
        }

        .success-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 10px;
        }

        /* Preset Buttons */
        .preset-buttons-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .preset-btn {
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .preset-btn:hover {
          border-color: var(--accent-teal);
          background-color: #17243B;
          transform: translateY(-1px);
        }

        .preset-btn-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--text-main);
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .preset-btn-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .helper-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background-color: rgba(20, 184, 166, 0.06);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-md);
          padding: 12px 14px;
        }

        @media (max-width: 992px) {
          .registration-grid {
            grid-template-columns: 1fr;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
