"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";


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
        "w-6 h-6 sm:w-7 sm:h-7 rounded-md font-mono text-[10px] sm:text-xs font-bold transition-all select-none border",
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
  faint = false,
}: {
  label: string;
  val: number;
  onToggle?: (i: number) => void;
  color?: string;
  hint?: string;
  len?: number;
  faint?: boolean;
}) {
  const bits = toBits(val, len);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
      <span className="w-full sm:w-24 shrink-0 font-mono text-[10px] sm:text-xs text-text-secondary uppercase tracking-wider sm:normal-case">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {bits.map((b, i) => (
            <Bit
              key={i}
              on={b === 1}
              onClick={onToggle ? () => onToggle(i) : undefined}
              color={color}
              faint={faint}
            />
          ))}
        </div>
        {hint && <span className="text-[10px] sm:text-xs text-text-secondary/60 italic sm:not-italic">{hint}</span>}
      </div>
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
  const t = useTranslations("operations");
  return (
    <div className="rounded-2xl bg-orange-light border-l-4 border-orange px-4 py-3 text-sm text-text-secondary leading-relaxed">
      <span className="font-semibold text-text-primary">{t("whyIrreversible")}: </span>
      {children}
    </div>
  );
}

function RotrVisualizer({ val, n, color }: { val: number; n: number; color: string }) {
  const t = useTranslations("operations");
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && step < n) {
      timer = setTimeout(() => {
        setStep((s) => s + 1);
      }, 600);
    } else if (step >= n) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, n]);

  const currentVal = rotr8(val, step);
  const bits = toBits(currentVal);

  return (
    <div className="mt-4 p-4 rounded-2xl bg-bg-soft border border-border/60 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
          <h4 className="text-[10px] font-bold text-text-primary uppercase tracking-widest">
            {t("visualize")} (rotr {step}/{n})
          </h4>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              if (step >= n) setStep(0);
              setIsPlaying(!isPlaying);
            }}
            className="h-7 px-3 text-[10px] font-bold rounded-lg bg-orange text-white hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
          >
            {isPlaying ? (
              <>
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-2 bg-white" />
                  <div className="w-0.5 h-2 bg-white" />
                </div>
                {t("pause")}
              </>
            ) : (
              <>
                <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white" />
                {step >= n ? t("reset") : t("play")}
              </>
            )}
          </button>
          <button
            onClick={() => {
              setStep(0);
              setIsPlaying(false);
            }}
            className="h-7 px-3 text-[10px] font-bold rounded-lg border border-border text-text-secondary hover:bg-white active:scale-95 transition-all"
          >
            {t("reset")}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1 p-2 bg-white rounded-xl shadow-sm border border-border/40 relative overflow-hidden">
          {bits.map((b, i) => {
            // Visualize the "wrap around" on the last bit
            const isLatestSource = step > 0 && i === 0;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`transition-all duration-300 ${
                    isLatestSource && isPlaying ? "scale-110" : ""
                  }`}
                >
                  <Bit on={b === 1} color={color} />
                </div>
                <span className="text-[8px] font-mono text-text-secondary/40">{i}</span>
              </div>
            );
          })}
        </div>
        <div className="text-[10px] text-text-secondary/70 font-mono">
          {t("animationStep", { step, total: n })}
        </div>
      </div>
    </div>
  );
}

// ── ROTR ──────────────────────────────────────────────────────────────────────

function RotrDemo() {
  const t = useTranslations("operations");
  const [val, setVal] = useState(0b01000000); // Changed default as per user request
  const toggle = (i: number) => setVal((v) => v ^ (1 << (7 - i)));

  const r1 = rotr8(val, 1);
  const r3 = rotr8(val, 3);
  const r5 = rotr8(val, 5);
  const sigma = (r1 ^ r3 ^ r5) & 0xff;

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">{t("rotrDesc")}</p>
      <div className="space-y-2">
        <BitRow label="a" val={val} onToggle={toggle} color="bg-blue" hint={t("flipHint")} />
        <BitRow label="rotr(a, 1)" val={r1} color="bg-purple" />
        <BitRow label="rotr(a, 3)" val={r3} color="bg-purple" />
        <BitRow label="rotr(a, 5)" val={r5} color="bg-purple" />
        <Divider label={t("xorLabel")} />
        <BitRow label={t("s0Result")} val={sigma} color="bg-orange" />
      </div>
      <RotrVisualizer val={val} n={5} color="bg-purple" />
      <WhyCard>{t("rotrWhy")}</WhyCard>
    </div>
  );
}

// ── Ch (Bitwise Choice) ───────────────────────────────────────────────────────

function ChDemo() {
  const t = useTranslations("operations");
  const [e, setE] = useState(0b11001010);
  const [f, setF] = useState(0b10110101);
  const [g, setG] = useState(0b01001101);

  const eAndF = (e & f) & 0xff;
  const notE = (~e) & 0xff;
  const notEAndG = (notE & g) & 0xff;
  const ch = (eAndF ^ notEAndG) & 0xff;

  const eBits = toBits(e);
  const chBits = toBits(ch);

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">{t("chDesc")}</p>

      {/* Inputs */}
      <div className="space-y-2">
        <BitRow
          label={`e (${t("selector")})`}
          val={e}
          onToggle={(i) => setE((v) => v ^ (1 << (7 - i)))}
          color="bg-blue"
          hint={t("flipHint")}
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
      </div>

      <div className="py-2">
        <Divider label="Breakdown ↓" />
      </div>

      {/* Intermediate Steps */}
      <div className="space-y-2 p-4 rounded-2xl bg-bg-soft/50 border border-border/40">
        <BitRow label={t("andLabel")} val={eAndF} color="bg-purple" />
        <BitRow label={t("notELabel")} val={notE} color="bg-blue" faint />
        <BitRow label={t("notAndGLabel")} val={notEAndG} color="bg-green" />
        <Divider label={t("xorCombineLabel")} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
          <span className="w-full sm:w-24 shrink-0 font-mono text-[10px] sm:text-xs text-text-secondary uppercase tracking-wider sm:normal-case">
            {t("chResult")}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {chBits.map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <Bit on={b === 1} color={eBits[i] ? "bg-purple" : "bg-green"} />
                  <span className="font-mono text-[8px] sm:text-[9px] text-text-secondary">
                    {eBits[i] ? "f" : "g"}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-text-secondary/60 italic sm:not-italic">{t("source")}</span>
          </div>
        </div>
      </div>

      {/* Bitwise Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-purple-light border border-purple/10">
          <div className="text-[10px] font-bold text-purple uppercase tracking-tight mb-1">
            {t("bitwiseBasics")}
          </div>
          <div className="text-xs text-text-secondary leading-relaxed">{t("andExplain")}</div>
        </div>
        <div className="p-3 rounded-xl bg-blue-light border border-blue/10">
          <div className="text-[10px] font-bold text-blue uppercase tracking-tight mb-1">
            {t("bitwiseBasics")}
          </div>
          <div className="text-xs text-text-secondary leading-relaxed">{t("notExplain")}</div>
        </div>
        <div className="p-3 rounded-xl bg-orange-light border border-orange/10">
          <div className="text-[10px] font-bold text-orange uppercase tracking-tight mb-1">
            {t("bitwiseBasics")}
          </div>
          <div className="text-xs text-text-secondary leading-relaxed">{t("xorExplain")}</div>
        </div>
      </div>

      <WhyCard>{t("chWhy")}</WhyCard>
    </div>
  );
}

// ── Modular Addition ──────────────────────────────────────────────────────────

function ModAddDemo() {
  const t = useTranslations("operations");
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
      <p className="text-sm text-text-secondary">{t("addDesc")}</p>
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="w-full sm:w-24 shrink-0 font-mono text-[10px] sm:text-xs text-text-secondary uppercase tracking-wider sm:normal-case">
            a = {a}
          </span>
          <div className="flex flex-wrap items-center gap-3">
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
              className="w-24 sm:w-20 accent-blue"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="w-full sm:w-24 shrink-0 font-mono text-[10px] sm:text-xs text-text-secondary uppercase tracking-wider sm:normal-case">
            b = {b}
          </span>
          <div className="flex flex-wrap items-center gap-3">
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
              className="w-24 sm:w-20 accent-purple"
            />
          </div>
        </div>
        <Divider label={`(${a} + ${b}) mod 256 ↓`} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
          <span className="w-full sm:w-24 shrink-0 font-mono text-[10px] sm:text-xs text-text-secondary uppercase tracking-wider sm:normal-case">
            {t("result")} = {result}
          </span>
          <div className="flex gap-1 items-center">
            <div className="flex flex-col items-center mr-1">
              <Bit on={carryBit === 1} color="bg-red" faint={!overflowed} />
              <span className="font-mono text-[8px] sm:text-[9px] text-text-secondary mt-0.5">{t("carry")}</span>
            </div>
            <div className="w-px h-6 sm:h-7 bg-border mx-0.5 sm:mx-1" />
            <div className="flex gap-1">
              {resultBits.map((bit, i) => (
                <Bit key={i} on={bit === 1} color="bg-orange" />
              ))}
            </div>
          </div>
        </div>
        {overflowed && (
          <div className="flex gap-2 items-start rounded-xl bg-orange-light border border-orange/30 px-3 py-2 text-xs text-text-secondary">
            <span className="shrink-0">⚠️</span>
            <span>{t("addOverflow", { result })}</span>
          </div>
        )}
      </div>
      <WhyCard>
        {t("addWhy", { result, a, b })}
      </WhyCard>
    </div>
  );
}

// ── Majority ──────────────────────────────────────────────────────────────────

function MajDemo() {
  const t = useTranslations("operations");
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
      <p className="text-sm text-text-secondary">{t("majDesc")}</p>
      <div className="space-y-2">
        <BitRow label="a" val={a} onToggle={(i) => setA((v) => v ^ (1 << (7 - i)))} color="bg-blue" />
        <BitRow label="b" val={b} onToggle={(i) => setB((v) => v ^ (1 << (7 - i)))} color="bg-purple" />
        <BitRow
          label="c"
          val={c}
          onToggle={(i) => setC((v) => v ^ (1 << (7 - i)))}
          color="bg-green"
          hint={t("flipHint")}
        />
        <Divider label={t("majorityLabel")} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
          <span className="w-full sm:w-24 shrink-0 font-mono text-[10px] sm:text-xs text-text-secondary uppercase tracking-wider sm:normal-case">
            {t("majResult")}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {majBits.map((bit, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <Bit on={bit === 1} color="bg-orange" />
                  <span className="font-mono text-[8px] sm:text-[9px] text-text-secondary">
                    {votes[i]}/3
                  </span>
                </div>
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-text-secondary/60 italic sm:not-italic">{t("votes")}</span>
          </div>
        </div>
      </div>
      <WhyCard>
        {t("majWhy")}
      </WhyCard>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

const OPS = ["rotr", "ch", "add", "maj"] as const;
type Op = (typeof OPS)[number];

const OP_FORMULAS: Record<Op, string> = {
  rotr: "S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)",
  ch: "Ch = (e & f) ^ (~e & g)",
  add: "t1 = (h + S1 + ch + k + w) mod 2³²",
  maj: "Maj = (a & b) ^ (a & c) ^ (b & c)",
};

export function OperationsDemo() {
  const t = useTranslations("operations");
  const [active, setActive] = useState<Op>("rotr");

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ background: "linear-gradient(90deg, #f0f9ff, #faf5ff)" }}
      >
        <span className="text-base">🔬</span>
        <span className="text-sm font-semibold text-text-primary">{t("title")}</span>
        <span className="ml-auto text-xs text-text-secondary">{t("subtitle")}</span>
      </div>

      {/* tabs */}
      <div className="flex border-b border-border bg-bg-soft overflow-x-auto no-scrollbar">
        {OPS.map((op) => (
          <button
            key={op}
            onClick={() => setActive(op)}
            className={[
              "flex-1 min-w-[80px] px-3 py-2.5 text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap",
              active === op
                ? "text-text-primary border-b-2 border-orange bg-white"
                : "text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            {t(`${op}Label`)}
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
