import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCheck2,
  Copy,
  Check,
  Hash,
  Shield,
  Clock,
  ArrowRight,
  Info,
  RefreshCw,
  Sparkles,
  Download
} from 'lucide-react';
import { calculateFileSHA256, compareHashes } from '../services/hashService';
import {
  getAllEvidence,
  updateEvidenceIntegrity,
  SYNTHETIC_SAMPLE_FILES
} from '../services/evidenceService';

export default function VerifyIntegrity({ preselectedId, onNotify, onNavigate }) {
  const fileInputRef = useRef(null);
  const evidenceList = getAllEvidence();

  const [selectedEvidenceId, setSelectedEvidenceId] = useState(
    preselectedId || (evidenceList.length > 0 ? evidenceList[0].id : '')
  );

  const [verificationFile, setVerificationFile] = useState(null);
  const [calculatedHash, setCalculatedHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // { isMatch, timestamp, calculatedHash, referenceHash }
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedCalc, setCopiedCalc] = useState(false);

  useEffect(() => {
    if (preselectedId) {
      setSelectedEvidenceId(preselectedId);
      setVerificationResult(null);
      setVerificationFile(null);
      setCalculatedHash('');
    }
  }, [preselectedId]);

  const selectedEvidence = evidenceList.find(
    (e) => e.id.toLowerCase() === selectedEvidenceId.toLowerCase()
  );

  const handleSelectEvidence = (e) => {
    setSelectedEvidenceId(e.target.value);
    setVerificationResult(null);
    setVerificationFile(null);
    setCalculatedHash('');
  };

  const processVerificationFile = async (file) => {
    if (!file) return;
    setVerificationFile(file);
    setVerificationResult(null);
    setCalculatedHash('');
    setIsHashing(true);

    try {
      const hash = await calculateFileSHA256(file);
      setCalculatedHash(hash);
    } catch (err) {
      console.error('Failed to hash verification file:', err);
      onNotify?.({
        type: 'error',
        title: 'Hashing Error',
        message: 'Could not calculate SHA-256 for the uploaded file.'
      });
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processVerificationFile(file);
    }
  };

  // Compare Hashes
  const handlePerformVerification = () => {
    if (!selectedEvidence) {
      onNotify?.({
        type: 'error',
        title: 'Selection Required',
        message: 'Please choose an evidence record to compare against.'
      });
      return;
    }

    if (!calculatedHash) {
      onNotify?.({
        type: 'error',
        title: 'File Required',
        message: 'Please select a file and compute its SHA-256 hash first.'
      });
      return;
    }

    const referenceHash = selectedEvidence.originalHash;
    const isMatch = compareHashes(calculatedHash, referenceHash);
    const now = new Date().toISOString();

    const result = {
      isMatch,
      timestamp: now,
      calculatedHash,
      referenceHash,
      evidenceId: selectedEvidence.id,
      evidenceName: selectedEvidence.name
    };

    setVerificationResult(result);

    // Persist result into evidence record and activity log
    updateEvidenceIntegrity(selectedEvidence.id, {
      isMatch,
      calculatedHash,
      verifiedBy: 'Forensic Investigator'
    });

    onNotify?.({
      type: isMatch ? 'success' : 'error',
      title: isMatch ? 'INTEGRITY VERIFIED' : 'INTEGRITY MISMATCH DETECTED',
      message: isMatch
        ? `SHA-256 matches registered reference hash for ${selectedEvidence.name}.`
        : `CRITICAL: Hash mismatch! File content has been modified or tampered.`
    });
  };

  // Quick Synthetic Test Helpers
  const loadSyntheticTestFile = async (isTampered = false) => {
    if (!selectedEvidence) return;
    const sample = SYNTHETIC_SAMPLE_FILES[selectedEvidence.id];
    
    // If not a preloaded sample, create a test blob based on its registered hash
    let content = sample ? (isTampered ? sample.tamperedContent : sample.content) : `Synthetic content for ${selectedEvidence.name}`;
    if (!sample && isTampered) {
      content += ' [UNAUTHORIZED ALTERATION DETECTED]';
    }

    const filename = isTampered ? `MODIFIED_${selectedEvidence.name}` : selectedEvidence.name;
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], filename, { type: 'text/plain' });

    await processVerificationFile(file);

    onNotify?.({
      type: 'info',
      title: isTampered ? 'Tampered Test File Loaded' : 'Original Test File Loaded',
      message: `Loaded synthetic ${isTampered ? 'modified' : 'original'} file for ${selectedEvidence.id}. Click Compare to test.`
    });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'ref') {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else {
      setCopiedCalc(true);
      setTimeout(() => setCopiedCalc(false), 2000);
    }
    onNotify?.({
      type: 'success',
      title: 'Copied',
      message: 'SHA-256 hash copied to clipboard.'
    });
  };

  return (
    <div className="verify-page">
      {/* Educational Notice */}
      <div className="cyber-callout cyber-callout-info">
        <Shield size={22} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem' }}>
          <strong>Forensic Principle: Integrity vs. Authenticity</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            A matching SHA-256 hash proves bit-level file integrity (no bytes were altered since registration), but does not independently prove chain-of-custody authenticity without verifying who possessed and transferred the artifact.
          </p>
        </div>
      </div>

      <div className="verify-grid">
        {/* Left Column: Verification Form */}
        <div className="cyber-card form-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <CheckCircle2 className="text-teal" size={20} />
              <span>Integrity Verification Pipeline</span>
            </div>
            <span className="badge badge-demo">Scenario 2 & 3 Sandbox</span>
          </div>

          {/* 1. Evidence Selection Dropdown */}
          <div className="form-group">
            <label className="form-label" htmlFor="select-evidence">
              1. Select Registered Evidence Record <span className="required">*</span>
            </label>
            <select
              id="select-evidence"
              className="form-select"
              value={selectedEvidenceId}
              onChange={handleSelectEvidence}
            >
              {evidenceList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} — {item.name} ({item.type})
                </option>
              ))}
            </select>
          </div>

          {/* Reference Hash Display */}
          {selectedEvidence && (
            <div className="evidence-snapshot-box">
              <div className="snapshot-header">
                <div>
                  <span className="font-mono text-teal" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                    {selectedEvidence.id} REFERENCE RECORD
                  </span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                    {selectedEvidence.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Registered By</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{selectedEvidence.investigator}</div>
                </div>
              </div>

              <div className="ref-hash-section">
                <div className="ref-hash-label-row">
                  <span className="ref-hash-label">TRUSTED REFERENCE SHA-256 HASH (ESTABLISHED AT REGISTRATION)</span>
                  <button
                    className="btn-icon-subtle"
                    onClick={() => copyToClipboard(selectedEvidence.originalHash, 'ref')}
                    title="Copy reference hash"
                  >
                    {copiedRef ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                    <span style={{ fontSize: '0.75rem', marginLeft: '4px' }}>{copiedRef ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="hash-pill verified" style={{ width: '100%', wordBreak: 'break-all' }}>
                  {selectedEvidence.originalHash}
                </div>
              </div>
            </div>
          )}

          {/* 2. Upload File for Verification */}
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label className="form-label">
              2. Upload Suspect / Custody File for Verification <span className="required">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {!verificationFile ? (
              <div
                className="file-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={34} className="text-blue" style={{ marginBottom: '8px' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
                  Choose file to test against baseline
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Click to select file from disk
                </p>
              </div>
            ) : (
              <div className="selected-file-card">
                <div className="selected-file-info">
                  <FileCheck2 size={24} className="text-blue" />
                  <div>
                    <strong className="selected-filename">{verificationFile.name}</strong>
                    <div className="selected-filesize">
                      {(verificationFile.size / 1024).toFixed(2)} KB ({verificationFile.size} bytes)
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setVerificationFile(null);
                    setCalculatedHash('');
                    setVerificationResult(null);
                  }}
                >
                  Change File
                </button>
              </div>
            )}
          </div>

          {/* Calculated Hash for Verification File */}
          {isHashing ? (
            <div className="hashing-indicator">
              <span className="status-dot green pulse" />
              <span>Calculating SHA-256 digest of uploaded file...</span>
            </div>
          ) : calculatedHash ? (
            <div className="calc-hash-preview">
              <div className="ref-hash-label-row">
                <span className="ref-hash-label">UPLOADED FILE SHA-256 DIGEST</span>
                <button
                  className="btn-icon-subtle"
                  onClick={() => copyToClipboard(calculatedHash, 'calc')}
                >
                  {copiedCalc ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                  <span style={{ fontSize: '0.75rem', marginLeft: '4px' }}>{copiedCalc ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="hash-pill" style={{ width: '100%', wordBreak: 'break-all' }}>
                {calculatedHash}
              </div>
            </div>
          ) : null}

          {/* Verification Trigger Button */}
          <div className="verify-actions-row">
            <button
              className="btn btn-primary"
              disabled={!selectedEvidence || !calculatedHash || isHashing}
              onClick={handlePerformVerification}
              style={{ width: '100%', padding: '12px' }}
            >
              <RefreshCw size={16} />
              <span>Compare SHA-256 Hashes & Verify Integrity</span>
            </button>
          </div>
        </div>

        {/* Right Column: Instant Test Sandbox & Verification Results */}
        <div className="verify-right-col">
          {/* Quick Scenario 2 & 3 Helpers */}
          <div className="cyber-card quick-scenario-card">
            <div className="cyber-card-header">
              <div className="cyber-card-title">
                <Sparkles size={18} className="text-teal" />
                <span>One-Click Scenario Testing</span>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Instantly test the verification engine for <strong>{selectedEvidence?.id}</strong> without downloading external files:
            </p>

            <div className="scenario-buttons">
              <button
                className="btn btn-outline scenario-btn"
                onClick={() => loadSyntheticTestFile(false)}
                disabled={!selectedEvidence}
              >
                <CheckCircle2 size={16} className="text-green" />
                <div className="scenario-btn-text">
                  <strong>Test 2: Original Untampered File</strong>
                  <span>Loads authentic payload to demonstrate INTEGRITY VERIFIED</span>
                </div>
              </button>

              <button
                className="btn btn-danger scenario-btn"
                onClick={() => loadSyntheticTestFile(true)}
                disabled={!selectedEvidence}
              >
                <AlertTriangle size={16} className="text-red" />
                <div className="scenario-btn-text">
                  <strong>Test 3: Tampered / Modified File</strong>
                  <span>Injects altered payload to demonstrate INTEGRITY MISMATCH</span>
                </div>
              </button>
            </div>
          </div>

          {/* Verification Result Card */}
          {verificationResult ? (
            <div className={`cyber-card verification-result-card ${verificationResult.isMatch ? 'match' : 'mismatch'}`}>
              <div className="result-header">
                <div className="result-icon-badge">
                  {verificationResult.isMatch ? (
                    <CheckCircle2 size={36} className="text-green" />
                  ) : (
                    <AlertTriangle size={36} className="text-red" />
                  )}
                </div>
                <h3 className="result-headline">
                  {verificationResult.isMatch ? 'INTEGRITY VERIFIED' : 'INTEGRITY MISMATCH'}
                </h3>
                <div className="result-timestamp font-mono">
                  Verified at: {new Date(verificationResult.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="result-message-box">
                {verificationResult.isMatch ? (
                  <p>
                    <strong>The calculated SHA-256 hash matches the registered reference hash.</strong> No difference was detected between these file contents. The file is cryptographically identical to the originally acquired artifact.
                  </p>
                ) : (
                  <p>
                    <strong>The calculated SHA-256 hash does not match the registered reference hash.</strong> The uploaded file differs from the originally registered file contents. Cryptographic tamper alert triggered!
                  </p>
                )}
              </div>

              {/* Side-by-side hash comparison */}
              <div className="hash-comparison-dossier">
                <div className="dossier-row">
                  <div className="dossier-label">Registered Reference Hash:</div>
                  <div className="hash-pill verified">
                    {verificationResult.referenceHash}
                  </div>
                </div>

                <div className="dossier-row">
                  <div className="dossier-label">Uploaded File Calculated Hash:</div>
                  <div className={`hash-pill ${verificationResult.isMatch ? 'verified' : 'mismatch'}`}>
                    {verificationResult.calculatedHash}
                  </div>
                </div>
              </div>

              <div className="result-footer-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate?.('custody')}
                >
                  <ArrowRight size={14} />
                  <span>Inspect Audit Log</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="cyber-card empty-result-prompt">
              <Clock size={36} className="text-muted" style={{ marginBottom: '12px' }} />
              <h4>Awaiting Verification</h4>
              <p>
                Select a registered evidence record, upload or load a test file, and click Compare to evaluate byte-level integrity.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .verify-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .verify-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 24px;
        }

        .evidence-snapshot-box {
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .snapshot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 10px;
        }

        .ref-hash-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ref-hash-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ref-hash-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .calc-hash-preview {
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .verify-actions-row {
          margin-top: 10px;
        }

        .verify-right-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .scenario-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .scenario-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
          padding: 12px 16px;
          justify-content: flex-start;
        }

        .scenario-btn-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .scenario-btn-text strong {
          font-size: 0.88rem;
          color: var(--text-main);
        }

        .scenario-btn-text span {
          font-size: 0.74rem;
          color: var(--text-secondary);
        }

        /* Result Card */
        .verification-result-card {
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all var(--transition-fast);
        }

        .verification-result-card.match {
          border: 1px solid var(--status-success-border);
          background-color: rgba(16, 185, 129, 0.05);
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
        }

        .verification-result-card.mismatch {
          border: 1px solid var(--status-error-border);
          background-color: rgba(239, 68, 68, 0.05);
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.15);
        }

        .result-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .result-headline {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .match .result-headline { color: var(--status-success); }
        .mismatch .result-headline { color: var(--status-error); }

        .result-timestamp {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .result-message-box {
          font-size: 0.88rem;
          line-height: 1.5;
          color: var(--text-primary);
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px 16px;
        }

        .hash-comparison-dossier {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: #0A0F1D;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px 16px;
        }

        .dossier-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dossier-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .result-footer-actions {
          display: flex;
          justify-content: flex-end;
        }

        .empty-result-prompt {
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .empty-result-prompt h4 {
          font-size: 1.05rem;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .empty-result-prompt p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          max-width: 320px;
        }

        @media (max-width: 1024px) {
          .verify-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
