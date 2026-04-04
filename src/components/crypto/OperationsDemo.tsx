"use client";

import { useState } from "react";

// ── helpers (8-bit; SHA-256 uses 32-bit) ──────────────────────────────────────

function rotr8(val: number, n: number): number {
  n = ((n % 8) + 8) % 8;
  return n === 0 ? val : (((val >>> n) | (val << (8 - n))) & 0xff);
}

function toBits(val: number, len = 8): number[] {
  return Array.from({ length: len }, (_, i) => (val >> (len - 1 - i)) & 1);
}

// ── primitives ────────────────────────────────────────────────────────────────

function Bit({
  on,
  onClick,
  color = "bg-blue",
  faint = false,
}: {
  on: boolean;
  onClick?: () => void;
  color?: string;
  faint?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={[
        "w-7 h-7 rounded font-mono text-xs font-bold transition-all select-none border",
        on
          ? `${color} text-white border-transparent`
          : "bg-bg-soft text-text-secondary border-border",
        faint ? "opacity-40" : "",
        onClick ? "cursor-pointer hover:opacity-75 active:scale-95" : "cursor-default",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {on ? "1" : "0"}
    </button>
  );
}

function BitRow({
  label,
  val,
  onToggle,
  color,
  hint,
  len = 8,
}: {
  label: string;
  val: number;
  onToggle?: (i: number) => void;
  color?: string;
  hint?: string;
  len?: number;
}) {
  const bits = toBits(val, len);
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 font-mono text-xs text-text-secondary">{label}</span>
      <div className="flex gap-1">
        {bits.map((b, i) => (
          <Bit
            key={i}
            on={b === 1}
            onClick={onToggle ? () => onToggle(i) : undefined}
            color={color}
          />
        ))}
      </div>
      {hint && <span className="text-xs text-text-secondary/60">{hint}</span>}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-px bg-border" />
      <span className="font-mono text-xs text-text-secondary px-1">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function WhyCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-orange-light border-l-4 border-orange px-4 py-3 text-sm text-text-secondary leading-relaxed">
      <span className="font-semibold text-text-primary">Why irreversible: </span>
      {children}
    </div>
  );
}

// ── ROTR ──────────────────────────────────────────────────────────────────────

function RotrDemo() {
  const [val, setVal] = useState(0b10110100);
  const toggle = (i: number) => setVal((v) => v ^ (1 << (7 - i)));

  const r1 = rotr8(val, 1);
  const r3 = rotr8(val, 3);
  const r5 = rotr8(val, 5);
  const sigma = (r1 ^ r3 ^ r5) & 0xff;

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        SHA-256 computes <strong>S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22)</strong>. This 8-bit
        demo uses rotations of 1, 3, and 5 to keep it visual. Click bits to flip them.
      </p>
      <div className="space-y-2">
        <BitRow label="a" val={val} onToggle={toggle} color="bg-blue" hint="← click to flip" />
        <BitRow label="rotr(a, 1)" val={r1} color="bg-purple" />
        <BitRow label="rotr(a, 3)" val={r3} color="bg-purple" />
        <BitRow label="rotr(a, 5)" val={r5} color="bg-purple" />
        <Divider label="XOR all three ↓" />
        <BitRow label="S0 result" val={sigma} color="bg-orange" />
      </div>
      <WhyCard>
        A single rotation is reversible — just rotate back. But SHA-256 XORs three different
        rotations together. Once merged with XOR, you can&apos;t tell which bits came from which
        rotation. Recovering <strong>a</strong> from <strong>S0</strong> requires solving three
        entangled equations simultaneously — there is no algebraic shortcut.
      </WhyCard>
    </div>
  );
}

// ── Ch (Bitwise Choice) ───────────────────────────────────────────────────────

function ChDemo() {
  const [e, setE] = useState(0b11001010);
  const [f, setF] = useState(0b10110101);
  const [g, setG] = useState(0b01001101);

  const ch = ((e & f) ^ (~e & g)) & 0xff;
  const eBits = toBits(e);
  const chBits = toBits(ch);

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        For each bit position: if <strong>e = 1</strong>, copy the bit from <strong>f</strong>. If{" "}
        <strong>e = 0</strong>, copy from <strong>g</strong>. The small label under each output bit
        shows which source was used.
      </p>
      <div className="space-y-2">
        <BitRow
          label="e (selector)"
          val={e}
          onToggle={(i) => setE((v) => v ^ (1 << (7 - i)))}
          color="bg-blue"
          hint="← click to flip"
        />
        <BitRow
          label="f"
          val={f}
          onToggle={(i) => setF((v) => v ^ (1 << (7 - i)))}
          color="bg-purple"
        />
        <BitRow
          label="g"
          val={g}
          onToggle={(i) => setG((v) => v ^ (1 << (7 - i)))}
          color="bg-green"
        />
        <Divider label="Ch = (e & f) ^ (~e & g) ↓" />
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-text-secondary">Ch result</span>
          <div className="flex gap-1">
            {chBits.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <Bit on={b === 1} color={eBits[i] ? "bg-purple" : "bg-green"} />
                <span className="font-mono text-[9px] text-text-secondary">
                  {eBits[i] ? "f" : "g"}
                </span>
              </div>
            ))}
          </div>
          <span className="text-xs text-text-secondary/60">source</span>
        </div>
      </div>
      <WhyCard>
        The selector <strong>e</strong> is not present in the Ch output. Given the result and
        knowing f and g, you cannot recover e — you need e to know which source each bit came
        from, but e is exactly what you&apos;re trying to find. Swapping e and exchanging f/g
        produces the same Ch output from entirely different inputs.
      </WhyCard>
    </div>
  );
}

// ── Modular Addition ──────────────────────────────────────────────────────────

function ModAddDemo() {
  const [a, setA] = useState(200);
  const [b, setB] = useState(180);

  const rawSum = a + b;
  const result = rawSum % 256;
  const overflowed = rawSum >= 256;

  const aBits = toBits(a);
  const bBits = toBits(b);
  const resultBits = toBits(result);
  const carryBit = overflowed ? 1 : 0;

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        SHA-256 uses 32-bit arithmetic (mod 2³²). This demo uses 8-bit (mod 256) so you can see
        the carry bit disappear. Drag the sliders until the sum overflows.
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-text-secondary">a = {a}</span>
          <div className="flex gap-1">
            {aBits.map((bit, i) => (
              <Bit key={i} on={bit === 1} color="bg-blue" />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={255}
            value={a}
            onChange={(e) => setA(+e.target.value)}
            className="w-20 accent-blue"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-text-secondary">b = {b}</span>
          <div className="flex gap-1">
            {bBits.map((bit, i) => (
              <Bit key={i} on={bit === 1} color="bg-purple" />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={255}
            value={b}
            onChange={(e) => setB(+e.target.value)}
            className="w-20 accent-purple"
          />
        </div>
        <Divider label={`(${a} + ${b}) mod 256 ↓`} />
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-text-secondary">
            result = {result}
          </span>
          <div className="flex gap-1 items-center">
            <div className="flex flex-col items-center mr-1">
              <Bit on={carryBit === 1} color="bg-red" faint={!overflowed} />
              <span className="font-mono text-[9px] text-text-secondary mt-0.5">carry</span>
            </div>
            <div className="w-px h-7 bg-border mx-1" />
            {resultBits.map((bit, i) => (
              <Bit key={i} on={bit === 1} color="bg-orange" />
            ))}
          </div>
        </div>
        {overflowed && (
          <div className="flex gap-2 items-start rounded-xl bg-orange-light border border-orange/30 px-3 py-2 text-xs text-text-secondary">
            <span className="shrink-0">⚠️</span>
            <span>
              {a} + {b} = {rawSum}. That&apos;s ≥ 256, so the carry bit (left of divider) is
              discarded and the result wraps to <strong>{result}</strong>.
            </span>
          </div>
        )}
      </div>
      <WhyCard>
        When the sum overflows, the carry bit is permanently gone. Given only the result{" "}
        <strong>{result}</strong>, you cannot reconstruct a or b — ({result}, 0) and (0, {result}){" "}
        both hash to the same value, and so do every overflow pair like ({a}, {b}). SHA-256 chains
        5 modular additions per round across 64 rounds, making the information loss total.
      </WhyCard>
    </div>
  );
}

// ── Majority ──────────────────────────────────────────────────────────────────

function MajDemo() {
  const [a, setA] = useState(0b11001010);
  const [b, setB] = useState(0b10110101);
  const [c, setC] = useState(0b01011011);

  const maj = ((a & b) ^ (a & c) ^ (b & c)) & 0xff;

  const aBits = toBits(a);
  const bBits = toBits(b);
  const cBits = toBits(c);
  const majBits = toBits(maj);

  const votes = aBits.map((ab, i) => ab + bBits[i] + cBits[i]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        Each output bit is <strong>1</strong> when at least 2 of the 3 inputs are{" "}
        <strong>1</strong> — a majority vote. The small number under each result bit shows how many
        inputs voted 1. Click bits to experiment.
      </p>
      <div className="space-y-2">
        <BitRow label="a" val={a} onToggle={(i) => setA((v) => v ^ (1 << (7 - i)))} color="bg-blue" />
        <BitRow label="b" val={b} onToggle={(i) => setB((v) => v ^ (1 << (7 - i)))} color="bg-purple" />
        <BitRow
          label="c"
          val={c}
          onToggle={(i) => setC((v) => v ^ (1 << (7 - i)))}
          color="bg-green"
          hint="← click to flip"
        />
        <Divider label="majority (≥ 2 of 3) ↓" />
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-text-secondary">Maj result</span>
          <div className="flex gap-1">
            {majBits.map((bit, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <Bit on={bit === 1} color="bg-orange" />
                <span className="font-mono text-[9px] text-text-secondary">{votes[i]}/3</span>
              </div>
            ))}
          </div>
          <span className="text-xs text-text-secondary/60">votes</span>
        </div>
      </div>
      <WhyCard>
        When an output bit is <strong>1</strong>, you only know at least 2 of 3 inputs were 1 —
        but not whether it was exactly 2 (three possible combos) or all 3. Each output bit loses
        information about the exact inputs. Across 32 bit positions with three unknown 32-bit
        values, the Maj output leaves far too many valid (a, b, c) combinations to recover.
      </WhyCard>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

const OPS = ["rotr", "ch", "add", "maj"] as const;
type Op = (typeof OPS)[number];

const OP_LABELS: Record<Op, string> = {
  rotr: "ROTR",
  ch: "Ch",
  add: "+ mod",
  maj: "Maj",
};

const OP_FORMULAS: Record<Op, string> = {
  rotr: "S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)",
  ch:  "Ch = (e & f) ^ (~e & g)",
  add: "t1 = (h + S1 + ch + k + w) mod 2³²",
  maj: "Maj = (a & b) ^ (a & c) ^ (b & c)",
};

export function OperationsDemo() {
  const [active, setActive] = useState<Op>("rotr");

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ background: "linear-gradient(90deg, #f0f9ff, #faf5ff)" }}
      >
        <span className="text-base">🔬</span>
        <span className="text-sm font-semibold text-text-primary">Operations Explorer</span>
        <span className="ml-auto text-xs text-text-secondary">8-bit demo · SHA-256 uses 32-bit</span>
      </div>

      {/* tabs */}
      <div className="flex border-b border-border bg-bg-soft">
        {OPS.map((op) => (
          <button
            key={op}
            onClick={() => setActive(op)}
            className={[
              "flex-1 px-3 py-2.5 text-xs font-semibold transition-colors",
              active === op
                ? "text-text-primary border-b-2 border-orange bg-white"
                : "text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            {OP_LABELS[op]}
          </button>
        ))}
      </div>

      {/* formula bar */}
      <div className="bg-code-bg px-5 py-2.5 font-mono text-xs text-code-text border-b border-code-border">
        {OP_FORMULAS[active]}
      </div>

      {/* content */}
      <div className="bg-white px-5 py-5">
        {active === "rotr" && <RotrDemo />}
        {active === "ch" && <ChDemo />}
        {active === "add" && <ModAddDemo />}
        {active === "maj" && <MajDemo />}
      </div>
    </div>
  );
}
