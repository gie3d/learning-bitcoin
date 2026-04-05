"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

type ByteKind = "message" | "padding-start" | "zero" | "length";

function padMessage(input: string): Uint8Array {
  const msgBytes = new TextEncoder().encode(input);
  const msgLen = msgBytes.length;
  const bitLen = msgLen * 8;
  // Need: (msgLen + 1 + zeroPad + 8) % 64 === 0
  const zeroPad = (64 - ((msgLen + 9) % 64)) % 64;
  const totalLen = msgLen + 1 + zeroPad + 8;
  const padded = new Uint8Array(totalLen);
  padded.set(msgBytes, 0);
  padded[msgLen] = 0x80;
  // Write 64-bit big-endian bit length
  const view = new DataView(padded.buffer);
  view.setUint32(totalLen - 8, Math.floor(bitLen / 2 ** 32), false);
  view.setUint32(totalLen - 4, bitLen >>> 0, false);
  return padded;
}

function getByteKind(index: number, msgLen: number, totalLen: number): ByteKind {
  if (index < msgLen) return "message";
  if (index === msgLen) return "padding-start";
  if (index < totalLen - 8) return "zero";
  return "length";
}

const kindStyles: Record<ByteKind, string> = {
  message: "bg-green/10 text-green border-green/30 font-semibold",
  "padding-start": "bg-orange/10 text-orange border-orange/30 font-semibold",
  zero: "bg-bg-soft text-text-secondary/40 border-border",
  length: "bg-blue/10 text-blue border-blue/30 font-semibold",
};

export function MessagePaddingDemo() {
  const t = useTranslations("padding");
  const [input, setInput] = useState("abc");

  const padded = padMessage(input);
  const msgLen = new TextEncoder().encode(input).length;
  const totalLen = padded.length;
  const blocks = totalLen / 64;

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ background: "linear-gradient(90deg, #f0fdf4, #eff6ff)" }}
      >
        <span className="text-base">📦</span>
        <span className="text-sm font-semibold text-text-primary">{t("title")}</span>
        <span className="ml-auto text-xs text-text-secondary">{t("subtitle")}</span>
      </div>

      <div className="bg-white p-5 space-y-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
            {t("inputLabel")}
          </label>
          <input
            type="text"
            className="w-full bg-bg-soft font-sans text-sm text-text-primary
                       border border-border rounded-2xl px-3.5 py-2.5
                       focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange
                       placeholder:text-text-secondary/50 transition-colors"
            placeholder={t("placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Byte grid */}
        <div className="rounded-2xl bg-code-bg border border-code-border p-4">
          <div className="grid gap-1 grid-cols-8 sm:[grid-template-columns:repeat(16,minmax(2rem,1fr))]">
            {Array.from(padded).map((byte, i) => {
              const kind = getByteKind(i, msgLen, totalLen);
              const isBlockBoundary = i > 0 && i % 64 === 0;
              return (
                <div key={i} className={cn(isBlockBoundary && "col-span-full h-px bg-border my-0.5")}>
                  {isBlockBoundary ? null : (
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-md border text-[10px] font-mono h-7",
                        kindStyles[kind]
                      )}
                      title={kind === "message" ? `'${String.fromCharCode(byte)}'` : kind}
                    >
                      {byte.toString(16).padStart(2, "0")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {(
            [
              { kind: "message", label: t("messageLegend") },
              { kind: "padding-start", label: t("paddingStartLegend") },
              { kind: "zero", label: t("zeroPaddingLegend") },
              { kind: "length", label: t("lengthLegend") },
            ] as { kind: ByteKind; label: string }[]
          ).map(({ kind, label }) => (
            <div key={kind} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-3 h-3 rounded border text-[8px] font-mono flex items-center justify-center",
                  kindStyles[kind]
                )}
              />
              <span className="text-xs text-text-secondary">{label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <p className="text-xs text-text-secondary font-mono bg-bg-soft rounded-xl px-3 py-2">
          {t("statsLine", { bytes: msgLen, total: totalLen, blocks })}
          {blocks > 1 && (
            <span className="block mt-1 text-orange font-sans font-medium not-italic">
              {t("multiBlockNote", { blocks })}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
