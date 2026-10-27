/**
 * ForensiChain - Evidence Service
 * Manages local storage persistence for digital forensic evidence,
 * custody records, and verification activity logs.
 * All records are clearly designated as Local Demonstration Data.
 */

import { calculateTextSHA256 } from './hashService';

const STORAGE_KEYS = {
  EVIDENCE: 'forensichain_evidence_records',
  ACTIVITIES: 'forensichain_activity_log',
  TRANSFERS: 'forensichain_custody_transfers'
};

// Synthetic test file templates for realistic demonstration & testing
export const SYNTHETIC_SAMPLE_FILES = {
  'EVD-001': {
    name: 'sample_log.txt',
    type: 'Log File',
    content: `[2026-10-24 03:14:22 UTC] AUTH_SUCCESS: User admin logged in from IP 192.168.1.45
[2026-10-24 03:15:01 UTC] PRIVILEGE_ESCALATION: Sudo rights invoked for audit script
[2026-10-24 03:18:40 UTC] FILE_ACCESS: /var/log/secure read by process PID 4120
[2026-10-24 03:22:11 UTC] SESSION_TERMINATED: User admin closed session gracefully
# Forensic Acquisition Integrity Check - ForensiChain Synthetic Test Artifact`,
    // Tampered variation for testing mismatch
    tamperedContent: `[2026-10-24 03:14:22 UTC] AUTH_SUCCESS: User admin logged in from IP 192.168.1.45
[2026-10-24 03:15:01 UTC] PRIVILEGE_ESCALATION: Sudo rights invoked for audit script
[2026-10-24 03:18:40 UTC] FILE_ACCESS: /var/log/secure MODIFIED BY UNKNOWN PROCESS [TAMPERED]
[2026-10-24 03:22:11 UTC] SESSION_TERMINATED: User admin closed session gracefully
# Forensic Acquisition Integrity Check - ForensiChain Synthetic Test Artifact`
  },
  'EVD-002': {
    name: 'sample_network_report.txt',
    type: 'Network Capture',
    content: `======================================================================
FORENSIC NETWORK TRAFFIC CAPTURE SUMMARY REPORT
CASE ID: CR-2026-0891 | CAPTURE DURATION: 1800s
======================================================================
Protocol Breakdown:
- HTTPS / TLS 1.3: 74.2% (14,920 packets)
- DNS / UDP 53: 12.1% (2,431 packets)
- SSH / TCP 22: 8.5% (1,710 packets)
- ICMP: 5.2% (1,044 packets)
Suspicious Connections: None detected. Exfiltration beacon check: NEGATIVE.
MD5 Reference: 9f83a00918cba23101bf8a892019ab32
ForensiChain Synthetic Acquisition Record.`,
    tamperedContent: `======================================================================
FORENSIC NETWORK TRAFFIC CAPTURE SUMMARY REPORT [TAMPERED - EXFILTRATION DETECTED]
CASE ID: CR-2026-0891 | CAPTURE DURATION: 1800s
======================================================================
Protocol Breakdown:
- HTTPS / TLS 1.3: 70.0%
- DNS / UDP 53: 12.1%
- SSH / TCP 22: 12.7%
Suspicious Connections: UNKNOWN IP 185.220.101.5 DETECTED.`
  },
  'EVD-003': {
    name: 'sample_system_report.txt',
    type: 'System Report',
    content: `FORENSIC SYSTEM STATE ARTIFACT DUMP
System Architecture: x86_64 Linux Kernel 6.8.0-31-generic
Hostname: sec-workstation-09.internal
Acquisition Timestamp: 2026-10-25T11:20:00Z
Active Running Processes: 184 | Memory Total: 32768MB | Memory Free: 18420MB
Disk Partition UUID: 4f820c29-3a1b-4cf3-9b48-9411ca728901
Acquired By: Lead Investigator Sarah Chen (Badge #DFIR-4402)
ForensiChain Synthetic Demonstration File.`,
    tamperedContent: `FORENSIC SYSTEM STATE ARTIFACT DUMP [MODIFIED]
System Architecture: x86_64 Linux Kernel 6.8.0-31-generic
Hostname: sec-workstation-09.internal
Acquisition Timestamp: 2026-10-25T11:20:00Z
Active Running Processes: 9999 [TAMPERED]
Disk Partition UUID: 4f820c29-3a1b-4cf3-9b48-9411ca728901`
  }
};

/**
 * Generates the initial seed demonstration records with actual Web Crypto hashes.
 */
export async function generateInitialDemoData() {
  const hash1 = await calculateTextSHA256(SYNTHETIC_SAMPLE_FILES['EVD-001'].content);
  const hash2 = await calculateTextSHA256(SYNTHETIC_SAMPLE_FILES['EVD-002'].content);
  const hash3 = await calculateTextSHA256(SYNTHETIC_SAMPLE_FILES['EVD-003'].content);

  const initialEvidence = [
    {
      id: 'EVD-001',
      name: 'sample_log.txt',
      type: 'Log File',
      description: 'System authentication audit log acquired from compromised endpoint WS-402.',
      caseId: 'CASE-2026-0891',
      investigator: 'Inspector Sarah Chen',
      custodian: 'Sarah Chen (Lead Forensics)',
      originalHash: hash1,
      currentHash: hash1,
      registeredAt: '2026-10-24T09:30:00Z',
      fileSize: SYNTHETIC_SAMPLE_FILES['EVD-001'].content.length,
      integrityStatus: 'VERIFIED',
      lastVerifiedAt: '2026-10-26T14:15:00Z',
      blockchainStatus: 'Off-Chain (Demo Record)',
      isDemoData: true
    },
    {
      id: 'EVD-002',
      name: 'sample_network_report.txt',
      type: 'Network Capture',
      description: 'Network perimeter gateway packet analysis report during suspicious outbound beacon.',
      caseId: 'CASE-2026-0891',
      investigator: 'Agent Marcus Vance',
      custodian: 'Evidence Locker Alpha-4',
      originalHash: hash2,
      currentHash: hash2,
      registeredAt: '2026-10-25T11:45:00Z',
      fileSize: SYNTHETIC_SAMPLE_FILES['EVD-002'].content.length,
      integrityStatus: 'VERIFIED',
      lastVerifiedAt: '2026-10-26T16:00:00Z',
      blockchainStatus: 'Off-Chain (Demo Record)',
      isDemoData: true
    },
    {
      id: 'EVD-003',
      name: 'sample_system_report.txt',
      type: 'System Report',
      description: 'Forensic volatile memory and running task artifact dump from server SRV-PROD-01.',
      caseId: 'CASE-2026-0904',
      investigator: 'Inspector Sarah Chen',
      custodian: 'Forensics Lab Vault',
      originalHash: hash3,
      currentHash: hash3,
      registeredAt: '2026-10-26T08:15:00Z',
      fileSize: SYNTHETIC_SAMPLE_FILES['EVD-003'].content.length,
      integrityStatus: 'PENDING',
      lastVerifiedAt: null,
      blockchainStatus: 'Off-Chain (Demo Record)',
      isDemoData: true
    }
  ];

  const initialActivities = [
    {
      id: 'ACT-001',
      type: 'EVIDENCE_REGISTERED',
      evidenceId: 'EVD-001',
      title: 'Evidence Registered',
      description: 'Synthetic evidence sample_log.txt registered with SHA-256 hash.',
      actor: 'Inspector Sarah Chen',
      timestamp: '2026-10-24T09:30:00Z',
      status: 'SUCCESS'
    },
    {
      id: 'ACT-002',
      type: 'CUSTODY_TRANSFER',
      evidenceId: 'EVD-001',
      title: 'Custody Transferred',
      description: 'Transferred from Field Investigator to Sarah Chen (Lead Forensics) for lab examination.',
      actor: 'Sarah Chen',
      timestamp: '2026-10-24T14:00:00Z',
      status: 'SUCCESS'
    },
    {
      id: 'ACT-003',
      type: 'EVIDENCE_REGISTERED',
      evidenceId: 'EVD-002',
      title: 'Evidence Registered',
      description: 'Network capture sample_network_report.txt registered with SHA-256 hash.',
      actor: 'Agent Marcus Vance',
      timestamp: '2026-10-25T11:45:00Z',
      status: 'SUCCESS'
    },
    {
      id: 'ACT-004',
      type: 'INTEGRITY_VERIFIED',
      evidenceId: 'EVD-001',
      title: 'File Integrity Verified',
      description: 'SHA-256 verification confirmed match with initial reference hash.',
      actor: 'Auditor David Kim',
      timestamp: '2026-10-26T14:15:00Z',
      status: 'VERIFIED'
    },
    {
      id: 'ACT-005',
      type: 'EVIDENCE_REGISTERED',
      evidenceId: 'EVD-003',
      title: 'Evidence Registered',
      description: 'System report sample_system_report.txt registered locally.',
      actor: 'Inspector Sarah Chen',
      timestamp: '2026-10-26T08:15:00Z',
      status: 'SUCCESS'
    }
  ];

  const initialTransfers = [
    {
      id: 'TRF-001',
      evidenceId: 'EVD-001',
      previousCustodian: 'Field Acquisition Unit',
      newCustodian: 'Sarah Chen (Lead Forensics)',
      reason: 'Forensic Lab Ingestion and Deep Packet Inspection',
      notes: 'Chain of custody form signed. Stored in tamper-evident anti-static container.',
      timestamp: '2026-10-24T14:00:00Z',
      badge: 'DFIR-4402'
    },
    {
      id: 'TRF-002',
      evidenceId: 'EVD-002',
      previousCustodian: 'Agent Marcus Vance',
      newCustodian: 'Evidence Locker Alpha-4',
      reason: 'Secure Long-Term Forensic Vault Storage',
      notes: 'Vault slot #108. Dual-custody key authorization.',
      timestamp: '2026-10-25T16:30:00Z',
      badge: 'DFIR-1099'
    }
  ];

  return { initialEvidence, initialActivities, initialTransfers };
}

/**
 * Initializes localStorage if empty.
 */
export async function initializeStorageIfNeeded() {
  const existing = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
  if (!existing) {
    const { initialEvidence, initialActivities, initialTransfers } = await generateInitialDemoData();
    localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(initialEvidence));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(initialTransfers));
    return initialEvidence;
  }
  return JSON.parse(existing);
}

/**
 * Resets local storage back to default synthetic demo data.
 */
export async function resetDemoData() {
  const { initialEvidence, initialActivities, initialTransfers } = await generateInitialDemoData();
  localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(initialEvidence));
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
  localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(initialTransfers));
  return { initialEvidence, initialActivities, initialTransfers };
}

/**
 * Gets all evidence records.
 */
export function getAllEvidence() {
  const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error parsing evidence records from localStorage:', err);
    return [];
  }
}

/**
 * Gets a specific evidence record by ID.
 */
export function getEvidenceById(id) {
  const list = getAllEvidence();
  return list.find(e => e.id.toLowerCase() === id.toLowerCase()) || null;
}

/**
 * Registers a new evidence item and persists in localStorage.
 */
export function registerNewEvidence({
  name,
  type,
  description,
  caseId,
  investigator,
  custodian,
  hash,
  fileSize
}) {
  const list = getAllEvidence();
  
  // Generate next EVD-XXX ID
  const nextNumber = list.length + 1;
  const newId = `EVD-${String(nextNumber).padStart(3, '0')}`;
  const now = new Date().toISOString();

  const newRecord = {
    id: newId,
    name: name.trim(),
    type: type || 'Other',
    description: description ? description.trim() : 'Digital forensic evidence artifact.',
    caseId: caseId ? caseId.trim() : 'CASE-UNASSIGNED',
    investigator: investigator ? investigator.trim() : 'Forensic Investigator',
    custodian: custodian ? custodian.trim() : (investigator ? investigator.trim() : 'Evidence Locker'),
    originalHash: hash.toLowerCase().trim(),
    currentHash: hash.toLowerCase().trim(),
    registeredAt: now,
    fileSize: fileSize || 0,
    integrityStatus: 'VERIFIED',
    lastVerifiedAt: now,
    blockchainStatus: 'Off-Chain (Demo Record)',
    isDemoData: false
  };

  list.unshift(newRecord);
  localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(list));

  // Log activity
  logActivity({
    type: 'EVIDENCE_REGISTERED',
    evidenceId: newId,
    title: 'Evidence Registered',
    description: `Registered "${newRecord.name}" with SHA-256 hash ${hash.slice(0, 10)}...`,
    actor: newRecord.investigator,
    timestamp: now,
    status: 'SUCCESS'
  });

  return newRecord;
}

/**
 * Updates an evidence record's integrity verification result.
 */
export function updateEvidenceIntegrity(id, { isMatch, calculatedHash, verifiedBy = 'Forensic Investigator' }) {
  const list = getAllEvidence();
  const index = list.findIndex(e => e.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const now = new Date().toISOString();
  const status = isMatch ? 'VERIFIED' : 'MISMATCH';

  list[index] = {
    ...list[index],
    integrityStatus: status,
    lastVerifiedAt: now,
    lastCalculatedHash: calculatedHash
  };

  localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(list));

  // Log activity
  logActivity({
    type: isMatch ? 'INTEGRITY_VERIFIED' : 'INTEGRITY_MISMATCH',
    evidenceId: list[index].id,
    title: isMatch ? 'File Integrity Verified' : 'Integrity Mismatch Detected',
    description: isMatch 
      ? `SHA-256 verified identical to registered reference hash for ${list[index].name}.`
      : `CRITICAL: Hash mismatch detected on ${list[index].name}! Content differs from registered baseline.`,
    actor: verifiedBy,
    timestamp: now,
    status: isMatch ? 'VERIFIED' : 'ALERT'
  });

  return list[index];
}

/**
 * Updates the custodian when a custody transfer is performed.
 */
export function updateEvidenceCustodian(id, newCustodian) {
  const list = getAllEvidence();
  const index = list.findIndex(e => e.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    custodian: newCustodian
  };

  localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(list));
  return list[index];
}

/**
 * Activities logging and retrieval.
 */
export function getAllActivities() {
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function logActivity(activity) {
  const list = getAllActivities();
  const newActivity = {
    id: `ACT-${Date.now().toString().slice(-4)}`,
    ...activity,
    timestamp: activity.timestamp || new Date().toISOString()
  };
  list.unshift(newActivity);
  // Keep last 50 activities
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(list.slice(0, 50)));
  return newActivity;
}

/**
 * Custody transfers retrieval and recording.
 */
export function getAllTransfers() {
  const raw = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function recordCustodyTransfer({
  evidenceId,
  previousCustodian,
  newCustodian,
  reason,
  notes,
  badge
}) {
  const transfers = getAllTransfers();
  const now = new Date().toISOString();
  const transferRecord = {
    id: `TRF-${String(transfers.length + 1).padStart(3, '0')}`,
    evidenceId,
    previousCustodian,
    newCustodian,
    reason: reason.trim(),
    notes: notes ? notes.trim() : 'Standard chain of custody handover protocol observed.',
    timestamp: now,
    badge: badge ? badge.trim() : 'DFIR-OFFICER'
  };

  transfers.unshift(transferRecord);
  localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));

  // Update custodian in evidence master record
  updateEvidenceCustodian(evidenceId, newCustodian);

  // Log activity
  logActivity({
    type: 'CUSTODY_TRANSFER',
    evidenceId,
    title: 'Custody Handover Recorded',
    description: `Custody transferred from ${previousCustodian} to ${newCustodian}. Reason: ${reason}`,
    actor: newCustodian,
    timestamp: now,
    status: 'SUCCESS'
  });

  return transferRecord;
}

/**
 * Computes dashboard statistics.
 */
export function getForensicStatistics() {
  const evidence = getAllEvidence();
  const transfers = getAllTransfers();

  const totalRegistered = evidence.length;
  const integrityVerified = evidence.filter(e => e.integrityStatus === 'VERIFIED').length;
  const integrityMismatch = evidence.filter(e => e.integrityStatus === 'MISMATCH').length;
  const totalTransfers = transfers.length;

  return {
    totalRegistered,
    integrityVerified,
    integrityMismatch,
    totalTransfers
  };
}
