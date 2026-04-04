"use client";

import { useState } from "react";
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
  const t = useTranslations("operations");
  return (
    <div className="rounded-2xl bg-orange-light border-l-4 border-orange px-4 py-3 text-sm text-text-secondary leading-relaxed">
      <span className="font-semibold text-text-primary">{t("whyIrreversible")}: </span>
      {children}
    </div>
  );
}

// ── ROTR ──────────────────────────────────────────────────────────────────────

function RotrDemo() {
  const t = useTranslations("operations");
  const [val, setVal] = useState(0b10110100);
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
      <WhyCard>
        <span dangerouslySetInnerHTML={{ __html: t("rotrWhy") }} />
      </WhyCard>
    </div>
  );
}

// ── Ch (Bitwise Choice) ───────────────────────────────────────────────────────

function ChDemo() {
  const t = useTranslations("operations");
  const [e, setE] = useState(0b11001010);
  const [f, setF] = useState(0b10110101);
  const [g, setG] = useState(0b01001101);

  const ch = ((e & f) ^ (~e & g)) & 0xff;
  const eBits = toBits(e);
  const chBits = toBits(ch);

  return (
    <div className="space-y-3">
      <p
        className="text-sm text-text-secondary"
        dangerouslySetInnerHTML={{ __html: t("chDesc") }}
      />
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
        <Divider label="Ch = (e & f) ^ (~e & g) ↓" />
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-text-secondary">{t("chResult")}</span>
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
          <span className="text-xs text-text-secondary/60">{t("source")}</span>
        </div>
      </div>
      <WhyCard>
        <span dangerouslySetInnerHTML={{ __html: t("chWhy") }} />
      </WhyCard>
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
      <p
        className="text-sm text-text-secondary"
        dangerouslySetInnerHTML={{ __html: t("addDesc") }}
      />
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
            {t("result")} = {result}
          </span>
          <div className="flex gap-1 items-center">
            <div className="flex flex-col items-center mr-1">
              <Bit on={carryBit === 1} color="bg-red" faint={!overflowed} />
              <span className="font-mono text-[9px] text-text-secondary mt-0.5">{t("carry")}</span>
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
            <span
              dangerouslySetInnerHTML={{
                __html: t("addOverflow", { result }),
              }}
            />
          </div>
        )}
      </div>
      <WhyCard>
        <span dangerouslySetInnerHTML={{ __html: t("addWhy", { result, a, b }) }} />
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
      <p
        className="text-sm text-text-secondary"
        dangerouslySetInnerHTML={{ __html: t("majDesc") }}
      />
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
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-text-secondary">{t("majResult")}</span>
          <div className="flex gap-1">
            {majBits.map((bit, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <Bit on={bit === 1} color="bg-orange" />
                <span className="font-mono text-[9px] text-text-secondary">{votes[i]}/3</span>
              </div>
            ))}
          </div>
          <span className="text-xs text-text-secondary/60">{t("votes")}</span>
        </div>
      </div>
      <WhyCard>
        <span dangerouslySetInnerHTML={{ __html: t("majWhy") }} />
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
