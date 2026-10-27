/**
 * ForensiChain - Hash Service
 * Calculates genuine cryptographic SHA-256 hashes using the browser's native Web Crypto API.
 */

/**
 * Calculates SHA-256 hash of a File or Blob object using crypto.subtle.digest.
 * @param {File|Blob} file 
 * @returns {Promise<string>} 64-character lowercase hexadecimal SHA-256 hash
 */
export async function calculateFileSHA256(file) {
  if (!file) {
    throw new Error('No file provided for hashing');
  }

  // Read the file as an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Calculate the SHA-256 digest using the browser's Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  
  // Convert ArrayBuffer to Array of 8-bit unsigned integers
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Convert bytes to 64-character hexadecimal string
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
    
  return hashHex.toLowerCase();
}

/**
 * Calculates SHA-256 hash of a plain text string.
 * @param {string} text 
 * @returns {Promise<string>} 64-character hexadecimal SHA-256 hash
 */
export async function calculateTextSHA256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();
}

/**
 * Formats a 64-char hash for display (e.g., "7a8b...3f9c")
 * @param {string} hash 
 * @param {number} prefixLength 
 * @param {number} suffixLength 
 * @returns {string}
 */
export function truncateHash(hash, prefixLength = 8, suffixLength = 8) {
  if (!hash || typeof hash !== 'string') return '';
  if (hash.length <= prefixLength + suffixLength) return hash;
  return `${hash.slice(0, prefixLength)}...${hash.slice(-suffixLength)}`;
}

/**
 * Validates whether a string is a valid 64-character hexadecimal SHA-256 hash.
 * @param {string} hash 
 * @returns {boolean}
 */
export function isValidSHA256(hash) {
  if (!hash || typeof hash !== 'string') return false;
  return /^[a-fA-F0-9]{64}$/.test(hash.trim());
}

/**
 * Compares two SHA-256 hashes in a case-insensitive manner.
 * @param {string} hashA 
 * @param {string} hashB 
 * @returns {boolean}
 */
export function compareHashes(hashA, hashB) {
  if (!hashA || !hashB) return false;
  return hashA.trim().toLowerCase() === hashB.trim().toLowerCase();
}
