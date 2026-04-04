"use client";

import { useState, useEffect } from "react";
import { sha256 } from "@/lib/crypto/sha256";
import { diffHashes } from "@/lib/crypto/hashDiff";
import { HashDisplay } from "./HashDisplay";

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
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ background: "linear-gradient(90deg, #faf5ff, #eff6ff)" }}
      >
        <span className="text-base">🔍</span>
        <span className="text-sm font-semibold text-text-primary">
          Reverse Challenge
        </span>
        <span className="ml-auto text-xs text-text-secondary">can you find the input?</span>
      </div>

      <div className="bg-white">
        {/* Target hash */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-3">
            🎯 Target hash — find the input that produced this
          </div>
          <div className="rounded-xl bg-code-bg border border-code-border p-3">
            <HashDisplay hash={targetHash} />
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                Your guess
              </label>
              <div className="flex gap-2">
                <input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="flex-1 bg-bg-soft border border-border rounded-xl
                             font-sans text-sm text-text-primary px-3.5 py-2.5
                             focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple
                             placeholder:text-text-secondary/50 transition-colors"
                  placeholder="What do you think the input was?"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  disabled={!guess.trim()}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                             disabled:opacity-40 disabled:cursor-not-allowed
                             transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}
                >
                  Hash it →
                </button>
              </div>
            </div>
          </form>
        ) : correct ? (
          <div className="p-5 space-y-4">
            <div className="rounded-2xl bg-green-light border border-green/20 p-4 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <div className="text-green font-bold text-base mb-1">You got it!</div>
              <div className="text-sm text-text-secondary">
                The input was: <span className="font-semibold text-text-primary">&ldquo;{HIDDEN_PHRASE}&rdquo;</span>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              You found it by guessing — not by reversing the hash. There&apos;s no algorithm that works backwards. The only method is trial and error.
            </p>
            <button
              onClick={handleReset}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium"
            >
              Try again →
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="rounded-2xl bg-red-light border border-red/20 p-4 flex gap-3 items-start">
              <span className="text-xl">❌</span>
              <div>
                <div className="font-bold text-red text-sm">Not quite!</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  Hash functions are all-or-nothing — no partial credit.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-code-bg border border-code-border p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                  Your guess hashed to
                </div>
                <HashDisplay hash={guessHash} diffAgainst={targetHash} />
              </div>
              <div className="rounded-xl bg-code-bg border border-code-border p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                  Target hash
                </div>
                <HashDisplay hash={targetHash} diffAgainst={guessHash} />
              </div>
            </div>

            <div className="rounded-xl bg-blue-light border border-blue/20 px-4 py-3 text-sm">
              <span className="text-blue font-bold">{matchCount}</span>
              <span className="text-text-secondary"> of 64 characters matched — even 63/64 is a complete miss.</span>
            </div>

            <button
              onClick={handleReset}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium"
            >
              Try again →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
