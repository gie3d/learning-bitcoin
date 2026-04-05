"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { sha256trace, type Sha256Trace, type Sha256BlockTrace } from "@/lib/crypto/sha256trace";
import { cn } from "@/lib/utils/cn";

// ── helpers ──────────────────────────────────────────────────────────────────

function hex8(n: number): string {
  return "0x" + n.toString(16).padStart(8, "0").toUpperCase();
}
function hex2(n: number): string {
  return n.toString(16).padStart(2, "0");
}

type Tab = "padding" | "schedule" | "compression" | "hash";

// ── Tab bar ───────────────────────────────────────────────────────────────────

function TabBar({
  active,
  onChange,
  labels,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  labels: Record<Tab, string>;
}) {
  const tabs: Tab[] = ["padding", "schedule", "compression", "hash"];
  return (
    <div className="flex gap-1 rounded-2xl bg-bg-soft border border-border p-1">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "flex-1 rounded-xl px-2 py-2 text-xs font-semibold transition-colors",
            active === t
              ? "bg-white text-text-primary shadow-card"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          {labels[t]}
        </button>
      ))}
    </div>
  );
}

// ── Block picker ──────────────────────────────────────────────────────────────

function BlockPicker({
  numBlocks,
  selected,
  onChange,
  label,
}: {
  numBlocks: number;
  selected: number;
  onChange: (b: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide shrink-0">
        {label}:
      </span>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: numBlocks }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-bold transition-colors",
              selected === i
                ? "bg-orange text-white"
                : "bg-bg-soft text-text-secondary border border-border hover:text-text-primary"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Hash bar ──────────────────────────────────────────────────────────────────

function HashBar({ hash, label }: { hash: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      <div className="flex items-center gap-3 bg-code-bg px-4 py-3">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest shrink-0">
          {label}
        </span>
        <p className="font-mono text-xs text-blue break-all leading-relaxed flex-1 min-w-0">
          {hash}
        </p>
        <button
          onClick={copy}
          className="text-[10px] font-semibold text-orange hover:text-orange/70 transition-colors shrink-0"
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ── Padding tab ───────────────────────────────────────────────────────────────

type ByteKind = "message" | "pad-start" | "zero" | "length";

const byteStyles: Record<ByteKind, string> = {
  message:    "bg-green/10  text-green  border-green/30  font-semibold",
  "pad-start":"bg-orange/10 text-orange border-orange/30 font-semibold",
  zero:       "bg-bg-soft text-text-secondary/40 border-border",
  length:     "bg-blue/10  text-blue   border-blue/30  font-semibold",
};

function PaddingTab({
  trace,
  blockTrace,
  t,
}: {
  trace: Sha256Trace;
  blockTrace: Sha256BlockTrace;
  t: ReturnType<typeof useTranslations>;
}) {
  const msgLen = trace.msgLen;
  const totalPaddedLen = trace.allPaddedBytes.length;
  const blockStart = blockTrace.blockIndex * 64;
  const isLastBlock = blockTrace.blockIndex === trace.numBlocks - 1;

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary leading-relaxed">{t("paddingDesc")}</p>
      <div className="rounded-2xl bg-code-bg border border-code-border p-4">
        <div className="grid grid-cols-8 sm:[grid-template-columns:repeat(16,minmax(2rem,1fr))] gap-1">
          {Array.from(blockTrace.paddedBytes).map((byte, i) => {
            const globalIndex = blockStart + i;
            let kind: ByteKind;
            if (globalIndex < msgLen) kind = "message";
            else if (globalIndex === msgLen) kind = "pad-start";
            else if (isLastBlock && i >= 56) kind = "length";
            else kind = "zero";

            return (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-center rounded-md border text-[10px] font-mono h-7",
                  byteStyles[kind]
                )}
                title={kind === "message" ? `'${String.fromCharCode(byte)}'` : kind}
              >
                {hex2(byte)}
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(
          [
            { kind: "message",   label: t("legendMessage") },
            { kind: "pad-start", label: t("legendPadStart") },
            { kind: "zero",      label: t("legendZero") },
            { kind: "length",    label: t("legendLength") },
          ] as { kind: ByteKind; label: string }[]
        ).map(({ kind, label }) => (
          <div key={kind} className="flex items-center gap-1.5">
            <div className={cn("w-3 h-3 rounded border", byteStyles[kind])} />
            <span className="text-xs text-text-secondary">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs font-mono text-text-secondary bg-bg-soft rounded-xl px-3 py-2">
        {t("statsLine", { bytes: msgLen, total: totalPaddedLen, blocks: trace.numBlocks })}
      </p>
    </div>
  );
}

// ── 8-bit ops demo primitives ─────────────────────────────────────────────────

function rotr8(val: number, n: number): number {
  n = ((n % 8) + 8) % 8;
  return n === 0 ? val : (((val >>> n) | (val << (8 - n))) & 0xff);
}
function toBits8(val: number): number[] {
  return Array.from({ length: 8 }, (_, i) => (val >> (7 - i)) & 1);
}

function Bit8({
  on,
  onClick,
  color = "bg-blue",
}: {
  on: boolean;
  onClick?: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "w-6 h-6 rounded-md font-mono text-[10px] font-bold transition-all select-none border",
        on ? `${color} text-white border-transparent` : "bg-bg-soft text-text-secondary border-border",
        onClick ? "cursor-pointer hover:opacity-75 active:scale-95" : "cursor-default"
      )}
    >
      {on ? "1" : "0"}
    </button>
  );
}

function BitRow8({
  label,
  val,
  onToggle,
  color,
  hint,
  dropped,
}: {
  label: string;
  val: number;
  onToggle?: (i: number) => void;
  color?: string;
  hint?: string;
  dropped?: boolean[];  // marks bits that were shifted off
}) {
  const bits = toBits8(val);
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 font-mono text-[10px] text-text-secondary">{label}</span>
      <div className="flex gap-1">
        {bits.map((b, i) => (
          <Bit8
            key={i}
            on={b === 1}
            onClick={onToggle ? () => onToggle(i) : undefined}
            color={dropped?.[i] ? "bg-text-secondary/30" : color}
          />
        ))}
      </div>
      {hint && <span className="text-[10px] text-text-secondary/60 italic">{hint}</span>}
    </div>
  );
}

function OpdivDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="flex-1 h-px bg-border" />
      <span className="font-mono text-[10px] text-text-secondary">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ── ROTR 8-bit demo ───────────────────────────────────────────────────────────

function RotrDemo8() {
  const [val, setVal] = useState(0b01100100);
  const [n, setN] = useState(3);
  const [animStep, setAnimStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (animStep >= n) { setPlaying(false); return; }
    const timer = setTimeout(() => setAnimStep((s) => s + 1), 500);
    return () => clearTimeout(timer);
  }, [playing, animStep, n]);

  const toggle = (i: number) => {
    setVal((v) => v ^ (1 << (7 - i)));
    setAnimStep(0);
    setPlaying(false);
  };

  const currentAnimVal = rotr8(val, animStep);
  const result = rotr8(val, n);
  const animBits = toBits8(currentAnimVal);

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-text-secondary leading-relaxed">
        Bits are shifted right by <strong>n</strong> positions. Bits that fall off the right end wrap back to the left.
        Click bits to flip. Use the slider to change rotation amount.
      </p>

      <div className="space-y-2">
        <BitRow8 label="x (input)" val={val} onToggle={toggle} color="bg-blue" hint="← click to flip" />
        <BitRow8 label={`rotr(x, ${n})`} val={result} color="bg-purple" />
      </div>

      {/* Amount slider */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-text-secondary w-28 shrink-0">rotation n =</span>
        <input
          type="range" min={1} max={7} value={n}
          onChange={(e) => { setN(+e.target.value); setAnimStep(0); setPlaying(false); }}
          className="flex-1 accent-purple"
        />
        <span className="font-mono text-xs font-bold text-purple w-4">{n}</span>
      </div>

      {/* Animated step visualizer */}
      <div className="rounded-xl bg-bg-soft border border-border/60 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            Step-by-step — {animStep}/{n}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                if (animStep >= n) setAnimStep(0);
                setPlaying((p) => !p);
              }}
              className="h-6 px-2.5 text-[10px] font-bold rounded-lg bg-orange text-white hover:opacity-90 active:scale-95 transition-all"
            >
              {playing ? "Pause" : animStep >= n ? "Reset" : "Play"}
            </button>
            <button
              onClick={() => { setAnimStep(0); setPlaying(false); }}
              className="h-6 px-2.5 text-[10px] font-bold rounded-lg border border-border text-text-secondary hover:bg-white active:scale-95 transition-all"
            >
              ↺
            </button>
          </div>
        </div>
        <div className="flex gap-1 justify-center">
          {animBits.map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Bit8 on={b === 1} color="bg-purple" />
              <span className="text-[8px] font-mono text-text-secondary/40">{i}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-center font-mono text-text-secondary/60">
          {animStep === 0
            ? "Press Play to animate one step at a time"
            : animStep < n
            ? `Rotated ${animStep} of ${n} — bits wrap from right to left`
            : `Done — ${n} rotation${n > 1 ? "s" : ""} applied`}
        </p>
      </div>
    </div>
  );
}

// ── SHR 8-bit demo ────────────────────────────────────────────────────────────

function ShrDemo8() {
  const [val, setVal] = useState(0b11001010);
  const [n, setN] = useState(3);

  const toggle = (i: number) => setVal((v) => v ^ (1 << (7 - i)));
  const result = (val >>> n) & 0xff;

  // Which bits of the *input* were shifted off (rightmost n bits)
  const droppedInput: boolean[] = toBits8(val).map((_, i) => i >= 8 - n);
  // Which bits of the *result* are the filled zeros (leftmost n bits)
  const filledZero: boolean[] = toBits8(result).map((_, i) => i < n);

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-text-secondary leading-relaxed">
        Bits are shifted right by <strong>n</strong> positions. Bits that fall off the right edge are
        <span className="font-bold text-red-500"> permanently lost</span>. Zeros fill in from the left — unlike ROTR, nothing wraps.
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-28 shrink-0 font-mono text-[10px] text-text-secondary">x (input)</span>
          <div className="flex gap-1">
            {toBits8(val).map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <Bit8 on={b === 1} onClick={() => toggle(i)} color={droppedInput[i] ? "bg-text-secondary/40" : "bg-blue"} />
                {droppedInput[i] && <span className="text-[8px] text-red-400 font-bold">✕</span>}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-text-secondary/60 italic">← click to flip</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-28 shrink-0 font-mono text-[10px] text-text-secondary">{`shr(x, ${n})`}</span>
          <div className="flex gap-1">
            {toBits8(result).map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <Bit8 on={b === 1} color={filledZero[i] ? "bg-bg-soft" : "bg-purple"} />
                {filledZero[i] && <span className="text-[8px] text-text-secondary/40 font-bold">0</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amount slider */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-text-secondary w-28 shrink-0">shift n =</span>
        <input
          type="range" min={1} max={7} value={n}
          onChange={(e) => setN(+e.target.value)}
          className="flex-1 accent-purple"
        />
        <span className="font-mono text-xs font-bold text-purple w-4">{n}</span>
      </div>

      <div className="rounded-xl bg-orange/5 border border-orange/20 px-3 py-2 text-[11px] text-text-secondary">
        <span className="font-semibold text-text-primary">Why irreversible: </span>
        The {n} rightmost bit{n > 1 ? "s" : ""} are gone. Given only the result, you cannot recover what those bit{n > 1 ? "s were" : " was"}.
      </div>
    </div>
  );
}

// ── XOR 8-bit demo ────────────────────────────────────────────────────────────

function XorDemo8() {
  const [a, setA] = useState(0b11001010);
  const [b, setB] = useState(0b01110011);

  const result = (a ^ b) & 0xff;
  const aBits = toBits8(a);
  const bBits = toBits8(b);
  const rBits = toBits8(result);

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-text-secondary leading-relaxed">
        XOR outputs <strong>1</strong> when the two input bits differ, <strong>0</strong> when they match.
        The result bit is colored by which input is "dominant" — but since both are equal contributors, you cannot recover either input from the result alone.
      </p>

      <div className="space-y-2">
        <BitRow8 label="a" val={a} onToggle={(i) => setA((v) => v ^ (1 << (7 - i)))} color="bg-blue" hint="← click to flip" />
        <BitRow8 label="b" val={b} onToggle={(i) => setB((v) => v ^ (1 << (7 - i)))} color="bg-purple" />
        <OpdivDivider label="a ^ b ↓" />
        <div className="flex items-center gap-2">
          <span className="w-28 shrink-0 font-mono text-[10px] text-text-secondary">result</span>
          <div className="flex gap-1">
            {rBits.map((bit, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <Bit8
                  on={bit === 1}
                  color={aBits[i] !== bBits[i] ? "bg-orange" : "bg-bg-soft"}
                />
                <span className="font-mono text-[8px] text-text-secondary/50">
                  {aBits[i] !== bBits[i] ? "≠" : "="}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-orange/5 border border-orange/20 px-3 py-2 text-[11px] text-text-secondary">
        <span className="font-semibold text-text-primary">Why irreversible: </span>
        Given result bit = 1, you know a ≠ b — but you don{"'"}t know if a=0,b=1 or a=1,b=0. Both inputs are equally valid; the XOR destroys which was which.
      </div>
    </div>
  );
}

// ── σ0/σ1 explainer with embedded demos ──────────────────────────────────────

type OpsTab = "rotr" | "shr" | "xor";

function SigmaExplainer({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [activeOp, setActiveOp] = useState<OpsTab>("rotr");
  const ops: OpsTab[] = ["rotr", "shr", "xor"];
  const opLabels: Record<OpsTab, string> = { rotr: "ROTR", shr: "SHR", xor: "XOR" };

  return (
    <div className="rounded-2xl border border-purple/20 bg-purple/5 p-4 space-y-4">
      {/* Title + description */}
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-purple">{t("sigmaExplainerTitle")}</p>
        <p className="text-xs text-text-secondary leading-relaxed">{t("sigmaExplainerDesc")}</p>
      </div>

      {/* Formula cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          { formula: t("sigma0Formula"), applied: t("sigma0AppliedTo") },
          { formula: t("sigma1Formula"), applied: t("sigma1AppliedTo") },
        ].map(({ formula, applied }) => (
          <div key={formula} className="rounded-xl bg-code-bg border border-code-border px-3 py-2.5 space-y-1">
            <p className="font-mono text-[11px] text-code-text">{formula}</p>
            <p className="text-[10px] text-text-secondary italic">{applied}</p>
          </div>
        ))}
      </div>

      {/* Operation demos */}
      <div className="space-y-3 pt-1 border-t border-purple/15">
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
          8-bit interactive demos
        </p>
        {/* Op tab bar */}
        <div className="flex gap-1 rounded-xl bg-white/60 border border-purple/15 p-0.5">
          {ops.map((op) => (
            <button
              key={op}
              onClick={() => setActiveOp(op)}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-[11px] font-bold transition-colors",
                activeOp === op
                  ? "bg-purple text-white shadow-sm"
                  : "text-text-secondary hover:text-purple"
              )}
            >
              {opLabels[op]}
            </button>
          ))}
        </div>
        {/* Demo content */}
        <div className="bg-white rounded-xl border border-purple/15 px-4 py-3">
          {activeOp === "rotr" && <RotrDemo8 />}
          {activeOp === "shr"  && <ShrDemo8 />}
          {activeOp === "xor"  && <XorDemo8 />}
        </div>
      </div>
    </div>
  );
}

// ── σ0/σ1 popover steps (used inside expansion popover) ───────────────────────

function SigmaSteps({
  fn,
  wordIndex,
  value,
  t,
}: {
  fn: "σ0" | "σ1";
  wordIndex: number;
  value: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const isSigma0 = fn === "σ0";
  const [r1, r2, shift] = isSigma0 ? [7, 18, 3] : [17, 19, 10];

  const rot1   = (((value >>> r1)    | (value << (32 - r1)))    >>> 0);
  const rot2   = (((value >>> r2)    | (value << (32 - r2)))    >>> 0);
  const shrVal = (value >>> shift) >>> 0;
  const result = (rot1 ^ rot2 ^ shrVal) >>> 0;

  const steps = [
    { label: `rotr(W[${wordIndex}], ${r1})`,  value: rot1,   color: "text-purple" },
    { label: `rotr(W[${wordIndex}], ${r2})`,  value: rot2,   color: "text-purple" },
    { label: `shr(W[${wordIndex}], ${shift})`, value: shrVal, color: "text-blue" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest">
        {t("sigmaStepsLabel", { fn, i: wordIndex })}
      </p>
      <div className="space-y-1">
        {steps.map(({ label, value: v, color }) => (
          <div key={label} className="flex items-center justify-between rounded-lg bg-bg-soft border border-border px-3 py-1.5">
            <span className={cn("font-mono text-[11px]", color)}>{label}</span>
            <span className="font-mono text-[11px] font-bold text-text-primary">{hex8(v)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-lg bg-orange/10 border border-orange/30 px-3 py-1.5">
          <span className="font-mono text-[11px] font-bold text-orange">{t("sigmaXorResult")}</span>
          <span className="font-mono text-[11px] font-bold text-orange">{hex8(result)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Schedule tab ──────────────────────────────────────────────────────────────

function WordCard({
  index,
  value,
  color,
  onClick,
  selected,
}: {
  index: number;
  value: number;
  color: string;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "h-16 flex flex-col items-center justify-center gap-0.5 rounded-xl border px-1 transition-all",
        color,
        onClick && "cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5",
        selected && "ring-2 ring-purple ring-offset-1"
      )}
    >
      <span className="text-[9px] font-semibold uppercase tracking-wide opacity-60">
        W[{index}]
      </span>
      <span className="font-mono text-[10px] sm:text-[11px] font-bold leading-tight break-all text-center">
        {hex8(value)}
      </span>
    </div>
  );
}

function ScheduleTab({
  blockTrace,
  t,
}: {
  blockTrace: Sha256BlockTrace;
  t: ReturnType<typeof useTranslations>;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = useCallback((i: number) => {
    setSelected((prev) => (prev === i ? null : i));
  }, []);

  const W = blockTrace.schedule;
  const sel = selected;

  function expansionValues(i: number) {
    const im2  = i - 2;
    const im7  = i - 7;
    const im15 = i - 15;
    const im16 = i - 16;
    return {
      s1_val:  W[im2]  !== undefined ? hex8(W[im2])  : "?",
      w7_val:  W[im7]  !== undefined ? hex8(W[im7])  : "?",
      s0_val:  W[im15] !== undefined ? hex8(W[im15]) : "?",
      w16_val: W[im16] !== undefined ? hex8(W[im16]) : "?",
      result:  hex8(W[i]),
      im2, im7, im15, im16,
    };
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-text-secondary leading-relaxed">{t("scheduleDesc")}</p>

      {/* σ0/σ1 explainer with interactive demos */}
      <SigmaExplainer t={t} />

      {/* W[0-15] */}
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">
          {t("scheduleInitLabel")} — W[0]–W[15]
        </p>
        <div className="rounded-2xl bg-code-bg border border-code-border p-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {W.slice(0, 16).map((w, i) => {
              const color =
                w !== 0 && i < 15
                  ? "bg-orange/10 text-orange border-orange/30"
                  : i === 15
                  ? "bg-blue/10 text-blue border-blue/30"
                  : "bg-bg-soft text-text-secondary/40 border-border";
              return <WordCard key={i} index={i} value={w} color={color} />;
            })}
          </div>
        </div>
      </div>

      {/* W[16-63] */}
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">
          {t("scheduleGenLabel")} — W[16]–W[63]
          <span className="ml-2 normal-case font-normal">{t("scheduleClickHint")}</span>
        </p>
        <div className="rounded-2xl bg-code-bg border border-code-border p-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {W.slice(16).map((w, j) => {
              const i = j + 16;
              return (
                <WordCard
                  key={i}
                  index={i}
                  value={w}
                  color={
                    sel === i
                      ? "bg-purple/20 text-purple border-purple/50"
                      : "bg-purple/10 text-purple border-purple/30"
                  }
                  selected={sel === i}
                  onClick={() => handleClick(i)}
                />
              );
            })}
          </div>
        </div>

        {/* Expansion popover */}
        {sel !== null && (
          <div className="mt-3 rounded-2xl bg-white border border-purple/30 p-4 space-y-4">
            <p className="text-[10px] font-semibold text-purple uppercase tracking-widest">
              {t("expansionTitle", { i: sel })}
            </p>
            {/* Formula */}
            <div className="rounded-xl bg-code-bg border border-code-border px-4 py-3 font-mono text-sm text-code-text overflow-x-auto">
              W[{sel}] = σ1(W[{sel - 2}]) + W[{sel - 7}] + σ0(W[{sel - 15}]) + W[{sel - 16}]
            </div>
            {/* Values grid */}
            {(() => {
              const { s1_val, w7_val, s0_val, w16_val, result, im2, im7, im15, im16 } = expansionValues(sel);
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  {[
                    { label: `σ1(W[${im2}])`,  value: s1_val,  color: "text-purple bg-purple/10 border-purple/30" },
                    { label: `W[${im7}]`,       value: w7_val,  color: "text-text-secondary bg-bg-soft border-border" },
                    { label: `σ0(W[${im15}])`, value: s0_val,  color: "text-text-secondary bg-bg-soft border-border" },
                    { label: `W[${im16}]`,      value: w16_val, color: "text-text-secondary bg-bg-soft border-border" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={cn("rounded-xl border px-3 py-2 flex flex-col gap-0.5", color)}>
                      <span className="text-[10px] opacity-70 uppercase tracking-wide">{label}</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
            {/* Result */}
            <div className="flex items-center justify-between rounded-xl bg-orange/10 border border-orange/30 px-4 py-2.5">
              <span className="font-mono text-sm font-semibold text-text-primary">W[{sel}] =</span>
              <span className="font-mono font-bold text-orange">{hex8(W[sel])}</span>
            </div>

            {/* σ0/σ1 step-by-step breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-border">
              {W[sel - 15] !== undefined && (
                <SigmaSteps fn="σ0" wordIndex={sel - 15} value={W[sel - 15]} t={t} />
              )}
              {W[sel - 2] !== undefined && (
                <SigmaSteps fn="σ1" wordIndex={sel - 2} value={W[sel - 2]} t={t} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Compression tab ───────────────────────────────────────────────────────────

const VAR_COLORS: Record<string, string> = {
  a: "bg-orange/10 text-orange border-orange/30",
  b: "bg-purple/10 text-purple border-purple/30",
  c: "bg-blue/10   text-blue   border-blue/30",
  d: "bg-bg-soft   text-text-secondary border-border",
  e: "bg-orange/10 text-orange border-orange/30",
  f: "bg-purple/10 text-purple border-purple/30",
  g: "bg-blue/10   text-blue   border-blue/30",
  h: "bg-bg-soft   text-text-secondary border-border",
};

function CompressionTab({
  blockTrace,
  t,
}: {
  blockTrace: Sha256BlockTrace;
  t: ReturnType<typeof useTranslations>;
}) {
  const [round, setRound] = useState(0);
  const r = blockTrace.rounds[round];

  const vars: [string, number][] = [
    ["a", r.a], ["b", r.b], ["c", r.c], ["d", r.d],
    ["e", r.e], ["f", r.f], ["g", r.g], ["h", r.h],
  ];

  const ops = [
    { label: "S1",  formula: `rot(e,6) ^ rot(e,11) ^ rot(e,25)`, value: r.s1,  color: "text-blue" },
    { label: "Ch",  formula: `(e & f) ^ (~e & g)`,                value: r.ch,  color: "text-purple" },
    { label: "T1",  formula: `h + S1 + Ch + K[${round}] + W[${round}]`, value: r.t1, color: "text-orange" },
    { label: "S0",  formula: `rot(a,2) ^ rot(a,13) ^ rot(a,22)`, value: r.s0,  color: "text-blue" },
    { label: "Maj", formula: `(a & b) ^ (a & c) ^ (b & c)`,       value: r.maj, color: "text-green" },
    { label: "T2",  formula: `S0 + Maj`,                           value: r.t2,  color: "text-orange" },
  ];

  return (
    <div className="space-y-5">
      {/* Round stepper */}
      <div className="rounded-2xl bg-code-bg border border-code-border p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setRound((r) => Math.max(0, r - 1))}
            disabled={round === 0}
            className="rounded-xl border border-border bg-white px-3 py-1.5 text-sm font-semibold text-text-primary disabled:opacity-30 hover:shadow-card transition-all"
          >
            ← {t("prevRound")}
          </button>
          <div className="text-center">
            <div className="text-2xl font-black text-orange font-mono">{round}</div>
            <div className="text-[10px] text-text-secondary uppercase tracking-widest">
              {t("roundLabel")} / 63
            </div>
          </div>
          <button
            onClick={() => setRound((r) => Math.min(63, r + 1))}
            disabled={round === 63}
            className="rounded-xl border border-border bg-white px-3 py-1.5 text-sm font-semibold text-text-primary disabled:opacity-30 hover:shadow-card transition-all"
          >
            {t("nextRound")} →
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={63}
          value={round}
          onChange={(e) => setRound(Number(e.target.value))}
          className="w-full accent-orange"
        />
        <div className="flex justify-between text-[10px] text-text-secondary font-mono mt-1">
          <span>W[{round}] = {hex8(r.w)}</span>
          <span>K[{round}] = {hex8(r.k)}</span>
        </div>
      </div>

      {/* Working variables */}
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">
          {t("workingVarsLabel")}
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {vars.map(([name, val]) => (
            <div
              key={name}
              className={cn(
                "h-16 flex flex-col items-center justify-center gap-0.5 rounded-xl border px-1",
                VAR_COLORS[name]
              )}
            >
              <span className="text-[10px] font-bold uppercase">{name}</span>
              <span className="font-mono text-[10px] sm:text-[11px] font-bold leading-tight break-all text-center">
                {hex8(val)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Operations */}
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">
          {t("opsLabel")}
        </p>
        <div className="space-y-1.5">
          {ops.map(({ label, formula, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl bg-white border border-border px-3 py-2.5"
            >
              <span className={cn("font-mono text-xs font-bold w-8 shrink-0", color)}>
                {label}
              </span>
              <span className="font-mono text-[11px] text-text-secondary flex-1 truncate">
                {formula}
              </span>
              <span className="font-mono text-sm font-bold text-text-primary shrink-0">
                {hex8(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New state */}
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">
          {t("newStateLabel")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center justify-between rounded-xl bg-orange/10 border border-orange/30 px-4 py-2.5">
            <span className="font-mono text-sm font-semibold text-text-primary">a = T1 + T2</span>
            <span className="font-mono font-bold text-orange">{hex8(r.a_new)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-orange/10 border border-orange/30 px-4 py-2.5">
            <span className="font-mono text-sm font-semibold text-text-primary">e = d + T1</span>
            <span className="font-mono font-bold text-orange">{hex8(r.e_new)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hash tab ──────────────────────────────────────────────────────────────────

function HashTab({ trace, t }: { trace: Sha256Trace; t: ReturnType<typeof useTranslations> }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(trace.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordColors = [
    "bg-orange/10 text-orange border-orange/30",
    "bg-purple/10 text-purple border-purple/30",
    "bg-blue/10   text-blue   border-blue/30",
    "bg-green/10  text-green  border-green/30",
  ];

  // Final state is the last block's finalState
  const finalState = trace.blocks[trace.blocks.length - 1].finalState;

  return (
    <div className="space-y-5">
      <p className="text-sm text-text-secondary leading-relaxed">{t("hashDesc")}</p>

      {/* 8 final words */}
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">
          {t("hashWordsLabel")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {finalState.map((w, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border px-3 py-2.5 flex flex-col gap-0.5",
                wordColors[i % 4]
              )}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                H[{i}]
              </span>
              <span className="font-mono text-sm font-bold">{hex8(w)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Concatenated hash */}
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">
          {t("hashLabel")}
        </p>
        <div className="rounded-3xl overflow-hidden border border-border shadow-card">
          <div className="bg-code-bg px-5 py-4">
            <p className="font-mono text-sm text-blue break-all leading-relaxed tracking-wide">
              {trace.hash}
            </p>
          </div>
          <div className="bg-white px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              {t("hashConcat")}
            </span>
            <button
              onClick={copy}
              className="text-xs font-semibold text-orange hover:text-orange/70 transition-colors"
            >
              {copied ? t("copiedBtn") : t("copyBtn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function Sha256Visualizer() {
  const t = useTranslations("sha256Visualizer");

  const [input, setInput] = useState("abc");
  const [tab, setTab] = useState<Tab>("padding");
  const [selectedBlock, setSelectedBlock] = useState(0);

  // Synchronous trace — sha256trace handles any length
  const trace: Sha256Trace = sha256trace(input);

  // Clamp selected block index when numBlocks changes
  const blockIndex = Math.min(selectedBlock, trace.numBlocks - 1);
  const blockTrace = trace.blocks[blockIndex];

  const tabLabels: Record<Tab, string> = {
    padding:     t("tabPadding"),
    schedule:    t("tabSchedule"),
    compression: t("tabCompression"),
    hash:        t("tabHash"),
  };

  const msgLen = new TextEncoder().encode(input).length;

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="rounded-3xl overflow-hidden shadow-card border border-border">
        <div className="px-5 py-3 flex items-center justify-between bg-bg-soft">
          <span className="text-xs font-semibold text-text-secondary">{t("inputLabel")}</span>
          <span className="text-xs text-text-secondary font-mono">
            {t("inputCounter", { bytes: msgLen, blocks: trace.numBlocks })}
          </span>
        </div>
        <div className="bg-white px-5 py-4 space-y-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSelectedBlock(0);
            }}
            placeholder={t("inputPlaceholder")}
            spellCheck={false}
            className="w-full bg-bg-soft font-sans text-sm text-text-primary
                       border border-border rounded-2xl px-3.5 py-2.5
                       focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange
                       placeholder:text-text-secondary/50 transition-colors"
          />
          <p className="text-xs text-text-secondary">{t("inputNote")}</p>
        </div>
        {/* Hash bar — always visible */}
        <HashBar hash={trace.hash} label={t("hashBarLabel")} />
      </div>

      {/* Block picker — only shown for multi-block */}
      {trace.numBlocks > 1 && (
        <BlockPicker
          numBlocks={trace.numBlocks}
          selected={blockIndex}
          onChange={setSelectedBlock}
          label={t("blockPickerLabel")}
        />
      )}

      {/* Tabs */}
      <TabBar active={tab} onChange={setTab} labels={tabLabels} />

      {/* Tab content */}
      <div className="rounded-3xl border border-border bg-white p-5 shadow-card min-h-64">
        {tab === "padding"     && <PaddingTab     trace={trace} blockTrace={blockTrace} t={t} />}
        {tab === "schedule"    && <ScheduleTab    blockTrace={blockTrace} t={t} />}
        {tab === "compression" && <CompressionTab blockTrace={blockTrace} t={t} />}
        {tab === "hash"        && <HashTab        trace={trace} t={t} />}
      </div>
    </div>
  );
}
