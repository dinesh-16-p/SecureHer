/**
 * Cryptographic Utility for Tamper-Evident Evidence Vault
 * Uses standard browser Web Crypto API (crypto.subtle)
 */

export async function computeSHA256FromDataUrl(dataUrl) {
  try {
    // Extract base64 part
    const base64Data = dataUrl.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return {
      hashHex,
      byteSize: bytes.byteLength
    };
  } catch (err) {
    console.error('Error calculating SHA-256 hash:', err);
    throw err;
  }
}

export async function verifyEvidenceIntegrity(dataUrl, referenceHash) {
  if (!dataUrl) {
    return { status: 'unverifiable', message: 'Media bytes missing or unreadable.' };
  }
  try {
    const { hashHex } = await computeSHA256FromDataUrl(dataUrl);
    if (hashHex.toLowerCase() === referenceHash.toLowerCase()) {
      return {
        status: 'passed',
        calculatedHash: hashHex,
        message: 'Integrity check passed. File bytes exactly match the initial capture hash.'
      };
    } else {
      return {
        status: 'failed',
        calculatedHash: hashHex,
        referenceHash,
        message: 'Integrity check failed! Stored bytes differ from the reference hash.'
      };
    }
  } catch (err) {
    return {
      status: 'unverifiable',
      message: `Unable to verify integrity: ${err.message}`
    };
  }
}
