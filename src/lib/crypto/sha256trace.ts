// Pure-JS SHA-256 that exposes full intermediate state for educational tracing.
// Single-block only: handles messages up to 55 bytes (fits in one 512-bit block).

// ── Constants ────────────────────────────────────────────────────────────────

const K: number[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

const H_INIT: number[] = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

// ── Bit helpers ──────────────────────────────────────────────────────────────

function rotr(x: number, n: number): number {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}
function add32(...args: number[]): number {
  return args.reduce((a, b) => (a + b) >>> 0, 0);
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface Sha256RoundState {
  // Schedule word and round constant
  w: number;
  k: number;
  // Working variables at START of round
  a: number; b: number; c: number; d: number;
  e: number; f: number; g: number; h: number;
  // Computed intermediates
  s1: number;
  ch: number;
  t1: number;
  s0: number;
  maj: number;
  t2: number;
  // State at END of round (new a and e; rest shift)
  a_new: number;
  e_new: number;
}

export interface Sha256Trace {
  input: string;
  msgLen: number;
  paddedBytes: Uint8Array;
  schedule: number[];       // W[0..63]
  initialState: number[];   // H[0..7] before compression
  rounds: Sha256RoundState[];
  finalState: number[];     // H[0..7] after compression (add initial + compressed)
  hash: string;
}

// ── Main function ─────────────────────────────────────────────────────────────

export function sha256trace(message: string): Sha256Trace {
  const msgBytes = new TextEncoder().encode(message);
  const msgLen = msgBytes.length;

  // ── 1. Pad to 64 bytes ──────────────────────────────────────────────────
  const padded = new Uint8Array(64);
  padded.set(msgBytes);
  padded[msgLen] = 0x80;
  // Write 64-bit big-endian bit-length in the last 8 bytes
  const bitLen = msgLen * 8;
  const view = new DataView(padded.buffer);
  view.setUint32(56, Math.floor(bitLen / 2 ** 32), false);
  view.setUint32(60, bitLen >>> 0, false);

  // ── 2. Build message schedule ───────────────────────────────────────────
  const W: number[] = new Array(64);
  for (let i = 0; i < 16; i++) {
    W[i] = view.getUint32(i * 4, false);
  }
  for (let i = 16; i < 64; i++) {
    const s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
    const s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
    W[i] = add32(s0, W[i - 7], s1, W[i - 16]);
  }

  // ── 3. Compression ─────────────────────────────────────────────────────
  const [h0i, h1i, h2i, h3i, h4i, h5i, h6i, h7i] = H_INIT;
  let a = h0i, b = h1i, c = h2i, d = h3i;
  let e = h4i, f = h5i, g = h6i, h = h7i;

  const rounds: Sha256RoundState[] = [];

  for (let i = 0; i < 64; i++) {
    const s1  = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
    const ch  = ((e & f) ^ (~e & g)) >>> 0;
    const t1  = add32(h, s1, ch, K[i], W[i]);
    const s0  = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
    const maj = (a & b) ^ (a & c) ^ (b & c);
    const t2  = add32(s0, maj);

    const a_new = add32(t1, t2);
    const e_new = add32(d, t1);

    rounds.push({ w: W[i], k: K[i], a, b, c, d, e, f, g, h, s1, ch, t1, s0, maj, t2, a_new, e_new });

    h = g; g = f; f = e; e = e_new;
    d = c; c = b; b = a; a = a_new;
  }

  // ── 4. Final state ───────────────────────────────────────────────────────
  const finalState = [
    add32(h0i, a), add32(h1i, b), add32(h2i, c), add32(h3i, d),
    add32(h4i, e), add32(h5i, f), add32(h6i, g), add32(h7i, h),
  ];

  const hash = finalState
    .map((v) => v.toString(16).padStart(8, "0"))
    .join("");

  return {
    input: message,
    msgLen,
    paddedBytes: padded,
    schedule: W,
    initialState: [...H_INIT],
    rounds,
    finalState,
    hash,
  };
}
