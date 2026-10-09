/**
 * CipherLink Cryptographic Core
 * Uses W3C Web Cryptography API (crypto.subtle)
 * AES-GCM 256-bit authenticated encryption with PBKDF2 key derivation.
 */

export interface EncryptedPayload {
  iv: string; // Base64 12-byte initialization vector
  data: string; // Base64 ciphertext with appended 128-bit authentication tag
  timestamp: number;
  ephemeralSeconds?: number;
  messageId: string;
}

export interface KeyDetails {
  key: CryptoKey;
  channelCode: string;
  hasPassphrase: boolean;
  safetyNumber: string; // Formatted 6-digit security code (e.g., "482 910")
  fingerprintHex: string; // 8-byte hex snippet
  iterations: number;
  algorithm: string;
}

// Base64 encoding/decoding utilities
export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Derives an AES-GCM-256 key from a channel PIN and an optional high-entropy passkey.
 * PBKDF2 with SHA-256, 120,000 iterations.
 */
export async function deriveChannelKey(
  channelCode: string,
  passphrase?: string
): Promise<KeyDetails> {
  const normalizedCode = channelCode.trim();
  const normalizedPass = (passphrase || '').trim();

  const secretInput = normalizedPass
    ? `CipherLink:${normalizedCode}:Passphrase:${normalizedPass}`
    : `CipherLink:${normalizedCode}`;

  const encoder = new TextEncoder();
  const rawKeyMaterial = encoder.encode(secretInput);

  // Import raw key material
  const importedMaterial = await crypto.subtle.importKey(
    'raw',
    rawKeyMaterial,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const salt = encoder.encode('CipherLink-v2-educational-gcm-salt');
  const iterations = 120000;

  // Derive AES-GCM 256 key
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    importedMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // Extractable so we can compute the Safety Number fingerprint
    ['encrypt', 'decrypt']
  );

  // Compute safety number (fingerprint) by hashing the raw derived key bytes
  const rawExported = await crypto.subtle.exportKey('raw', key);
  const digest = await crypto.subtle.digest('SHA-256', rawExported);
  const digestBytes = new Uint8Array(digest);

  // Take first 4 bytes to form a 6-digit human-readable Safety Number
  const numValue =
    ((digestBytes[0] << 24) |
      (digestBytes[1] << 16) |
      (digestBytes[2] << 8) |
      digestBytes[3]) >>> 0;
  const sixDigit = String(numValue % 1000000).padStart(6, '0');
  const formattedSafetyNumber = `${sixDigit.slice(0, 3)} ${sixDigit.slice(3, 6)}`;
  const fingerprintHex = bufferToHex(digestBytes.slice(0, 8)).toUpperCase();

  return {
    key,
    channelCode: normalizedCode,
    hasPassphrase: Boolean(normalizedPass),
    safetyNumber: formattedSafetyNumber,
    fingerprintHex,
    iterations,
    algorithm: 'AES-GCM 256-bit',
  };
}

/**
 * Encrypts plaintext string using AES-GCM with a fresh cryptographically random 12-byte IV.
 */
export async function encryptMessage(
  plaintext: string,
  key: CryptoKey,
  options?: { ephemeralSeconds?: number; messageId?: string }
): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(plaintext);

  // 12-byte (96-bit) IV recommended for AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedData
  );

  return {
    iv: arrayBufferToBase64(iv),
    data: arrayBufferToBase64(new Uint8Array(encryptedBuffer)),
    timestamp: Date.now(),
    ephemeralSeconds: options?.ephemeralSeconds,
    messageId: options?.messageId || crypto.randomUUID(),
  };
}

/**
 * Decrypts AES-GCM ciphertext payload and returns plaintext.
 * Throws if authentication tag fails (tampered or wrong key).
 */
export async function decryptMessage(
  payload: EncryptedPayload,
  key: CryptoKey
): Promise<string> {
  const iv = base64ToArrayBuffer(payload.iv);
  const ciphertext = base64ToArrayBuffer(payload.data);

  const ivBuffer = iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength) as ArrayBuffer;
  const ciphertextBuffer = ciphertext.buffer.slice(
    ciphertext.byteOffset,
    ciphertext.byteOffset + ciphertext.byteLength
  ) as ArrayBuffer;

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBuffer,
    },
    key,
    ciphertextBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}
