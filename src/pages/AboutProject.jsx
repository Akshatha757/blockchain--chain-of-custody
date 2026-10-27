import React from 'react';
import {
  Shield,
  Layers,
  Cpu,
  CheckCircle2,
  Clock,
  Blocks,
  FileCheck2,
  Scale,
  GitCommit,
  Lock,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function AboutProject() {
  return (
    <div className="about-page">
      {/* Hero Overview */}
      <div className="cyber-card about-hero-card">
        <div className="hero-logo-box">
          <Shield size={36} className="text-teal" />
        </div>
        <div>
          <div className="hero-tag">PROJECT SPECIFICATION & ARCHITECTURAL BRIEF</div>
          <h2 className="hero-title">ForensiChain</h2>
          <div className="hero-subtitle">
            Blockchain-Based Digital Forensics Chain of Custody
          </div>
          <p className="hero-motto">
            "Secure Evidence. Verified Integrity. Traceable Custody."
          </p>
        </div>
      </div>

      {/* Problem & Proposed Solution */}
      <div className="two-col-grid">
        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Scale className="text-red" size={20} />
              <span>The Forensic Problem</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
            Digital evidence is inherently fragile, volatile, and easy to modify without leaving obvious physical traces. In criminal and civil litigation, defense attorneys regularly challenge the admissibility of digital artifacts by claiming evidence was tampered with, mislabeled, or modified while in law enforcement possession. Traditional paper custody logs or centralized database logs are vulnerable to unauthorized alteration or insider threats.
          </p>
        </div>

        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <CheckCircle2 className="text-teal" size={20} />
              <span>The ForensiChain Approach</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
            ForensiChain combines client-side <strong>SHA-256 cryptographic hashing</strong> (via browser Web Crypto API) with an <strong>immutable blockchain custody ledger</strong>. By anchoring cryptographic hashes and signed custody transfers on-chain while keeping large evidence files off-chain, ForensiChain guarantees mathematical proof of integrity without compromising sensitive data privacy or incurring prohibitive blockchain gas fees.
          </p>
        </div>
      </div>

      {/* Feature Implementation Status Matrix */}
      <div className="cyber-card status-matrix-card">
        <div className="cyber-card-header">
          <div className="cyber-card-title">
            <Layers className="text-blue" size={20} />
            <span>Implementation Status Breakdown</span>
          </div>
          <span className="badge badge-demo">Project Review Breakdown</span>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          This table clearly separates operational frontend features from simulated demonstrations and planned smart contract milestones.
        </p>

        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Feature / Capability</th>
                <th>Implementation Category</th>
                <th>Underlying Technology</th>
                <th>Status & Verification Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>SHA-256 Hashing</strong></td>
                <td><span className="badge badge-verified">Fully Implemented</span></td>
                <td>Browser Web Crypto API (SubtleCrypto)</td>
                <td>Calculates genuine 64-char hexadecimal digests from binary streams.</td>
              </tr>
              <tr>
                <td><strong>File Integrity Verification</strong></td>
                <td><span className="badge badge-verified">Fully Implemented</span></td>
                <td>Client-side binary digest comparison</td>
                <td>Detects byte-level modification and triggers VERIFIED or MISMATCH alerts.</td>
              </tr>
              <tr>
                <td><strong>Custody Transfer Handover</strong></td>
                <td><span className="badge badge-verified">Fully Implemented</span></td>
                <td>React State + Local Data Pipeline</td>
                <td>Updates active custodian, logs transfer reason, and maintains timeline.</td>
              </tr>
              <tr>
                <td><strong>Evidence Repository</strong></td>
                <td><span className="badge badge-verified">Fully Implemented</span></td>
                <td>React Filter / Sort / Search Engine</td>
                <td>Multi-field search, filtering by type and integrity, JSON export.</td>
              </tr>
              <tr>
                <td><strong>Local Demonstration Storage</strong></td>
                <td><span className="badge badge-demo">Simulated Demonstration</span></td>
                <td>Browser localStorage</td>
                <td>Simulates persistent database for college demonstration without API keys.</td>
              </tr>
              <tr>
                <td><strong>Role-Based Access Control</strong></td>
                <td><span className="badge badge-demo">Simulated Demonstration</span></td>
                <td>RBAC Specification Matrix</td>
                <td>Demonstrates intended segregation of duties; requires backend enforcement.</td>
              </tr>
              <tr>
                <td><strong>Solidity Smart Contract</strong></td>
                <td><span className="badge badge-pending">Planned Integration</span></td>
                <td>ForensiChain.sol (Solidity v0.8.20)</td>
                <td>Contract code provided; ready for deployment to Sepolia or local node.</td>
              </tr>
              <tr>
                <td><strong>Web3 Wallet Connection</strong></td>
                <td><span className="badge badge-pending">Planned Integration</span></td>
                <td>Ethers.js / Web3.js Provider</td>
                <td>Service layer stubs configured to connect wallet when contract is deployed.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Technology Stack Details */}
      <div className="cyber-card">
        <div className="cyber-card-header">
          <div className="cyber-card-title">
            <Cpu className="text-teal" size={20} />
            <span>Technology Stack & Architecture</span>
          </div>
        </div>

        <div className="tech-stack-grid">
          <div className="tech-item">
            <span className="tech-badge">UI Framework</span>
            <strong className="tech-title">React.js 18 (Vite)</strong>
            <p className="tech-desc">Component-driven reactive single-page architecture with fast hot-module reloading.</p>
          </div>

          <div className="tech-item">
            <span className="tech-badge">Cryptography</span>
            <strong className="tech-title">Web Crypto API</strong>
            <p className="tech-desc">Native browser W3C cryptographic engine (SubtleCrypto.digest) for genuine SHA-256 digests.</p>
          </div>

          <div className="tech-item">
            <span className="tech-badge">Styling</span>
            <strong className="tech-title">Vanilla CSS3</strong>
            <p className="tech-desc">Curated dark SOC design system with custom CSS custom properties, glassmorphism, and responsive layouts.</p>
          </div>

          <div className="tech-item">
            <span className="tech-badge">Icons</span>
            <strong className="tech-title">Lucide React</strong>
            <p className="tech-desc">Professional cybersecurity and digital forensic iconography.</p>
          </div>

          <div className="tech-item">
            <span className="tech-badge">Persistence</span>
            <strong className="tech-title">Browser LocalStorage</strong>
            <p className="tech-desc">Zero-configuration offline storage ensuring evidence persistence across page reloads.</p>
          </div>

          <div className="tech-item">
            <span className="tech-badge">Blockchain Target</span>
            <strong className="tech-title">Solidity (EVM)</strong>
            <p className="tech-desc">ForensiChain.sol smart contract specification for decentralized event anchoring.</p>
          </div>
        </div>
      </div>

      <style>{`
        .about-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .about-hero-card {
          padding: 28px 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
          border-left: 4px solid var(--accent-teal);
        }

        .hero-logo-box {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          background-color: var(--accent-teal-glow);
          border: 1px solid var(--border-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-tag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent-teal);
          margin-bottom: 4px;
        }

        .hero-title {
          font-size: 1.8rem;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1rem;
          color: var(--text-primary);
          font-weight: 500;
          margin-top: 2px;
        }

        .hero-motto {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-style: italic;
          margin-top: 6px;
        }

        .two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .tech-stack-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .tech-item {
          background-color: #0F172A;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tech-badge {
          font-size: 0.68rem;
          color: var(--accent-teal);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tech-title {
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .tech-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        @media (max-width: 900px) {
          .two-col-grid {
            grid-template-columns: 1fr;
          }
          .about-hero-card {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
