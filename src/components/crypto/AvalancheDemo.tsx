"use client";

import { useState, useEffect } from "react";
import { sha256 } from "@/lib/crypto/sha256";
import { diffHashes } from "@/lib/crypto/hashDiff";
import { HashDisplay } from "./HashDisplay";

export function AvalancheDemo() {
  const [inputA, setInputA] = useState("hello world");
  const [inputB, setInputB] = useState("hello World");
  const [hashA, setHashA] = useState("");
  const [hashB, setHashB] = useState("");

  useEffect(() => {
    sha256(inputA).then(setHashA);
  }, [inputA]);

  useEffect(() => {
    sha256(inputB).then(setHashB);
  }, [inputB]);

  const diff =
    hashA && hashB && hashA.length === 64 && hashB.length === 64
      ? diffHashes(hashA, hashB)
      : [];
  const changedCount = diff.filter((d) => d.status === "changed").length;
  const pct = diff.length > 0 ? Math.round((changedCount / 64) * 100) : 0;
  const isIdentical = hashA && hashB && hashA === hashB;

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ background: "linear-gradient(90deg, #eff6ff, #faf5ff)" }}
      >
        <span className="text-base">🌊</span>
        <span className="text-sm font-semibold text-text-primary">
          Avalanche Effect
        </span>
        <span className="ml-auto text-xs text-text-secondary">
          edit either input
        </span>
      </div>

      <div className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Column A */}
          <div className="p-5 space-y-3 border-b md:border-b-0 md:border-r border-border">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              <span className="w-5 h-5 rounded-full bg-blue text-white text-xs flex items-center justify-center font-bold">
                A
              </span>
              Input A
            </label>
            <input
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              className="w-full bg-bg-soft border border-border rounded-xl
                         font-sans text-sm text-text-primary px-3.5 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue
                         transition-colors"
              spellCheck={false}
            />
            <div className="rounded-xl bg-code-bg border border-code-border p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                Hash
              </div>
              <HashDisplay hash={hashA} diffAgainst={hashB} />
            </div>
          </div>

          {/* Column B */}
          <div className="p-5 space-y-3">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              <span className="w-5 h-5 rounded-full bg-orange text-white text-xs flex items-center justify-center font-bold">
                B
              </span>
              Input B
            </label>
            <input
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              className="w-full bg-bg-soft border border-border rounded-xl
                         font-sans text-sm text-text-primary px-3.5 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange
                         transition-colors"
              spellCheck={false}
            />
            <div className="rounded-xl bg-code-bg border border-code-border p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                Hash
              </div>
              <HashDisplay hash={hashB} diffAgainst={hashA} />
            </div>
          </div>
        </div>

        {/* Summary */}
        {isIdentical ? (
          <div className="border-t border-border px-5 py-3 bg-green-light text-sm text-green font-semibold flex items-center gap-2">
            <span>✅</span> Identical inputs → identical hashes (deterministic)
          </div>
        ) : changedCount > 0 ? (
          <div className="border-t border-border px-5 py-3 bg-orange-light flex items-center gap-3 text-sm">
            <span className="text-lg">🔥</span>
            <span className="text-text-secondary">
              <span className="font-bold text-orange">{changedCount}</span> of 64 characters changed
            </span>
            <span className="ml-auto">
              <span className="font-bold text-orange text-base">{pct}%</span>
              <span className="text-text-secondary text-xs ml-1">different</span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
