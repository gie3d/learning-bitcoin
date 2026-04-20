import { secp256k1 } from "@noble/curves/secp256k1.js";

export interface KeyPair {
  privateKey: string;
  publicKey: string;
  address: string;
}

const N = BigInt(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"
);
const ZERO = BigInt(0);

export function generatePrivateKey(): string {
  const bytes = new Uint8Array(32);
  let k: bigint;
  do {
    crypto.getRandomValues(bytes);
    k = BigInt("0x" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(""));
  } while (k === ZERO || k >= N);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function derivePublicKey(privHex: string): string {
  const pubBytes = secp256k1.getPublicKey(hexToBytes(privHex), true);
  return Array.from(pubBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function multiplyGenerator(kHex: string): { x: string; y: string } {
  // getPublicKey with compressed=false returns 65 bytes: 04 || x(32) || y(32)
  const uncompressed = secp256k1.getPublicKey(hexToBytes(kHex.padStart(64, "0")), false);
  const x = Array.from(uncompressed.slice(1, 33)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const y = Array.from(uncompressed.slice(33, 65)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return { x, y };
}

// ── Minimal RIPEMD-160 implementation ────────────────────────────────────────
// Based on the RIPEMD-160 specification. Used only for Bitcoin address derivation.

function ripemd160(data: Uint8Array): Uint8Array {
  function f(j: number, x: number, y: number, z: number): number {
    if (j < 16) return x ^ y ^ z;
    if (j < 32) return (x & y) | (~x & z);
    if (j < 48) return (x | ~y) ^ z;
    if (j < 64) return (x & z) | (y & ~z);
    return x ^ (y | ~z);
  }
  const K = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
  const KK = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];
  const r = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
  const rr = [5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
  const s = [11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
  const ss = [8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];

  // Padding
  const msgLen = data.length;
  const bitLen = msgLen * 8;
  const padLen = ((msgLen % 64) < 56 ? 56 - (msgLen % 64) : 120 - (msgLen % 64));
  const padded = new Uint8Array(msgLen + padLen + 8);
  padded.set(data);
  padded[msgLen] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(msgLen + padLen, bitLen & 0xffffffff, true);
  dv.setUint32(msgLen + padLen + 4, Math.floor(bitLen / 2 ** 32), true);

  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;

  for (let i = 0; i < padded.length; i += 64) {
    const X: number[] = [];
    for (let j = 0; j < 16; j++) X.push(dv.getUint32(i + j * 4, true));

    let [a, b, c, d, e] = [h0, h1, h2, h3, h4];
    let [aa, bb, cc, dd, ee] = [h0, h1, h2, h3, h4];

    for (let j = 0; j < 80; j++) {
      const jj = Math.floor(j / 16);
      let T = ((a + f(j, b, c, d) + X[r[j]] + K[jj]) | 0);
      T = (((T << s[j]) | (T >>> (32 - s[j]))) + e) | 0;
      [a, b, c, d, e] = [e, T, b, (c << 10) | (c >>> 22), d];

      let TT = ((aa + f(79 - j, bb, cc, dd) + X[rr[j]] + KK[jj]) | 0);
      TT = (((TT << ss[j]) | (TT >>> (32 - ss[j]))) + ee) | 0;
      [aa, bb, cc, dd, ee] = [ee, TT, bb, (cc << 10) | (cc >>> 22), dd];
    }

    const T = (h1 + c + dd) | 0;
    h1 = (h2 + d + ee) | 0;
    h2 = (h3 + e + aa) | 0;
    h3 = (h4 + a + bb) | 0;
    h4 = (h0 + b + cc) | 0;
    h0 = T;
  }

  const out = new Uint8Array(20);
  const odv = new DataView(out.buffer);
  [h0, h1, h2, h3, h4].forEach((h, i) => odv.setUint32(i * 4, h, true));
  return out;
}

async function sha256Bytes(data: Uint8Array): Promise<Uint8Array> {
  const buf = await crypto.subtle.digest("SHA-256", data.buffer as ArrayBuffer);
  return new Uint8Array(buf);
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const B256 = BigInt(256);
const B58 = BigInt(58);
const B0 = BigInt(0);

function base58Encode(bytes: Uint8Array): string {
  let n = B0;
  for (let i = 0; i < bytes.length; i++) n = n * B256 + BigInt(bytes[i]);
  let result = "";
  while (n > B0) {
    result = BASE58_ALPHABET[Number(n % B58)] + result;
    n /= B58;
  }
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] !== 0) break;
    result = "1" + result;
  }
  return result;
}

export async function publicKeyToAddress(compressedPubKeyHex: string): Promise<string> {
  const pubBytes = hexToBytes(compressedPubKeyHex);
  const sha256d = await sha256Bytes(pubBytes);
  const ripemd = ripemd160(sha256d);

  const versioned = new Uint8Array(21);
  versioned[0] = 0x00;
  versioned.set(ripemd, 1);

  const check1 = await sha256Bytes(versioned);
  const check2 = await sha256Bytes(check1);
  const checksum = check2.slice(0, 4);

  const full = new Uint8Array(25);
  full.set(versioned);
  full.set(checksum, 21);

  return base58Encode(full);
}

export async function generateKeyPair(): Promise<KeyPair> {
  const privateKey = generatePrivateKey();
  const publicKey = derivePublicKey(privateKey);
  const address = await publicKeyToAddress(publicKey);
  return { privateKey, publicKey, address };
}

// ── Toy curve: y² = x³ + 7 (mod 43) ─────────────────────────────────────────

const TOY_P = 43;

function modP(n: number): number {
  return ((n % TOY_P) + TOY_P) % TOY_P;
}

function modInv(a: number, p: number): number {
  let [old_r, r] = [a, p];
  let [old_s, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return modP(old_s);
}

type ToyPoint = { x: number; y: number } | "infinity";

function toyAdd(P: ToyPoint, Q: ToyPoint): ToyPoint {
  if (P === "infinity") return Q;
  if (Q === "infinity") return P;
  if (P.x === Q.x && modP(P.y + Q.y) === 0) return "infinity";

  let m: number;
  if (P.x === Q.x && P.y === Q.y) {
    m = modP(modInv(modP(2 * P.y), TOY_P) * modP(3 * P.x * P.x));
  } else {
    m = modP(modInv(modP(Q.x - P.x), TOY_P) * modP(Q.y - P.y));
  }
  const rx = modP(m * m - P.x - Q.x);
  const ry = modP(m * (P.x - rx) - P.y);
  return { x: rx, y: ry };
}

// Generator point for toy curve
const TOY_G: ToyPoint = { x: 6, y: 34 };

export function toyMultiply(k: number): ToyPoint {
  let result: ToyPoint = "infinity";
  let addend: ToyPoint = TOY_G;
  let n = k;
  while (n > 0) {
    if (n & 1) result = toyAdd(result, addend);
    addend = toyAdd(addend, addend);
    n >>= 1;
  }
  return result;
}

export function toyPoints(): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  for (let x = 0; x < TOY_P; x++) {
    const rhs = modP(x * x * x + 7);
    for (let y = 0; y < TOY_P; y++) {
      if (modP(y * y) === rhs) pts.push({ x, y });
    }
  }
  return pts;
}
