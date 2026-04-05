"use client";

import { cn } from "@/lib/utils/cn";

// ── helpers ──────────────────────────────────────────────────────────────────

function rotr(x: number, n: number): number {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}
function sigma1(x: number): number {
  return (rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10)) >>> 0;
}
function hex8(n: number): string {
  return "0x" + n.toString(16).padStart(8, "0").toUpperCase();
}

// ── pre-computed constants for "abc" ─────────────────────────────────────────

const W_INITIAL: number[] = [
  0x61626380, // W[0]:  'a','b','c', 0x80
  0x00000000, // W[1]
  0x00000000, // W[2]
  0x00000000, // W[3]
  0x00000000, // W[4]
  0x00000000, // W[5]
  0x00000000, // W[6]
  0x00000000, // W[7]
  0x00000000, // W[8]
  0x00000000, // W[9]
  0x00000000, // W[10]
  0x00000000, // W[11]
  0x00000000, // W[12]
  0x00000000, // W[13]
  0x00000000, // W[14]
  0x00000018, // W[15]: message length = 24 bits
];

// W[17] = σ1(W[15]) + W[10] + σ0(W[2]) + W[1]
// W[10], W[2], W[1] are all zero, so W[17] = σ1(W[15]) cleanly.
const S1_ROTR17 = rotr(0x00000018, 17); // 0x000C0000
const S1_ROTR19 = rotr(0x00000018, 19); // 0x00030000
const S1_SHR10  = 0x00000018 >>> 10;    // 0x00000000
const S1_RESULT = sigma1(0x00000018);   // 0x000F0000
const W17       = S1_RESULT;            // 0x000F0000

// ── sub-components ────────────────────────────────────────────────────────────

function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide mb-2">
      {children}
    </p>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function MessageScheduleDemo() {
  return (
    <div className="space-y-3">
      {/* ── Panel A: 16-word grid ── */}
      <div className="rounded-2xl bg-code-bg border border-code-border p-4">
        <PanelHeader>W[0] – W[15] · &quot;abc&quot; padded</PanelHeader>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {W_INITIAL.map((word, i) => {
            const color =
              i === 0
                ? "bg-orange/10 text-orange border-orange/30"
                : i === 15
                ? "bg-blue/10 text-blue border-blue/30"
                : "bg-bg-soft text-text-secondary/50 border-border";
            return (
              <div
                key={i}
                className={cn(
                  "h-16 flex flex-col items-center justify-center gap-0.5 rounded-xl border px-1",
                  color
                )}
              >
                <span className="text-[9px] font-semibold uppercase tracking-wide opacity-60">
                  W[{i}]
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] font-bold leading-tight">
                  {hex8(word)}
                </span>
              </div>
            );
          })}
        </div>

        {/* legend */}
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { color: "bg-orange/10 border-orange/30", label: "Message data (W[0])" },
            { color: "bg-bg-soft border-border",      label: "Zero padding (W[1]–W[14])" },
            { color: "bg-blue/10 border-blue/30",     label: "Length (W[15])" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded border shrink-0", color)} />
              <span className="text-xs text-text-secondary">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel B: expansion trace for W[17] ── */}
      <div className="rounded-2xl bg-code-bg border border-code-border p-4 space-y-4">
        <PanelHeader>Expansion trace · computing W[17]</PanelHeader>

        {/* B-1: formula */}
        <div className="rounded-xl bg-white border border-border px-4 py-3 font-mono text-sm text-code-text overflow-x-auto">
          W[17] = σ1(W[15]) + W[10] + σ0(W[2]) + W[1]
        </div>

        {/* B-2: four inputs */}
        <div>
          <SectionLabel>Inputs</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { term: "σ1(W[15])", value: S1_RESULT, color: "bg-purple/10 border-purple/30 text-purple" },
              { term: "W[10]",     value: 0,          color: "bg-bg-soft border-border text-text-secondary" },
              { term: "σ0(W[2])",  value: 0,          color: "bg-bg-soft border-border text-text-secondary" },
              { term: "W[1]",      value: 0,          color: "bg-bg-soft border-border text-text-secondary" },
            ].map(({ term, value, color }) => (
              <div
                key={term}
                className={cn(
                  "rounded-xl border px-3 py-2.5 flex flex-col gap-0.5",
                  color
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                  {term}
                </span>
                <span className="font-mono text-sm font-bold">{hex8(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* B-3: σ1(W[15]) breakdown */}
        <div>
          <SectionLabel>How σ1(0x00000018) is computed</SectionLabel>
          <div className="space-y-1.5">
            {[
              { op: "rotr(x, 17)", value: S1_ROTR17 },
              { op: "rotr(x, 19)", value: S1_ROTR19 },
              { op: "shr(x, 10)",  value: S1_SHR10  },
            ].map(({ op, value }) => (
              <div
                key={op}
                className="flex items-center gap-3 rounded-lg bg-white border border-border px-3 py-2"
              >
                <span className="font-mono text-[11px] text-text-secondary w-28 shrink-0">
                  {op}
                </span>
                <span className="font-mono text-sm font-bold text-purple">
                  {hex8(value)}
                </span>
              </div>
            ))}
            {/* XOR result */}
            <div className="flex items-center gap-3 rounded-lg bg-purple/10 border border-purple/30 px-3 py-2">
              <span className="font-mono text-[11px] text-text-secondary w-28 shrink-0">
                XOR all three →
              </span>
              <span className="font-mono text-sm font-bold text-purple">
                {hex8(S1_RESULT)}
              </span>
            </div>
          </div>
        </div>

        {/* B-4: final result */}
        <div className="flex items-center justify-between rounded-xl bg-orange/10 border border-orange/30 px-4 py-3">
          <span className="text-sm font-semibold text-text-primary font-mono">
            W[17] = σ1(W[15]) + 0 + 0 + 0
          </span>
          <span className="font-mono font-bold text-orange text-base ml-4">
            {hex8(W17)}
          </span>
        </div>
      </div>
    </div>
  );
}
