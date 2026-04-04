"use client";

import { useState, useEffect } from "react";
import { sha256 } from "@/lib/crypto/sha256";
import { HashDisplay } from "./HashDisplay";

export function HashSandbox() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");

  useEffect(() => {
    sha256(input).then(setHash);
  }, [input]);

  const byteCount = new TextEncoder().encode(input).length;

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* Header band */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ background: "linear-gradient(90deg, #fff7ed, #faf5ff)" }}
      >
        <span className="text-base">⌨️</span>
        <span className="text-sm font-semibold text-text-primary">
          Hash Playground
        </span>
        <span className="ml-auto text-xs text-text-secondary">
          SHA-256 · live
        </span>
      </div>

      <div className="bg-white p-5 space-y-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Your input
          </label>
          <textarea
            className="w-full bg-bg-soft font-sans text-sm text-text-primary
                       border border-border rounded-2xl p-3.5 resize-none
                       focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange
                       placeholder:text-text-secondary/50 transition-colors"
            rows={3}
            placeholder="Type anything — a word, a sentence, your name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
          <div className="mt-1.5 text-xs text-text-secondary">
            {input.length} characters · {byteCount} bytes
          </div>
        </div>

        {/* Output */}
        <div className="rounded-2xl bg-code-bg border border-code-border p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2.5">
            SHA-256 output — always 64 characters
          </div>
          {hash ? (
            <HashDisplay hash={hash} />
          ) : (
            <div className="font-mono text-sm text-text-secondary/30">
              waiting...
            </div>
          )}
          {input === "" && hash && (
            <p className="mt-3 text-xs text-text-secondary bg-orange-light rounded-xl px-3 py-2">
              💡 Even an empty string has a 64-character hash. Input size doesn&apos;t matter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
