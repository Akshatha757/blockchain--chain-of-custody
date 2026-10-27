/**
 * ForensiChain - Blockchain Integration Service
 * 
 * Provides an honest interface to the blockchain layer.
 * Current State: NOT CONNECTED (Local Demonstration Mode).
 * 
 * In this version, all evidence hashes and custody transfers are recorded locally.
 * No fake transactions, fake blocks, or fake confirmations are displayed.
 */

export const BLOCKCHAIN_CONFIG = {
  status: 'Not Connected',
  network: 'None (Local Demonstration Mode)',
  contractAddress: null,
  provider: null,
  isLive: false,
  message: 'Blockchain connection is not configured. Evidence registration and custody events are currently stored as local demonstration records.'
};

/**
 * Proposed Solidity Smart Contract for ForensiChain
 * Ready to be deployed on Ethereum / Polygon / Sepolia testnet.
 */
export const SOLIDITY_CONTRACT_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ForensiChain
 * @notice Immutable digital forensic evidence registry and chain of custody tracking
 * @dev Only 32-byte SHA-256 hashes and metadata URIs are stored on-chain.
 *      Actual evidence files remain off-chain for privacy and gas efficiency.
 */
contract ForensiChain {
    struct Evidence {
        bytes32 sha256Hash;
        string evidenceId;
        string caseId;
        string metadataUri; // IPFS or secure off-chain storage pointer
        address registeredBy;
        address currentCustodian;
        uint256 registeredTimestamp;
        bool exists;
    }

    struct CustodyTransfer {
        address previousCustodian;
        address newCustodian;
        string reason;
        uint256 timestamp;
        bytes signature; // EIP-712 digital signature of the transfer
    }

    address public immutable auditorAdmin;
    
    // evidenceId => Evidence Record
    mapping(string => Evidence) private _evidenceRecords;
    
    // evidenceId => CustodyTransfer[]
    mapping(string => CustodyTransfer[]) private _custodyHistory;

    // Events for decentralized event logging
    event EvidenceRegistered(
        string indexed evidenceId,
        bytes32 indexed sha256Hash,
        string caseId,
        address indexed investigator,
        uint256 timestamp
    );

    event CustodyTransferred(
        string indexed evidenceId,
        address indexed previousCustodian,
        address indexed newCustodian,
        string reason,
        uint256 timestamp
    );

    modifier onlyCustodian(string memory evidenceId) {
        require(_evidenceRecords[evidenceId].exists, "Evidence record does not exist");
        require(
            msg.sender == _evidenceRecords[evidenceId].currentCustodian || msg.sender == auditorAdmin,
            "Caller is not authorized custodian"
        );
        _;
    }

    constructor() {
        auditorAdmin = msg.sender;
    }

    /**
     * @notice Registers a new digital forensic evidence hash
     */
    function registerEvidence(
        string calldata evidenceId,
        bytes32 sha256Hash,
        string calldata caseId,
        string calldata metadataUri
    ) external {
        require(!_evidenceRecords[evidenceId].exists, "Evidence ID already registered");
        require(sha256Hash != bytes32(0), "Invalid SHA-256 hash");

        _evidenceRecords[evidenceId] = Evidence({
            sha256Hash: sha256Hash,
            evidenceId: evidenceId,
            caseId: caseId,
            metadataUri: metadataUri,
            registeredBy: msg.sender,
            currentCustodian: msg.sender,
            registeredTimestamp: block.timestamp,
            exists: true
        });

        emit EvidenceRegistered(evidenceId, sha256Hash, caseId, msg.sender, block.timestamp);
    }

    /**
     * @notice Records an authorized custody transfer
     */
    function transferCustody(
        string calldata evidenceId,
        address newCustodian,
        string calldata reason,
        bytes calldata signature
    ) external onlyCustodian(evidenceId) {
        require(newCustodian != address(0), "Invalid new custodian address");

        address prev = _evidenceRecords[evidenceId].currentCustodian;
        _evidenceRecords[evidenceId].currentCustodian = newCustodian;

        _custodyHistory[evidenceId].push(CustodyTransfer({
            previousCustodian: prev,
            newCustodian: newCustodian,
            reason: reason,
            timestamp: block.timestamp,
            signature: signature
        }));

        emit CustodyTransferred(evidenceId, prev, newCustodian, reason, block.timestamp);
    }

    /**
     * @notice Verifies whether a given SHA-256 hash matches the on-chain reference
     */
    function verifyHash(string calldata evidenceId, bytes32 testHash) external view returns (bool) {
        require(_evidenceRecords[evidenceId].exists, "Evidence does not exist");
        return _evidenceRecords[evidenceId].sha256Hash == testHash;
    }

    function getEvidence(string calldata evidenceId) external view returns (Evidence memory) {
        require(_evidenceRecords[evidenceId].exists, "Evidence does not exist");
        return _evidenceRecords[evidenceId];
    }
}`;

/**
 * Returns current honest blockchain connection info.
 */
export function getBlockchainStatus() {
  return {
    ...BLOCKCHAIN_CONFIG,
    timestamp: new Date().toISOString()
  };
}

/**
 * Stub function ready for Ethers.js / Web3.js integration.
 * In this demonstration version, it gracefully reports that the blockchain is unconfigured.
 */
export async function submitEvidenceToBlockchain(_evidenceRecord) {
  return {
    success: false,
    error: 'Blockchain connection is not configured. Evidence registration and custody events are currently stored as local demonstration records.'
  };
}
