"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toyMultiply } from "@/lib/crypto/secp256k1";
import { Callout } from "@/components/ui/Callout";

const SECRET_K = 7;
const TARGET = (() => {
  const p = toyMultiply(SECRET_K);
  return p === "infinity" ? { x: 0, y: 0 } : p;
})();

export function ECDLPChallenge() {
  const t = useTranslations("ecdlpChallenge");
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<"idle" | "wrong" | "correct">("idle");
  const [wrongPoint, setWrongPoint] = useState<{ x: number; y: number } | null>(null);
  const [attempts, setAttempts] = useState(0);

  function check() {
    const k = parseInt(guess, 10);
    if (!k || k < 1 || k > 40) return;
    setAttempts((a) => a + 1);
    const pt = toyMultiply(k);
    if (pt === "infinity") {
      setResult("wrong");
      setWrongPoint(null);
      return;
    }
    if (pt.x === TARGET.x && pt.y === TARGET.y) {
      setResult("correct");
    } else {
      setResult("wrong");
      setWrongPoint(pt);
    }
  }

  function reset() {
    setGuess("");
    setResult("idle");
    setWrongPoint(null);
    setAttempts(0);
  }

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* Header */}
      <div className="px-5 py-3 text-xs font-semibold text-text-secondary bg-bg-soft flex items-center justify-between">
        <span>{t("title")}</span>
        <span className="text-text-secondary">{t("subtitle")}</span>
      </div>

      {/* Target */}
      <div className="bg-code-bg px-5 py-4 border-t border-border">
        <p className="text-xs font-semibold text-text-secondary mb-2">{t("targetLabel")}</p>
        <p className="font-mono text-sm text-orange">
          ({TARGET.x}, {TARGET.y})
        </p>
        <p className="text-xs text-text-secondary mt-1 font-mono opacity-60">
          Curve: y² = x³ + 7 (mod 43) · G = (6, 34)
        </p>
      </div>

      {/* Input */}
      <div className="bg-white px-5 py-4 border-t border-border">
        <p className="text-xs font-semibold text-text-secondary mb-2">{t("guessLabel")}</p>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={40}
            value={guess}
            onChange={(e) => { setGuess(e.target.value); setResult("idle"); }}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder={t("placeholder")}
            className="flex-1 rounded-xl border border-border bg-bg-soft px-3 py-2 text-sm
                       text-text-primary focus:outline-none focus:ring-2 focus:ring-orange/40"
          />
          <button
            onClick={check}
            disabled={!guess.trim() || result === "correct"}
            className="rounded-xl bg-orange px-4 py-2 text-sm font-semibold text-white
                       hover:bg-orange/90 transition-colors disabled:opacity-60"
          >
            {t("checkBtn")}
          </button>
        </div>
        {attempts > 0 && (
          <p className="text-xs text-text-secondary mt-2">
            {t("attemptsLabel", { count: attempts })}
          </p>
        )}
      </div>

      {/* Feedback */}
      {result === "wrong" && wrongPoint && (
        <div className="px-5 pb-4 bg-white">
          <div className="rounded-2xl border border-orange/30 bg-orange/5 px-4 py-3">
            <p className="text-sm font-semibold text-orange mb-1">{t("wrongTitle")}</p>
            <p className="text-xs text-text-secondary">
              {t("wrongBody", {
                guess: parseInt(guess, 10),
                x: wrongPoint.x,
                y: wrongPoint.y,
              })}
            </p>
          </div>
        </div>
      )}

      {result === "correct" && (
        <div className="px-5 pb-5 bg-white space-y-3">
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-sm font-semibold text-green-700 mb-1">{t("correctTitle")}</p>
            <p className="text-xs text-green-700">
              {t("correctBody", { answer: SECRET_K })}
            </p>
          </div>
          <Callout variant="insight">
            {t("correctNote", { total: 43 })}
          </Callout>
          <button
            onClick={reset}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold
                       text-text-secondary hover:text-text-primary transition-colors"
          >
            {t("resetBtn")}
          </button>
        </div>
      )}
    </div>
  );
}
