"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { sha256trace, type Sha256Trace } from "@/lib/crypto/sha256trace";
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

// ── Padding tab ───────────────────────────────────────────────────────────────

type ByteKind = "message" | "pad-start" | "zero" | "length";

function byteKind(i: number, msgLen: number): ByteKind {
  if (i < msgLen) return "message";
  if (i === msgLen) return "pad-start";
  if (i < 56) return "zero";
  return "length";
}

const byteStyles: Record<ByteKind, string> = {
  message:   "bg-green/10  text-green  border-green/30  font-semibold",
  "pad-start":"bg-orange/10 text-orange border-orange/30 font-semibold",
  zero:      "bg-bg-soft text-text-secondary/40 border-border",
  length:    "bg-blue/10  text-blue   border-blue/30  font-semibold",
};

function PaddingTab({ trace, t }: { trace: Sha256Trace; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary leading-relaxed">{t("paddingDesc")}</p>
      <div className="rounded-2xl bg-code-bg border border-code-border p-4">
        <div className="grid grid-cols-8 sm:[grid-template-columns:repeat(16,minmax(2rem,1fr))] gap-1">
          {Array.from(trace.paddedBytes).map((byte, i) => {
            const kind = byteKind(i, trace.msgLen);
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
        {t("statsLine", { bytes: trace.msgLen, total: 64 })}
      </p>
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

function ScheduleTab({ trace, t }: { trace: Sha256Trace; t: ReturnType<typeof useTranslations> }) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = useCallback((i: number) => {
    setSelected((prev) => (prev === i ? null : i));
  }, []);

  const sel = selected !== null ? selected : null;
  const selW = sel !== null ? trace.schedule : null;

  // sigma helper labels for the popover
  function expansionValues(i: number) {
    const W = trace.schedule;
    const im2  = i - 2;
    const im7  = i - 7;
    const im15 = i - 15;
    const im16 = i - 16;
    return {
      s1_val: W[im2]  !== undefined ? hex8(W[im2])  : "?",
      w7_val: W[im7]  !== undefined ? hex8(W[im7])  : "?",
      s0_val: W[im15] !== undefined ? hex8(W[im15]) : "?",
      w16_val: W[im16] !== undefined ? hex8(W[im16]) : "?",
      result: hex8(W[i]),
      im2, im7, im15, im16,
    };
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-text-secondary leading-relaxed">{t("scheduleDesc")}</p>

      {/* W[0-15] */}
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">
          {t("scheduleInitLabel")} — W[0]–W[15]
        </p>
        <div className="rounded-2xl bg-code-bg border border-code-border p-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {trace.schedule.slice(0, 16).map((w, i) => {
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
            {trace.schedule.slice(16).map((w, j) => {
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
        {sel !== null && selW && (
          <div className="mt-3 rounded-2xl bg-white border border-purple/30 p-4 space-y-3">
            <p className="text-[10px] font-semibold text-purple uppercase tracking-widest">
              {t("expansionTitle", { i: sel })}
            </p>
            <div className="rounded-xl bg-code-bg border border-code-border px-4 py-3 font-mono text-sm text-code-text overflow-x-auto">
              W[{sel}] = σ1(W[{sel - 2}]) + W[{sel - 7}] + σ0(W[{sel - 15}]) + W[{sel - 16}]
            </div>
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
            <div className="flex items-center justify-between rounded-xl bg-orange/10 border border-orange/30 px-4 py-2.5">
              <span className="font-mono text-sm font-semibold text-text-primary">W[{sel}] =</span>
              <span className="font-mono font-bold text-orange">{hex8(trace.schedule[sel])}</span>
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

function CompressionTab({ trace, t }: { trace: Sha256Trace; t: ReturnType<typeof useTranslations> }) {
  const [round, setRound] = useState(0);
  const r = trace.rounds[round];

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

  return (
    <div className="space-y-5">
      <p className="text-sm text-text-secondary leading-relaxed">{t("hashDesc")}</p>

      {/* 8 final words */}
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">
          {t("hashWordsLabel")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {trace.finalState.map((w, i) => (
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

  // Synchronous — no useEffect needed
  const trace: Sha256Trace = sha256trace(
    input.length > 55 ? input.slice(0, 55) : input
  );

  const tabLabels: Record<Tab, string> = {
    padding:     t("tabPadding"),
    schedule:    t("tabSchedule"),
    compression: t("tabCompression"),
    hash:        t("tabHash"),
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="rounded-3xl overflow-hidden shadow-card border border-border">
        <div className="px-5 py-3 flex items-center justify-between bg-bg-soft">
          <span className="text-xs font-semibold text-text-secondary">{t("inputLabel")}</span>
          <span className="text-xs text-text-secondary font-mono">
            {input.length > 55 ? (
              <span className="text-orange">{t("inputTruncated")}</span>
            ) : (
              <span>{input.length} / 55 {t("chars")}</span>
            )}
          </span>
        </div>
        <div className="bg-white px-5 py-4 space-y-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            spellCheck={false}
            className="w-full bg-bg-soft font-sans text-sm text-text-primary
                       border border-border rounded-2xl px-3.5 py-2.5
                       focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange
                       placeholder:text-text-secondary/50 transition-colors"
          />
          <p className="text-xs text-text-secondary">{t("inputNote")}</p>
        </div>
      </div>

      {/* Tabs */}
      <TabBar active={tab} onChange={setTab} labels={tabLabels} />

      {/* Tab content */}
      <div className="rounded-3xl border border-border bg-white p-5 shadow-card min-h-64">
        {tab === "padding"     && <PaddingTab     trace={trace} t={t} />}
        {tab === "schedule"    && <ScheduleTab    trace={trace} t={t} />}
        {tab === "compression" && <CompressionTab trace={trace} t={t} />}
        {tab === "hash"        && <HashTab        trace={trace} t={t} />}
      </div>
    </div>
  );
}
