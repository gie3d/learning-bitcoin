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
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="p-4 border-b border-border">
        <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-2">
          Input
        </label>
        <textarea
          className="w-full bg-code-bg font-mono text-sm text-text-primary
                     border border-code-border rounded p-3 resize-none
                     focus:outline-none focus:ring-2 focus:ring-accent-teal/50
                     placeholder:text-text-secondary/40"
          rows={4}
          placeholder="Type anything here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
        <div className="mt-1.5 text-xs text-text-secondary font-mono">
          {input.length} chars · {byteCount} bytes
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-2">
          SHA-256
        </div>
        {hash ? (
          <HashDisplay hash={hash} />
        ) : (
          <div className="font-mono text-sm text-text-secondary/30">
            computing...
          </div>
        )}
        {input === "" && hash && (
          <p className="mt-2 text-xs text-text-secondary">
            This is the SHA-256 hash of an empty string — even nothing produces a 64-character output.
          </p>
        )}
      </div>
    </div>
  );
}
