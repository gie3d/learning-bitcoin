"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { sha256trace } from "@/lib/crypto/sha256trace";

// ── helpers ──────────────────────────────────────────────────────────────────

function hex8(n: number): string {
  return n.toString(16).padStart(8, "0");
}
function hex2(n: number): string {
  return n.toString(16).padStart(2, "0");
}

// ── ByteGrid ──────────────────────────────────────────────────────────────────

function ByteGrid({
  bytes,
  highlightFn,
  max = 192,
  label,
}: {
  bytes: number[];
  highlightFn?: (
    byte: number,
    index: number
  ) => { bg?: string; color?: string; border?: string } | null;
  max?: number;
  label?: string;
}) {
  const visible = bytes.slice(0, max);
  return (
    <div>
      {label && (
        <div
          className="eyebrow"
          style={{ marginBottom: 8 }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(16, minmax(0, 1fr))",
          gap: 4,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
        }}
      >
        {visible.map((b, i) => {
          const hl = highlightFn ? highlightFn(b, i) : null;
          return (
            <div
              key={i}
              title={`byte ${i}: 0x${hex2(b)}`}
              style={{
                background: hl?.bg || "var(--bg-card)",
                color: hl?.color || "var(--ink)",
                border: `1px solid ${hl?.border || "var(--rule)"}`,
                padding: "6px 0",
                textAlign: "center",
                borderRadius: 4,
                transition: "all 0.15s",
              }}
            >
              {hex2(b)}
            </div>
          );
        })}
      </div>
      {bytes.length > max && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "var(--ink-mute)",
            fontFamily: "var(--font-mono)",
          }}
        >
          + {bytes.length - max} more bytes
        </div>
      )}
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend({
  items,
}: {
  items: { color: string; border?: string; text: string }[];
}) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--ink-soft)",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              background: it.color,
              borderRadius: 3,
              border: `1px solid ${it.border || "var(--rule)"}`,
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          {it.text}
        </div>
      ))}
    </div>
  );
}

// ── WordGrid ──────────────────────────────────────────────────────────────────

function WordGrid({
  words,
  highlightFn,
}: {
  words: number[];
  highlightFn?: (index: number) => { bg: string; border: string; color: string };
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: 8,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
      }}
    >
      {words.map((w, i) => {
        const hl = highlightFn
          ? highlightFn(i)
          : {
              bg: i < 16 ? "var(--orange-tint)" : "var(--bg)",
              border: i < 16 ? "var(--orange-soft)" : "var(--rule)",
              color: i < 16 ? "var(--orange-deep)" : "var(--ink-soft)",
            };
        return (
          <div
            key={i}
            style={{
              padding: "8px 6px",
              background: hl.bg,
              border: `1px solid ${hl.border}`,
              borderRadius: 4,
              textAlign: "center",
              color: hl.color,
            }}
          >
            <div style={{ fontSize: 9, opacity: 0.6, marginBottom: 2 }}>
              W[{i}]
            </div>
            {hex8(w)}
          </div>
        );
      })}
    </div>
  );
}

// ── Stage 0: Message ──────────────────────────────────────────────────────────

function StageMessage({
  bytes,
  isEn,
}: {
  bytes: number[];
  isEn: boolean;
}) {
  return (
    <section>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
        className="max-sm:block max-sm:space-y-8"
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3vw, 32px)",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.15,
            }}
          >
            {isEn ? (
              <>
                First,{" "}
                <em style={{ color: "var(--orange-deep)" }}>
                  encode it as bytes
                </em>
                .
              </>
            ) : (
              <>
                ก่อนอื่น{" "}
                <em style={{ color: "var(--orange-deep)" }}>
                  เปลี่ยนเป็นไบต์
                </em>
              </>
            )}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--ink-soft)",
              lineHeight: 1.65,
              marginBottom: 20,
            }}
          >
            {isEn
              ? "SHA-256 operates on bytes, not characters. UTF-8 encoding turns your text into a sequence of bytes — ASCII characters take 1 byte, others take 2–4."
              : "SHA-256 ทำงานกับไบต์ ไม่ใช่ตัวอักษร การเข้ารหัส UTF-8 แปลงข้อความเป็นลำดับไบต์ — อักขระ ASCII ใช้ 1 ไบต์ อื่นๆ ใช้ 2–4 ไบต์"}
          </p>
          <div
            style={{
              padding: "12px 16px",
              background: "var(--orange-tint)",
              border: "1px solid var(--orange-soft)",
              borderRadius: "var(--r-md)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--orange-deep)",
            }}
          >
            {bytes.length} {isEn ? "bytes" : "ไบต์"} · {bytes.length * 8}{" "}
            {isEn ? "bits" : "บิต"}
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--rule)",
            borderRadius: "var(--r-lg)",
            padding: 20,
          }}
        >
          <ByteGrid
            bytes={bytes}
            label={isEn ? "Message bytes (hex)" : "ไบต์ของข้อความ (hex)"}
            highlightFn={() => ({
              bg: "var(--orange-tint)",
              border: "var(--orange-soft)",
              color: "var(--orange-deep)",
            })}
          />
        </div>
      </div>
    </section>
  );
}

// ── Stage 1: Padding ──────────────────────────────────────────────────────────

function StagePadding({
  paddedBytes,
  originalLen,
  isEn,
}: {
  paddedBytes: number[];
  originalLen: number;
  isEn: boolean;
}) {
  const total = paddedBytes.length;

  return (
    <section>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
        className="max-sm:block max-sm:space-y-8"
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3vw, 32px)",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.15,
            }}
          >
            {isEn ? (
              <>
                Pad to a{" "}
                <em style={{ color: "var(--orange-deep)" }}>
                  multiple of 512 bits
                </em>
                .
              </>
            ) : (
              <>
                เติมให้ครบ{" "}
                <em style={{ color: "var(--orange-deep)" }}>512 บิต</em>
              </>
            )}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--ink-soft)",
              lineHeight: 1.65,
              marginBottom: 20,
            }}
          >
            {isEn
              ? "SHA-256 processes 512-bit (64-byte) blocks. Append a single 0x80 byte immediately after the message, then zero bytes, then the original message length as a 64-bit big-endian integer."
              : "SHA-256 ประมวลผลทีละบล็อก 512 บิต เติมไบต์ 0x80 ทันทีหลังข้อความ แล้วเติมศูนย์ และสุดท้ายเขียนความยาวต้นฉบับเป็น 64 บิต"}
          </p>
          <Legend
            items={[
              {
                color: "var(--orange-tint)",
                border: "var(--orange-soft)",
                text: isEn ? "Original message" : "ข้อความเดิม",
              },
              {
                color: "var(--teal-soft)",
                border: "var(--teal)",
                text: isEn ? "End marker (0x80)" : "ตัวบอกจุดสิ้นสุด (0x80)",
              },
              {
                color: "var(--rule-soft)",
                border: "var(--rule)",
                text: isEn ? "Zero padding" : "ศูนย์ที่เติม",
              },
              {
                color: "#FCE0E0",
                border: "#E89090",
                text: isEn ? "Length (64 bits)" : "ความยาว (64 บิต)",
              },
            ]}
          />
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--rule)",
            borderRadius: "var(--r-lg)",
            padding: 20,
          }}
        >
          <ByteGrid
            bytes={paddedBytes}
            label={
              isEn
                ? `padded → ${total} bytes`
                : `padded → ${total} ไบต์`
            }
            highlightFn={(_, i) => {
              if (i < originalLen)
                return {
                  bg: "var(--orange-tint)",
                  border: "var(--orange-soft)",
                  color: "var(--orange-deep)",
                };
              if (i === originalLen)
                return {
                  bg: "var(--teal-soft)",
                  border: "var(--teal)",
                  color: "var(--teal)",
                };
              if (i >= total - 8)
                return {
                  bg: "#FCE0E0",
                  border: "#E89090",
                  color: "var(--red)",
                };
              return {
                bg: "var(--rule-soft)",
                border: "var(--rule)",
                color: "var(--ink-mute)",
              };
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ── Stage 2: Schedule ─────────────────────────────────────────────────────────

function StageSchedule({
  schedule,
  isEn,
}: {
  schedule: number[];
  isEn: boolean;
}) {
  return (
    <section>
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 3vw, 32px)",
            letterSpacing: "-0.02em",
            fontWeight: 400,
            marginBottom: 14,
            lineHeight: 1.15,
          }}
        >
          {isEn ? (
            <>
              Expand to{" "}
              <em style={{ color: "var(--orange-deep)" }}>64 words</em>.
            </>
          ) : (
            <>
              ขยายเป็น{" "}
              <em style={{ color: "var(--orange-deep)" }}>64 คำ</em>
            </>
          )}
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--ink-soft)",
            lineHeight: 1.65,
            maxWidth: 680,
          }}
        >
          {isEn
            ? "Each 512-bit block gives 16 × 32-bit words (W[0]–W[15]). SHA-256 expands these to 64 words by mixing earlier values with rotation (σ₀, σ₁) and XOR. Each new word depends on four previous ones."
            : "บล็อก 512 บิตแต่ละบล็อกให้ 16 คำ 32 บิต (W[0]–W[15]) SHA-256 ขยายเป็น 64 คำโดยผสมค่าก่อนหน้าด้วย rotation (σ₀, σ₁) และ XOR แต่ละคำใหม่ขึ้นอยู่กับสี่คำก่อนหน้า"}
        </p>
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--r-lg)",
          padding: 24,
        }}
      >
        <WordGrid words={schedule} />
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 24,
            fontSize: 12,
            color: "var(--ink-mute)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>
            <span style={{ color: "var(--orange-deep)" }}>●</span>{" "}
            {isEn ? "from message block (W[0]–W[15])" : "จากบล็อกข้อมูล"}
          </span>
          <span>
            <span style={{ color: "var(--ink-soft)" }}>●</span>{" "}
            {isEn ? "derived via σ₀ ⊕ σ₁ (W[16]–W[63])" : "ขยายผ่าน σ₀ ⊕ σ₁"}
          </span>
        </div>
      </div>

      {/* Formula card */}
      <div
        style={{
          marginTop: 20,
          padding: "16px 20px",
          background: "var(--bg-card)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--r-md)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.8,
          color: "var(--ink-soft)",
        }}
      >
        <div style={{ color: "var(--ink)", marginBottom: 4 }}>
          W[i] = σ₁(W[i−2]) + W[i−7] + σ₀(W[i−15]) + W[i−16]
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-mute)" }}>
          σ₀(x) = rotr(x,7) ^ rotr(x,18) ^ shr(x,3)
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-mute)" }}>
          σ₁(x) = rotr(x,17) ^ rotr(x,19) ^ shr(x,10)
        </div>
      </div>
    </section>
  );
}

// ── Stage 3: Rounds ───────────────────────────────────────────────────────────

const VAR_LABELS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

function StageRounds({
  blockTrace,
  round,
  setRound,
  isEn,
}: {
  blockTrace: ReturnType<typeof sha256trace>["blocks"][0];
  round: number;
  setRound: (r: number) => void;
  isEn: boolean;
}) {
  const r = blockTrace.rounds[round];
  const vars = [r.a, r.b, r.c, r.d, r.e, r.f, r.g, r.h];

  return (
    <section>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ maxWidth: 600 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3vw, 32px)",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              marginBottom: 12,
              lineHeight: 1.15,
            }}
          >
            {isEn ? (
              <>
                The{" "}
                <em style={{ color: "var(--orange-deep)" }}>64 rounds</em> of
                compression.
              </>
            ) : (
              <>
                <em style={{ color: "var(--orange-deep)" }}>64 รอบ</em>{" "}
                ของการบีบอัด
              </>
            )}
          </h2>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.65 }}>
            {isEn
              ? "Each round mixes W[i], constant K[i], and the 8 working variables (a–h) using Σ₁, Ch, Maj, and Σ₀ functions. Scrub the slider to step through all 64 rounds."
              : "แต่ละรอบผสม W[i], ค่าคงที่ K[i] และตัวแปร 8 ตัว (a–h) ด้วย Σ₁, Ch, Maj และ Σ₀ ลากแถบเพื่อดูทุกรอบ"}
          </p>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            padding: "8px 16px",
            background: "var(--orange-tint)",
            color: "var(--orange-deep)",
            borderRadius: 999,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {isEn ? "Round" : "รอบที่"} {round} / 63
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--r-lg)",
          padding: 28,
        }}
      >
        {/* Working variables a–h */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 10,
            marginBottom: 28,
          }}
          className="max-sm:grid-cols-4"
        >
          {vars.map((val, i) => (
            <div
              key={i}
              style={{
                padding: "14px 8px",
                background: "var(--bg)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--r-md)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 22,
                  color: "var(--orange-deep)",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {VAR_LABELS[i]}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink)",
                  wordBreak: "break-all",
                }}
              >
                {hex8(val)}
              </div>
            </div>
          ))}
        </div>

        {/* Round scrubber */}
        <input
          type="range"
          min={0}
          max={63}
          value={round}
          onChange={(e) => setRound(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--orange)" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-mute)",
            marginTop: 4,
          }}
        >
          <span>Round 0</span>
          <span>Round 63</span>
        </div>

        {/* Round operations */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "var(--bg)",
            borderRadius: "var(--r-sm)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.8,
            color: "var(--ink-soft)",
          }}
        >
          <div>
            T1 = h + Σ₁(e) + Ch(e,f,g) + K[{round}] + W[{round}]
          </div>
          <div>T2 = Σ₀(a) + Maj(a,b,c)</div>
          <div style={{ color: "var(--orange-deep)", marginTop: 4 }}>
            (a,b,c,d,e,f,g,h) ← (T1+T2, a, b, c, d+T1, e, f, g)
          </div>
        </div>

        {/* Values row */}
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
          className="max-sm:grid-cols-1"
        >
          {[
            {
              label: `W[${round}]`,
              value: `0x${hex8(r.w)}`,
              note: isEn ? "from schedule" : "จาก schedule",
            },
            {
              label: `K[${round}]`,
              value: `0x${hex8(r.k)}`,
              note: isEn ? "round constant" : "ค่าคงที่รอบ",
            },
            {
              label: "T1",
              value: `0x${hex8(r.t1)}`,
              note: isEn ? "temp value 1" : "ค่าชั่วคราว 1",
            },
          ].map(({ label, value, note }) => (
            <div
              key={label}
              style={{
                padding: "10px 14px",
                background: "var(--orange-tint)",
                border: "1px solid var(--orange-soft)",
                borderRadius: "var(--r-sm)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--orange-deep)",
                  opacity: 0.7,
                  marginBottom: 2,
                }}
              >
                {label} — {note}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--orange-deep)",
                  fontWeight: 500,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stage 4: Digest ───────────────────────────────────────────────────────────

function StageDigest({
  hash,
  input,
  finalState,
  isEn,
}: {
  hash: string;
  input: string;
  finalState: number[];
  isEn: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 3vw, 32px)",
          letterSpacing: "-0.02em",
          fontWeight: 400,
          marginBottom: 16,
          lineHeight: 1.15,
        }}
      >
        {isEn ? (
          <>
            And here is your{" "}
            <em style={{ color: "var(--orange-deep)" }}>fingerprint</em>.
          </>
        ) : (
          <>
            นี่คือ{" "}
            <em style={{ color: "var(--orange-deep)" }}>ลายนิ้วมือ</em> ของคุณ
          </>
        )}
      </h2>
      <p
        style={{
          fontSize: 16,
          color: "var(--ink-soft)",
          lineHeight: 1.65,
          marginBottom: 32,
          maxWidth: 600,
        }}
      >
        {isEn
          ? "After processing every 512-bit block, the final values of a–h are concatenated. That's 256 bits — 64 hex characters — a unique fingerprint of your input."
          : "หลังประมวลผลทุกบล็อก ค่าสุดท้ายของ a–h ถูกนำมาต่อกัน ได้ 256 บิต = 64 ตัวอักษร hex — ลายนิ้วมือเฉพาะของข้อมูลคุณ"}
      </p>

      {/* Main hash display */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--orange-soft)",
          borderRadius: "var(--r-lg)",
          padding: 32,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          SHA-256(&quot;{input.slice(0, 40)}{input.length > 40 ? "…" : ""}&quot;)
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(13px, 1.6vw, 17px)",
            wordBreak: "break-all",
            lineHeight: 1.65,
            color: "var(--orange-deep)",
            letterSpacing: "0.02em",
            fontWeight: 500,
          }}
        >
          {hash}
        </div>
        <button
          onClick={copy}
          style={{
            marginTop: 16,
            padding: "7px 16px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            background: copied ? "var(--orange)" : "transparent",
            color: copied ? "white" : "var(--ink-mute)",
            border: "1px solid var(--rule)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {copied ? (isEn ? "Copied!" : "คัดลอกแล้ว!") : isEn ? "Copy hash" : "คัดลอกแฮช"}
        </button>
      </div>

      {/* H[0]–H[7] breakdown */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {finalState.map((val, i) => (
          <div
            key={i}
            style={{
              padding: "8px 12px",
              background: "var(--bg-card)",
              border: "1px solid var(--rule)",
              borderRadius: "var(--r-sm)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            <div style={{ opacity: 0.5, marginBottom: 2, fontSize: 10 }}>
              H[{i}]
            </div>
            <div style={{ color: "var(--ink)" }}>{hex8(val)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function Sha256Visualizer() {
  const t = useTranslations("sha256Visualizer");
  const locale = useLocale();
  const isEn = locale === "en";

  const [input, setInput] = useState("abc");
  const [stage, setStage] = useState(0);
  const [round, setRound] = useState(0);

  const trace = useMemo(() => sha256trace(input), [input]);
  const blockTrace = trace.blocks[0];

  const msgBytes = useMemo(
    () => Array.from(new TextEncoder().encode(input)),
    [input]
  );

  const paddedBytes = useMemo(
    () => Array.from(trace.allPaddedBytes.slice(0, 64)),
    [trace]
  );

  const stages = [
    { label: isEn ? "Message" : "ข้อความ", code: "M" },
    { label: isEn ? "Padding" : "Padding", code: "P" },
    { label: isEn ? "Schedule" : "Schedule", code: "W" },
    { label: isEn ? "64 Rounds" : "64 รอบ", code: "R" },
    { label: isEn ? "Digest" : "ผลลัพธ์", code: "H" },
  ];

  const finalState = trace.blocks[trace.blocks.length - 1].finalState;

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* ── Tool header ─────────────────────────────────────────── */}
      <header
        style={{
          padding: "40px 0 32px",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div className="page">
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--ink-mute)",
              display: "block",
              marginBottom: 24,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            ← {isEn ? "Back to tools" : "กลับ"}
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <span className="pill orange dot">
                  {isEn ? "Tool" : "เครื่องมือ"}
                </span>
                <span className="pill teal">Live</span>
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(36px, 5vw, 56px)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                SHA-256{" "}
                <em style={{ color: "var(--orange-deep)" }}>Visualizer</em>
              </h1>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 17,
                  color: "var(--ink-soft)",
                  maxWidth: 560,
                  lineHeight: 1.55,
                }}
              >
                {isEn
                  ? t("subtitle")
                  : "พิมพ์ข้อความใดก็ได้และติดตามทุกขั้นตอน — padding, schedule expansion, และ 64 รอบของการบีบอัด"}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <button
                className="btn btn-ghost"
                onClick={() => { setInput(""); setRound(0); }}
                style={{ fontSize: 13 }}
              >
                {isEn ? "Reset" : "ล้าง"}
              </button>
              <button
                className="btn"
                onClick={() => navigator.clipboard?.writeText(trace.hash)}
                style={{ fontSize: 13 }}
              >
                {isEn ? "Copy hash" : "คัดลอกแฮช"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Sticky stage stepper ────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 56,
          zIndex: 30,
          background: "var(--bg)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div className="page" style={{ padding: "14px 32px" }}>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              overflowX: "auto",
            }}
          >
            {stages.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button
                  onClick={() => setStage(i)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 500,
                    background:
                      stage === i
                        ? "var(--ink)"
                        : stage > i
                        ? "var(--orange-tint)"
                        : "transparent",
                    color:
                      stage === i
                        ? "var(--bg)"
                        : stage > i
                        ? "var(--orange-deep)"
                        : "var(--ink-mute)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      opacity: 0.65,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.label}
                </button>
                {i < stages.length - 1 && (
                  <div
                    style={{
                      width: 16,
                      height: 1,
                      background: "var(--rule)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="page" style={{ marginTop: 48 }}>
        {/* Always-visible input */}
        <section style={{ marginBottom: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            {isEn ? "Your message" : "ข้อความของคุณ"}
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setRound(0);
            }}
            rows={2}
            spellCheck={false}
            style={{
              width: "100%",
              padding: 20,
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              background: "var(--bg-card)",
              border: "1px solid var(--rule)",
              borderRadius: "var(--r-lg)",
              outline: "none",
              color: "var(--ink)",
              resize: "vertical",
              transition: "border-color 0.15s",
              lineHeight: 1.5,
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--orange)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--rule)")
            }
          />
          <div
            style={{
              marginTop: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--ink-mute)",
            }}
          >
            {msgBytes.length} {isEn ? "bytes" : "ไบต์"} ·{" "}
            {msgBytes.length * 8} {isEn ? "bits" : "บิต"} ·{" "}
            {trace.numBlocks} × 512-bit {isEn ? "block(s)" : "บล็อก"}
          </div>
        </section>

        {/* Stage content */}
        <div key={stage} className="rise">
          {stage === 0 && (
            <StageMessage bytes={msgBytes} isEn={isEn} />
          )}
          {stage === 1 && (
            <StagePadding
              paddedBytes={paddedBytes}
              originalLen={msgBytes.length}
              isEn={isEn}
            />
          )}
          {stage === 2 && (
            <StageSchedule schedule={blockTrace.schedule} isEn={isEn} />
          )}
          {stage === 3 && (
            <StageRounds
              blockTrace={blockTrace}
              round={round}
              setRound={setRound}
              isEn={isEn}
            />
          )}
          {stage === 4 && (
            <StageDigest
              hash={trace.hash}
              input={input}
              finalState={finalState}
              isEn={isEn}
            />
          )}
        </div>

        {/* ── Stage navigation ─────────────────────────────────── */}
        <div
          style={{
            marginTop: 60,
            paddingTop: 24,
            borderTop: "1px solid var(--rule)",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            onClick={() => setStage((s) => Math.max(0, s - 1))}
            disabled={stage === 0}
            className="btn btn-ghost"
            style={{ opacity: stage === 0 ? 0.35 : 1, fontSize: 14 }}
          >
            ← {isEn ? "Previous step" : "ขั้นก่อนหน้า"}
          </button>
          <button
            onClick={() => setStage((s) => Math.min(stages.length - 1, s + 1))}
            disabled={stage === stages.length - 1}
            className="btn btn-orange"
            style={{ opacity: stage === stages.length - 1 ? 0.35 : 1, fontSize: 14 }}
          >
            {isEn ? "Next step" : "ขั้นถัดไป"} →
          </button>
        </div>
      </div>
    </div>
  );
}
