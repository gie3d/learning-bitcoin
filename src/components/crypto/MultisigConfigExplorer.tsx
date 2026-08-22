"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const MAX_N = 7;

interface Preset {
  m: number;
  n: number;
  key: "shared" | "vault" | "treasury" | "escrow";
}

const PRESETS: Preset[] = [
  { m: 1, n: 2, key: "shared" },
  { m: 2, n: 3, key: "vault" },
  { m: 3, n: 5, key: "treasury" },
  { m: 2, n: 2, key: "escrow" },
];

export function MultisigConfigExplorer() {
  const t = useTranslations("multisigConfig");
  const [n, setN] = useState(3);
  const [m, setM] = useState(2);

  function setTotal(next: number) {
    setN(next);
    if (m > next) setM(next);
  }

  const canLose = n - m;
  const warning =
    m === n ? "noRedundancy" : m === 1 ? "noSecurity" : canLose === 0 ? "noRedundancy" : null;

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      <div className="px-5 py-3 text-xs font-semibold text-text-secondary bg-bg-soft">
        {t("title")}
      </div>

      {/* Key diagram */}
      <div className="bg-code-bg px-5 py-5 border-t border-border">
        <p className="text-center font-mono text-2xl font-bold text-orange mb-4">
          {t("label", { m, n })}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: n }, (_, i) => (
            <div
              key={i}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg ${
                i < m
                  ? "border-orange/40 bg-orange/10"
                  : "border-border bg-bg-soft opacity-40"
              }`}
              title={i < m ? t("keyRequired") : t("keyOptional")}
            >
              🔑
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-text-secondary">{t("diagramCaption")}</p>
      </div>

      {/* Sliders */}
      <div className="bg-white px-5 py-4 border-t border-border space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="multisig-n" className="text-xs font-semibold text-text-secondary">
              {t("totalLabel")}
            </label>
            <span className="font-mono text-sm font-bold text-text-primary tabular-nums">{n}</span>
          </div>
          <input
            id="multisig-n"
            type="range"
            min={2}
            max={MAX_N}
            value={n}
            onChange={(e) => setTotal(Number(e.target.value))}
            className="w-full accent-orange"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="multisig-m" className="text-xs font-semibold text-text-secondary">
              {t("thresholdLabel")}
            </label>
            <span className="font-mono text-sm font-bold text-text-primary tabular-nums">{m}</span>
          </div>
          <input
            id="multisig-m"
            type="range"
            min={1}
            max={n}
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
            className="w-full accent-orange"
          />
        </div>
      </div>

      {/* Consequences */}
      <div className="bg-white px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-blue/30 bg-blue-light p-4">
          <p className="text-xs font-semibold text-blue mb-1">{t("attackerLabel")}</p>
          <p className="font-mono text-xl font-bold text-text-primary">{m}</p>
          <p className="text-xs text-text-secondary leading-relaxed mt-1">
            {t("attackerBody", { m, n })}
          </p>
        </div>
        <div className="rounded-2xl border border-purple/30 bg-purple-light p-4">
          <p className="text-xs font-semibold text-purple mb-1">{t("lossLabel")}</p>
          <p className="font-mono text-xl font-bold text-text-primary">{canLose}</p>
          <p className="text-xs text-text-secondary leading-relaxed mt-1">
            {canLose === 0 ? t("lossBodyNone") : t("lossBody", { canLose, n })}
          </p>
        </div>
      </div>

      {warning && (
        <div className="bg-white px-5 pb-4">
          <div className="rounded-2xl border border-orange/30 bg-orange/5 px-4 py-3">
            <p className="text-xs text-text-secondary leading-relaxed">{t(warning)}</p>
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="bg-bg-soft px-5 py-4 border-t border-border">
        <p className="text-xs font-semibold text-text-secondary mb-2">{t("presetsLabel")}</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = p.m === m && p.n === n;
            return (
              <button
                key={p.key}
                onClick={() => {
                  setN(p.n);
                  setM(p.m);
                }}
                className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                  active
                    ? "border-orange/40 bg-orange/10"
                    : "border-border bg-white hover:border-orange/30"
                }`}
              >
                <span className="block font-mono text-xs font-bold text-orange">
                  {t("label", { m: p.m, n: p.n })}
                </span>
                <span className="block text-[11px] text-text-secondary">
                  {t(`preset_${p.key}`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
