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

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Column A */}
        <div className="p-4 space-y-3">
          <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary">
            Input A
          </label>
          <input
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            className="w-full bg-code-bg border border-code-border rounded
                       font-mono text-sm text-text-primary px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-accent-teal/50"
            spellCheck={false}
          />
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-1.5">
              SHA-256
            </div>
            <HashDisplay hash={hashA} diffAgainst={hashB} />
          </div>
        </div>

        {/* Column B */}
        <div className="p-4 space-y-3">
          <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary">
            Input B
          </label>
          <input
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            className="w-full bg-code-bg border border-code-border rounded
                       font-mono text-sm text-text-primary px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-accent-amber/50"
            spellCheck={false}
          />
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-1.5">
              SHA-256
            </div>
            <HashDisplay hash={hashB} diffAgainst={hashA} />
          </div>
        </div>
      </div>

      {/* Summary bar */}
      {changedCount > 0 && (
        <div className="border-t border-border bg-code-bg px-4 py-3 flex items-center gap-2 text-sm">
          <span className="text-text-secondary">Changed:</span>
          <span className="font-mono text-accent-amber font-medium">
            {changedCount}
          </span>
          <span className="text-text-secondary">of 64 hex characters</span>
          <span className="ml-auto font-mono text-accent-amber font-medium">
            {pct}%
          </span>
        </div>
      )}
      {changedCount === 0 && hashA && hashB && hashA === hashB && (
        <div className="border-t border-border bg-code-bg px-4 py-3 text-sm text-success font-mono">
          Identical inputs → identical hashes (deterministic)
        </div>
      )}
    </div>
  );
}
