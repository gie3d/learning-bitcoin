import { secp256k1 } from "@noble/curves/secp256k1.js";
import {
  base58Check,
  bytesToHex,
  derivePublicKey,
  generatePrivateKey,
  hash160,
  hexToBytes,
} from "./secp256k1";

export interface Cosigner {
  privateKey: string;
  publicKey: string;
}

/** A fresh cosigner keypair, generated locally with OS entropy. */
export function createCosigner(): Cosigner {
  const privateKey = generatePrivateKey();
  return { privateKey, publicKey: derivePublicKey(privateKey) };
}

/**
 * Build a real bare-multisig redeem script:
 *   OP_M <pubkey1> ... <pubkeyN> OP_N OP_CHECKMULTISIG
 * Returns the serialized script as hex.
 */
export function buildRedeemScript(m: number, publicKeys: string[]): string {
  const n = publicKeys.length;
  if (m < 1 || m > n || n > 15) throw new Error("invalid multisig threshold");

  // OP_1..OP_16 are 0x51..0x60
  const opN = (num: number) => (0x50 + num).toString(16).padStart(2, "0");

  const pushes = publicKeys
    .map((pk) => (pk.length / 2).toString(16).padStart(2, "0") + pk)
    .join("");

  return opN(m) + pushes + opN(n) + "ae"; // 0xae = OP_CHECKMULTISIG
}

/** Human-readable assembly form of the redeem script. */
export function redeemScriptAsm(m: number, publicKeys: string[]): string {
  const keys = publicKeys.map((pk) => `  <${pk.slice(0, 10)}…${pk.slice(-6)}>`).join("\n");
  return `OP_${m}\n${keys}\nOP_${publicKeys.length}\nOP_CHECKMULTISIG`;
}

/** P2SH address (mainnet, starts with "3") for an M-of-N redeem script. */
export async function redeemScriptToP2shAddress(redeemScriptHex: string): Promise<string> {
  return base58Check(0x05, await hash160(hexToBytes(redeemScriptHex)));
}

/**
 * Sign a transaction message with one cosigner's key.
 * noble prehashes with SHA-256, which mirrors how Bitcoin signs a sighash.
 */
export function signMessage(message: string, privateKeyHex: string): string {
  const msg = new TextEncoder().encode(message);
  return bytesToHex(secp256k1.sign(msg, hexToBytes(privateKeyHex)));
}

/** Verify one signature against the message and the cosigner's public key. */
export function verifySignature(
  signatureHex: string,
  message: string,
  publicKeyHex: string
): boolean {
  try {
    const msg = new TextEncoder().encode(message);
    return secp256k1.verify(hexToBytes(signatureHex), msg, hexToBytes(publicKeyHex));
  } catch {
    return false;
  }
}
