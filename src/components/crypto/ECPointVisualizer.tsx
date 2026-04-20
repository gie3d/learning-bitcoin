"use client";

import { useState, useCallback } from "react";
import { toyPoints, toyMultiply, multiplyGenerator } from "@/lib/crypto/secp256k1";
import { CodeBlock } from "@/components/ui/CodeBlock";

const TOY_P = 43;
const ALL_POINTS = toyPoints();

const SVG_SIZE = 280;
const MARGIN = 24;
const PLOT = SVG_SIZE - MARGIN * 2;

function toSvg(v: number, max: number) {
  return MARGIN + (v / max) * PLOT;
}

type Step = { label: string; point: { x: number; y: number } };

function buildSteps(k: number): Step[] {
  const steps: Step[] = [];
  let cur: ReturnType<typeof toyMultiply> = "infinity";
  for (let i = 1; i <= k; i++) {
    const prev = cur;
    cur = toyMultiply(i);
    if (cur === "infinity") break;
    if (prev === "infinity") {
      steps.push({ label: `G = (${cur.x}, ${cur.y})`, point: cur });
    } else if (typeof prev === "object" && prev.x === cur.x && prev.y === cur.y) {
      steps.push({ label: `Double: → (${cur.x}, ${cur.y})`, point: cur });
    } else {
      steps.push({ label: `Add: → (${cur.x}, ${cur.y})`, point: cur });
    }
  }
  return steps;
}

export function ECPointVisualizer() {
  const [tab, setTab] = useState<"concept" | "real">("concept");
  const [scalar, setScalar] = useState(3);
  const [realK, setRealK] = useState("07");
  const [realResult, setRealResult] = useState<{ x: string; y: string } | null>(null);
  const [realLoading, setRealLoading] = useState(false);

  const steps = buildSteps(scalar);
  const activePoint = steps[steps.length - 1]?.point;

  const computeReal = useCallback(() => {
    if (!realK.trim()) return;
    setRealLoading(true);
    try {
      const k = realK.padStart(64, "0");
      const result = multiplyGenerator(k);
      setRealResult(result);
    } catch {
      setRealResult(null);
    }
    setRealLoading(false);
  }, [realK]);

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["concept", "real"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              tab === t
                ? "bg-white text-text-primary border-b-2 border-orange"
                : "bg-bg-soft text-text-secondary hover:text-text-primary"
            }`}
          >
            {t === "concept" ? "Concept (toy curve)" : "Real secp256k1"}
          </button>
        ))}
      </div>

      {tab === "concept" ? (
        <div className="bg-white p-5">
          {/* Scalar stepper */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold text-text-secondary">k =</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                <button
                  key={v}
                  onClick={() => setScalar(v)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    scalar === v
                      ? "bg-orange text-white"
                      : "bg-bg-soft text-text-secondary hover:bg-orange/10"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            {/* SVG curve */}
            <div className="shrink-0">
              <svg
                width={SVG_SIZE}
                height={SVG_SIZE}
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                className="w-full max-w-[280px]"
              >
                {/* Grid */}
                {[0, 10, 20, 30, 40].map((v) => (
                  <g key={v}>
                    <line
                      x1={toSvg(v, TOY_P - 1)}
                      y1={MARGIN}
                      x2={toSvg(v, TOY_P - 1)}
                      y2={SVG_SIZE - MARGIN}
                      stroke="#e5e7eb"
                      strokeWidth={0.5}
                    />
                    <line
                      x1={MARGIN}
                      y1={toSvg(v, TOY_P - 1)}
                      x2={SVG_SIZE - MARGIN}
                      y2={toSvg(v, TOY_P - 1)}
                      stroke="#e5e7eb"
                      strokeWidth={0.5}
                    />
                  </g>
                ))}

                {/* All curve points */}
                {ALL_POINTS.map((p) => (
                  <circle
                    key={`${p.x}-${p.y}`}
                    cx={toSvg(p.x, TOY_P - 1)}
                    cy={toSvg(TOY_P - 1 - p.y, TOY_P - 1)}
                    r={2.5}
                    fill="var(--color-blue)"
                    opacity={0.25}
                  />
                ))}

                {/* Path of k*G steps */}
                {steps.length > 1 &&
                  steps.slice(0, -1).map((s, i) => {
                    const next = steps[i + 1];
                    return (
                      <line
                        key={i}
                        x1={toSvg(s.point.x, TOY_P - 1)}
                        y1={toSvg(TOY_P - 1 - s.point.y, TOY_P - 1)}
                        x2={toSvg(next.point.x, TOY_P - 1)}
                        y2={toSvg(TOY_P - 1 - next.point.y, TOY_P - 1)}
                        stroke="var(--color-orange)"
                        strokeWidth={1}
                        strokeDasharray="3 2"
                        opacity={0.5}
                      />
                    );
                  })}

                {/* Visited points */}
                {steps.map((s, i) => (
                  <circle
                    key={i}
                    cx={toSvg(s.point.x, TOY_P - 1)}
                    cy={toSvg(TOY_P - 1 - s.point.y, TOY_P - 1)}
                    r={i === steps.length - 1 ? 6 : 4}
                    fill={i === steps.length - 1 ? "var(--color-orange)" : "var(--color-purple)"}
                    opacity={i === steps.length - 1 ? 1 : 0.6}
                  />
                ))}

                {/* Labels */}
                <text
                  x={MARGIN}
                  y={SVG_SIZE - 4}
                  fontSize={9}
                  fill="var(--color-text-secondary)"
                >
                  x (mod 43)
                </text>
                <text
                  x={4}
                  y={MARGIN + 8}
                  fontSize={9}
                  fill="var(--color-text-secondary)"
                >
                  y
                </text>
              </svg>
            </div>

            {/* Step log */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-widest">
                Steps for k = {scalar}
              </p>
              <div className="space-y-1">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono transition-colors ${
                      i === steps.length - 1
                        ? "bg-orange/10 text-orange font-bold"
                        : "bg-bg-soft text-text-secondary"
                    }`}
                  >
                    <span className="w-4 text-center opacity-50">{i + 1}</span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              {activePoint && (
                <div className="mt-3 rounded-xl bg-orange/5 border border-orange/20 px-3 py-2">
                  <p className="text-xs text-text-secondary">
                    <span className="font-semibold text-orange">k·G</span> ={" "}
                    ({activePoint.x}, {activePoint.y})
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 space-y-5">
          {/* secp256k1 params */}
          <CodeBlock language="secp256k1 parameters">
            {`p   = FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
    // 256-bit prime field modulus

G.x = 79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
G.y = 483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8
    // generator point — same for every Bitcoin wallet

n   = FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
    // group order — private keys must be in [1, n-1]`}
          </CodeBlock>

          {/* Live compute */}
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-2">
              Compute k × G on real secp256k1
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={realK}
                onChange={(e) => setRealK(e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 64))}
                placeholder="private key (hex)"
                className="flex-1 rounded-xl border border-border bg-bg-soft px-3 py-2 font-mono text-xs
                           text-text-primary focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              <button
                onClick={computeReal}
                disabled={realLoading || !realK.trim()}
                className="rounded-xl bg-orange px-4 py-2 text-xs font-semibold text-white
                           hover:bg-orange/90 transition-colors disabled:opacity-60"
              >
                Compute →
              </button>
            </div>
            {realResult && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-border">
                <div className="px-4 py-2 bg-blue-light text-xs font-semibold text-text-secondary">
                  Public key point
                </div>
                <div className="bg-code-bg px-4 py-3 space-y-1">
                  <p className="font-mono text-xs text-blue break-all">
                    x: {realResult.x}
                  </p>
                  <p className="font-mono text-xs text-purple break-all">
                    y: {realResult.y}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Derivation flow */}
      <div className="border-t border-border bg-bg-soft px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 justify-center text-xs">
          <div className="rounded-xl bg-orange/10 border border-orange/30 px-3 py-2 text-center">
            <p className="font-semibold text-orange">Private key</p>
            <p className="text-text-secondary font-mono">k (256 bits)</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-text-secondary">→ k × G →</span>
            <span className="text-text-secondary opacity-50 text-[10px]">~256 steps</span>
          </div>
          <div className="rounded-xl bg-blue-light border border-blue/30 px-3 py-2 text-center">
            <p className="font-semibold text-blue">Public key</p>
            <p className="text-text-secondary font-mono">(x, y) point</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-text-secondary">→ ?</span>
            <span className="text-text-secondary opacity-50 text-[10px]">impossible</span>
          </div>
          <div className="rounded-xl bg-bg-soft border border-border px-3 py-2 text-center opacity-50">
            <p className="font-semibold text-text-secondary">🔒 Private key</p>
            <p className="text-text-secondary font-mono">k = ???</p>
          </div>
        </div>
      </div>
    </div>
  );
}
