"use client";

import { useState, useEffect } from "react";
import { sha256 } from "@/lib/crypto/sha256";
import { diffHashes } from "@/lib/crypto/hashDiff";
import { HashDisplay } from "./HashDisplay";

// The hidden phrase whose hash is displayed as the challenge
const HIDDEN_PHRASE = "blocks not banks";

export function ReverseChallenge() {
  const [targetHash, setTargetHash] = useState("");
  const [guess, setGuess] = useState("");
  const [guessHash, setGuessHash] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    sha256(HIDDEN_PHRASE).then(setTargetHash);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const h = await sha256(guess.trim());
    setGuessHash(h);
    setCorrect(h === targetHash);
    setSubmitted(true);
  }

  function handleReset() {
    setGuess("");
    setGuessHash("");
    setSubmitted(false);
    setCorrect(false);
  }

  const diff =
    submitted && guessHash && targetHash
      ? diffHashes(guessHash, targetHash)
      : [];
  const matchCount = diff.filter((d) => d.status === "same").length;

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-2">
          Target hash — find the input that produced this
        </div>
        <HashDisplay hash={targetHash} />
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary">
            Your guess
          </label>
          <div className="flex gap-2">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="flex-1 bg-code-bg border border-code-border rounded
                         font-mono text-sm text-text-primary px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-accent-teal/50
                         placeholder:text-text-secondary/40"
              placeholder="What do you think the input was?"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={!guess.trim()}
              className="px-4 py-2 rounded bg-accent-teal/10 border border-accent-teal/30
                         text-accent-teal text-sm font-medium font-mono
                         hover:bg-accent-teal/20 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Hash it
            </button>
          </div>
        </form>
      ) : correct ? (
        <div className="p-4 space-y-3">
          <div className="text-success font-mono text-sm font-medium">
            ✓ Correct! The input was: &ldquo;{HIDDEN_PHRASE}&rdquo;
          </div>
          <p className="text-sm text-text-secondary">
            You found a preimage — but you did it by guessing, not by reversing
            the hash. There is no algorithm that works backwards from hash to
            input.
          </p>
          <button
            onClick={handleReset}
            className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
          >
            Try again →
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="text-accent-amber font-mono text-sm font-medium">
            ✗ Wrong. Hash functions are all-or-nothing.
          </div>
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-text-secondary">
              Your guess hashed to
            </div>
            <HashDisplay hash={guessHash} diffAgainst={targetHash} />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-text-secondary">
              Target hash
            </div>
            <HashDisplay hash={targetHash} diffAgainst={guessHash} />
          </div>
          <div className="text-xs text-text-secondary font-mono border-t border-border pt-3">
            <span className="text-accent-teal">{matchCount}</span> of 64
            characters matched — even 63/64 is a complete miss.
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
          >
            Try again →
          </button>
        </div>
      )}
    </div>
  );
}
