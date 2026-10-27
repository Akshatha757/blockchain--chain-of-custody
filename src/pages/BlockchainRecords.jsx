import React, { useState } from 'react';
import {
  Blocks,
  Shield,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  Lock
} from 'lucide-react';
import { SOLIDITY_CONTRACT_SOURCE, BLOCKCHAIN_CONFIG } from '../services/blockchainService';
import { getAllEvidence } from '../services/evidenceService';
import { truncateHash } from '../services/hashService';

export default function BlockchainRecords({ onNotify }) {
  const [activeTab, setActiveTab] = useState('status'); // 'status' | 'contract' | 'architecture'
  const [copiedCode, setCopiedCode] = useState(false);
  const evidenceList = getAllEvidence();

  const handleCopySolidity = () => {
    navigator.clipboard.writeText(SOLIDITY_CONTRACT_SOURCE);
    setCopiedCode(true);
    onNotify?.({
      type: 'success',
      title: 'Solidity Code Copied',
      message: 'ForensiChain.sol contract copied to clipboard.'
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="blockchain-page">
      {/* Honest Status Banner as Required */}
      <div className="cyber-card honest-blockchain-banner">
        <div className="honest-banner-left">
          <div className="honest-icon-box">
            <Blocks size={28} className="text-secondary" />
          </div>
          <div>
            <div className="honest-status-tag">
              <span className="status-dot gray" />
              <span>BLOCKCHAIN CONNECTION: NOT CONFIGURED</span>
            </div>
            <h3 className="honest-headline">
              Local Demonstration Mode (No Fake Transactions)
            </h3>
            <p className="honest-description">
              Blockchain connection is not configured. Evidence registration and custody events are currently stored as local demonstration records.
            </p>
          </div>
        </div>

        <div className="honest-banner-badge">
          <span className="badge badge-neutral">Off-Chain Demonstrator</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="blockchain-tabs">
        <button
          className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          <Blocks size={16} />
          <span>Ledger Records View</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveTab('architecture')}
        >
          <Layers size={16} />
          <span>Blockchain Workflow & Architecture</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'contract' ? 'active' : ''}`}
          onClick={() => setActiveTab('contract')}
        >
          <Code2 size={16} />
          <span>Solidity Smart Contract (ForensiChain.sol)</span>
        </button>
      </div>

      {/* Tab 1: Ledger Records View */}
      {activeTab === 'status' && (
        <div className="cyber-card tab-content-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Blocks className="text-teal" size={20} />
              <span>Target Blockchain Evidence Ledger (Honest Empty State)</span>
            </div>
            <span className="badge badge-demo">Unconnected</span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Below is the prospective schema for on-chain state inspection. In strict compliance with forensic integrity principles, <strong>no fake transaction hashes or fabricated block confirmations</strong> are rendered.
          </p>

          <div className="cyber-table-container">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Evidence ID</th>
                  <th>Evidence SHA-256 Hash</th>
                  <th>Transaction Hash</th>
                  <th>Block Number</th>
                  <th>Transaction Status</th>
                  <th>Target Network</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {evidenceList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="font-mono text-teal" style={{ fontWeight: 600 }}>{item.id}</span>
                    </td>
                    <td>
                      <span className="font-mono hash-pill" style={{ fontSize: '0.76rem', padding: '2px 6px' }}>
                        {truncateHash(item.originalHash, 6, 6)}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-muted" style={{ fontSize: '0.78rem' }}>
                        Pending Blockchain Connection
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-muted" style={{ fontSize: '0.78rem' }}>
                        —
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">Local Demo Record</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Not Connected (Local Mode)
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(item.registeredAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Workflow & Architecture */}
      {activeTab === 'architecture' && (
        <div className="cyber-card tab-content-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Layers className="text-blue" size={20} />
              <span>Intended Blockchain Integration Workflow</span>
            </div>
            <span className="badge badge-demo">Engineering Design</span>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            ForensiChain utilizes a dual-tier off-chain/on-chain hybrid architecture designed to satisfy strict forensic evidentiary requirements:
          </p>

          <div className="workflow-steps-container">
            <div className="workflow-step-card">
              <div className="step-number-badge">1</div>
              <div className="step-content">
                <h4>Calculate SHA-256 Hash</h4>
                <p>
                  The digital evidence file (disk image, log, capture) is hashed locally on the investigator's terminal via Web Crypto. Only the 32-byte digest is extracted.
                </p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-badge">2</div>
              <div className="step-content">
                <h4>Keep Evidence File Off-Chain</h4>
                <p>
                  Actual file contents remain in secure off-chain storage (e.g. encrypted forensic file server or IPFS). This prevents blockchain congestion and protects sensitive case data.
                </p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-badge">3</div>
              <div className="step-content">
                <h4>Submit Metadata & Hash to Smart Contract</h4>
                <p>
                  The investigator signs a transaction invoking <code>registerEvidence(evidenceId, sha256Hash, caseId, metadataUri)</code>. The SHA-256 hash is immutably anchored.
                </p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-badge">4</div>
              <div className="step-content">
                <h4>Record Authorized Custody Transfers</h4>
                <p>
                  When evidence changes hands, the current custodian authorizes the transfer via <code>transferCustody(...)</code>, logging receiver address and digital signature.
                </p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-badge">5</div>
              <div className="step-content">
                <h4>Retrieve & Audit Verification Events</h4>
                <p>
                  Judges, attorneys, and auditors query the smart contract <code>verifyHash(...)</code> function to confirm that evidence presented at trial matches the original acquisition.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Solidity Smart Contract Viewer */}
      {activeTab === 'contract' && (
        <div className="cyber-card tab-content-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Code2 className="text-teal" size={20} />
              <span>ForensiChain.sol (Solidity v0.8.20)</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleCopySolidity}
            >
              {copiedCode ? <Check size={14} className="text-green" /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copied Contract' : 'Copy Source Code'}</span>
            </button>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            This smart contract is prepared for deployment to an EVM-compatible blockchain (e.g., Ethereum Sepolia, Polygon, or local Hardhat/Anvil node).
          </p>

          <div className="code-viewer-container">
            <pre className="solidity-code font-mono">
              <code>{SOLIDITY_CONTRACT_SOURCE}</code>
            </pre>
          </div>
        </div>
      )}

      <style>{`
        .blockchain-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .honest-blockchain-banner {
          background-color: #0E1526;
          border: 1px solid var(--border-light);
          border-left: 4px solid var(--border-light);
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .honest-banner-left {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          max-width: 800px;
        }

        .honest-icon-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background-color: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .honest-status-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .honest-headline {
          font-size: 1.25rem;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .honest-description {
          font-size: 0.86rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .blockchain-tabs {
          display: flex;
          gap: 10px;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 4px;
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: var(--text-main);
          background-color: rgba(255, 255, 255, 0.04);
        }

        .tab-btn.active {
          color: var(--accent-teal);
          background-color: var(--accent-teal-glow);
          border-bottom: 2px solid var(--accent-teal);
        }

        .tab-content-card {
          padding: 24px;
        }

        /* Workflow Steps */
        .workflow-steps-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .workflow-step-card {
          display: flex;
          gap: 16px;
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          align-items: flex-start;
        }

        .step-number-badge {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-teal), #0D9488);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-content h4 {
          font-size: 1rem;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .step-content p {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        /* Code Viewer */
        .code-viewer-container {
          background-color: #070B14;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 20px;
          overflow-x: auto;
          max-height: 520px;
        }

        .solidity-code {
          color: #38BDF8;
          font-size: 0.82rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
