import { secp256k1 } from "@noble/curves/secp256k1.js";
import {
  base58Check,
  bytesToHex,
  CURVE_ORDER,
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

// ── BIP32 child key derivation ───────────────────────────────────────────────
// A multisig wallet doesn't hold one address, it holds a descriptor. Each
// cosigner contributes an extended key, and every receive address is derived
// from the same index on all of them.

export interface ExtendedCosigner extends Cosigner {
  /** 32-byte chain code — the extra entropy BIP32 mixes into each child. */
  chainCode: string;
  /** First 4 bytes of hash160(publicKey), how wallets label a cosigner. */
  fingerprint: string;
}

export async function createExtendedCosigner(): Promise<ExtendedCosigner> {
  const { privateKey, publicKey } = createCosigner();
  const chainCode = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
  const fingerprint = bytesToHex((await hash160(hexToBytes(publicKey))).slice(0, 4));
  return { privateKey, publicKey, chainCode, fingerprint };
}

async function hmacSha512(keyHex: string, data: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBytes(keyHex) as BufferSource,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, data as BufferSource));
}

/**
 * BIP32 non-hardened CKDpriv:
 *   I = HMAC-SHA512(chainCode, serP(pubKey) || ser32(index))
 *   childKey = (I[0:32] + parentKey) mod n,  childChainCode = I[32:64]
 */
export async function deriveChild(
  parent: ExtendedCosigner,
  index: number
): Promise<ExtendedCosigner> {
  const data = new Uint8Array(37);
  data.set(hexToBytes(parent.publicKey));
  new DataView(data.buffer).setUint32(33, index, false); // big-endian ser32(index)

  const I = await hmacSha512(parent.chainCode, data);
  const tweak = BigInt("0x" + bytesToHex(I.slice(0, 32)));
  if (tweak >= CURVE_ORDER) throw new Error("invalid child key, use the next index");

  const childKey = (tweak + BigInt("0x" + parent.privateKey)) % CURVE_ORDER;
  if (childKey === BigInt(0)) throw new Error("invalid child key, use the next index");

  const privateKey = childKey.toString(16).padStart(64, "0");
  const publicKey = derivePublicKey(privateKey);
  const fingerprint = bytesToHex((await hash160(hexToBytes(publicKey))).slice(0, 4));
  return { privateKey, publicKey, chainCode: bytesToHex(I.slice(32)), fingerprint };
}

/**
 * The receive address at one index: derive the same path on every cosigner,
 * then build the M-of-N script from the resulting public keys.
 */
export async function deriveReceiveAddress(
  branchKeys: ExtendedCosigner[],
  m: number,
  index: number
): Promise<{ address: string; publicKeys: string[] }> {
  const children = await Promise.all(branchKeys.map((k) => deriveChild(k, index)));
  const publicKeys = children.map((c) => c.publicKey);
  const address = await redeemScriptToP2shAddress(buildRedeemScript(m, publicKeys));
  return { address, publicKeys };
}
