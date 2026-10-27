# ForensiChain — Blockchain-Based Digital Forensics Chain of Custody

**Tagline:** Secure Evidence. Verified Integrity. Traceable Custody.  
**Project Title:** Blockchain-Based Digital Forensics Chain of Custody  
**Role:** Digital Forensics & Incident Response (DFIR) Evidence Integrity Platform

---

## 1. Project Overview

Digital forensic evidence is inherently fragile, volatile, and prone to legal scrutiny. In criminal and civil litigation, evidence admissibility hinges on establishing an unbroken, tamper-evident **Chain of Custody** complying with standards such as **ISO/IEC 27037** and **NIST SP 800-86**.

**ForensiChain** demonstrates how client-side cryptographic hashing (**SHA-256**) paired with a blockchain ledger architecture protects evidence integrity and maintains a verifiable audit trail of custody transfers.

### Core Architectural Principles
1. **Off-Chain Evidence Storage:** Raw evidence files (disk images, memory captures, network pcap logs) are kept off-chain to protect sensitive case data and eliminate prohibitive gas fees.
2. **On-Chain Cryptographic Anchoring:** Only the 256-bit SHA-256 hash and metadata URIs are submitted to the smart contract.
3. **Honest System Transparency:** Features are clearly demarcated as either **Operational (Frontend & Web Crypto)**, **Simulated Demonstration (LocalStorage)**, or **Planned (Solidity & Smart Contract Integration)**. No fake transaction hashes or fabricated block confirmations are displayed.

---

## 2. Technology Stack

* **UI Framework:** React.js 18 (Functional components & React Hooks)
* **Build Tool:** Vite 6
* **Cryptography:** Browser W3C native **Web Crypto API** (`crypto.subtle.digest("SHA-256", fileBuffer)`)
* **Styling:** Vanilla CSS3 with Cyber SOC Dark Theme (`#0B1120`, `#111827`, `#172033`, `#14B8A6`, `#3B82F6`)
* **Icons:** Lucide React
* **Persistence:** Browser `localStorage` (offline demonstration mode)
* **Smart Contract Target:** Solidity `v0.8.20` (`contracts/ForensiChain.sol` ready for EVM testnets)

---

## 3. Quick Start & Local Run

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
* npm (v9+ or v10+)

### Installation
```bash
# Clone or navigate to the project directory
cd "d:\Blockchain-Chain of Custody"

# Install dependencies (React, Vite, Lucide React)
npm install

# Start local development server
npm run dev
```

Open your browser at:
`http://localhost:3000` (or the port indicated in your terminal).

*No API keys, paid services, or external database credentials are required.*

---

## 4. Feature Verification Scenarios (Tests 1 to 7)

Use the built-in **Test Files Sandbox** (available in the Topbar) or sample files to test all required scenarios:

### Test 1: Register Evidence
1. Navigate to **Register Evidence**.
2. Enter an Evidence Name (or click one of the quick test buttons on the right, e.g. `sample_log.txt`).
3. Select an evidence file from your computer or drop a file into the upload zone.
4. Observe the genuine **SHA-256 hash** calculated instantly by the Web Crypto API.
5. Click **Register Evidence Locally**.
6. **Expected Result:** Record is saved to `localStorage`, assigned a unique ID (e.g. `EVD-004`), and appears on the Dashboard and Repository.

### Test 2: Verify Original File
1. Navigate to **Verify Integrity**.
2. Select `EVD-001` (`sample_log.txt`).
3. In the right panel, click **Test 2: Original Untampered File** (or upload the original file).
4. Click **Compare SHA-256 Hashes & Verify Integrity**.
5. **Expected Result:** The application displays a green glowing indicator:
   > **“INTEGRITY VERIFIED”**  
   > *“The calculated SHA-256 hash matches the registered reference hash. No difference was detected between these file contents.”*

### Test 3: Detect File Modification
1. Navigate to **Verify Integrity**.
2. Select `EVD-001` (`sample_log.txt`).
3. In the right panel, click **Test 3: Tampered / Modified File** (or upload a modified version).
4. Click **Compare SHA-256 Hashes & Verify Integrity**.
5. **Expected Result:** The application displays a red alert indicator:
   > **“INTEGRITY MISMATCH”**  
   > *“The calculated SHA-256 hash does not match the registered reference hash. The uploaded file differs from the originally registered file contents.”*  
   Both hashes are displayed side-by-side with copy buttons.

### Test 4: Record Custody Transfer
1. Navigate to **Chain of Custody**.
2. Select `EVD-001`.
3. Notice the **Previous Custodian** is auto-populated.
4. Enter a **New Custodian** (e.g. `Forensics Lab Vault #3`) and choose a reason (e.g. `Court Presentation & Legal Proceedings`).
5. Click **Submit & Record Transfer Event**.
6. **Expected Result:** Current custodian updates in the master record, and the timeline displays the new handover event.

### Test 5: Search & Filter Evidence
1. Navigate to **Evidence Repository**.
2. Type `sample_log` or `EVD-002` in the search box.
3. Filter by **Log File** or **Verified**.
4. **Expected Result:** Only matching records appear.

### Test 6: Persistence
1. Register a new evidence file or record a custody transfer.
2. Refresh the browser (`F5` or `Ctrl+R`).
3. **Expected Result:** All registered records and custody events remain intact via browser `localStorage`. (To reset, click **Reset Demo** in the topbar).

### Test 7: Honest Blockchain Status
1. Navigate to **Blockchain Records**.
2. **Expected Result:** The page honestly states:
   > *“Blockchain connection is not configured. Evidence registration and custody events are currently stored as local demonstration records.”*  
   No fake transaction hashes, fake block numbers, or fabricated confirmations are displayed.

---

## 5. Implementation Status Breakdown

| Feature | Category | Details |
|---|---|---|
| **SHA-256 Calculation** | **Implemented** | Real Web Crypto API client-side hashing |
| **Integrity Verification** | **Implemented** | Compares uploaded file against registered reference hash |
| **Custody Handover** | **Implemented** | Full transfer logging with custody audit timeline |
| **Evidence Repository** | **Implemented** | Search, filter by type/status, sort, export JSON |
| **Offline Persistence** | **Simulated** | Browser `localStorage` for testing without backend |
| **Access Control Matrix** | **Simulated** | RBAC specification (requires server-side auth in prod) |
| **Smart Contract** | **Planned** | `ForensiChain.sol` source code ready for EVM deployment |

---

## 6. Directory Structure

```
d:\Blockchain-Chain of Custody\
├── index.html                  # HTML entry point with fonts & metadata
├── package.json                # Project dependencies and run scripts
├── vite.config.js              # Vite bundler configuration
├── src/
│   ├── main.jsx                # React DOM root render
│   ├── App.jsx                 # App root, routing state, modal controller
│   ├── index.css               # Vanilla CSS cyber SOC design system
│   ├── components/
│   │   ├── Sidebar.jsx         # 8-item navigation drawer with shield/chain logo
│   │   ├── Topbar.jsx          # Breadcrumbs, sandbox modal, reset demo, notifications
│   │   ├── StatCard.jsx        # Stat card with Demo Data badge and accent glow
│   │   ├── StatusBadge.jsx     # Status indicators (Verified, Mismatch, Pending)
│   │   ├── EvidenceTable.jsx   # Searchable & filterable evidence table
│   │   ├── CustodyTimeline.jsx # Chronological custody and integrity audit trail
│   │   ├── EvidenceDetailModal.jsx # Detailed forensic dossier view
│   │   └── ToastNotification.jsx  # Notification toast system
│   ├── pages/
│   │   ├── Dashboard.jsx        # Operations dashboard with system status
│   │   ├── RegisterEvidence.jsx # Evidence intake with live Web Crypto SHA-256
│   │   ├── VerifyIntegrity.jsx  # Hash comparison engine with VERIFIED / MISMATCH
│   │   ├── CustodyHistory.jsx   # Custody transfer form & audit timeline
│   │   ├── EvidenceRepository.jsx # Full searchable catalog & JSON export
│   │   ├── SecurityAccess.jsx   # RBAC model & segregation of duties matrix
│   │   ├── BlockchainRecords.jsx# Honest unconfigured status & ForensiChain.sol
│   │   └── AboutProject.jsx     # Problem, solution, tech stack & standards
│   └── services/
│       ├── hashService.js       # SubtleCrypto SHA-256 functions
│       ├── evidenceService.js   # LocalStorage CRUD & synthetic demo files
│       └── blockchainService.js # Honest blockchain status & Solidity contract
└── README.md                   # Complete documentation & test manual
```

---

## 7. License & Academic Attribution
Developed for digital forensics academic demonstration and research into blockchain-backed chain of custody integrity.
