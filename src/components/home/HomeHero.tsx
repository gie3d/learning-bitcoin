"use client";

import { useEffect, useState, useRef } from "react";
import { Link } from "@/i18n/navigation";

interface Props {
  locale: string;
}

const BLOCKS = [
  { idx: 1, label: "genesis", color: "var(--orange)" },
  { idx: 2, label: "block", color: "var(--orange)" },
  { idx: 3, label: "block", color: "var(--orange-deep)" },
  { idx: 4, label: "newest", color: "var(--ink)" },
];

export function HomeHero({ locale }: Props) {
  const isTH = locale === "th";
  const [hash, setHash] = useState("");
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);

  // Compute SHA-256 of "bitcoin" on mount
  useEffect(() => {
    const enc = new TextEncoder().encode("bitcoin");
    crypto.subtle.digest("SHA-256", enc).then((buf) => {
      const bytes = Array.from(new Uint8Array(buf));
      setHash(bytes.map((b) => b.toString(16).padStart(2, "0")).join(""));
    });
  }, []);

  // Animate at ~20fps to keep CPU low
  useEffect(() => {
    function step(ts: number) {
      if (ts - lastRef.current > 50) {
        lastRef.current = ts;
        setTick((t) => t + 1);
      }
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section style={{ padding: "80px 0 60px", position: "relative" }}>
      <div className="page">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left: text */}
          <div>
            <div className="pill orange dot" style={{ marginBottom: 24 }}>
              {isTH ? "บทเรียนแบบโต้ตอบ" : "Interactive lessons"}
            </div>
            <h1 className="display">
              {isTH ? (
                <>
                  เข้าใจ <em>Bitcoin</em>
                  <br />
                  จากหลักการพื้นฐาน
                </>
              ) : (
                <>
                  Bitcoin,
                  <br />
                  <em>actually</em> explained.
                </>
              )}
            </h1>
            <p className="lede" style={{ marginTop: "1.5rem", maxWidth: 520 }}>
              {isTH
                ? "ลองพิมพ์ ลองลาก ลองเล่น — เข้าใจการเข้ารหัส กุญแจ และบล็อกเชนผ่านการทดลองจริงในเบราว์เซอร์"
                : "Type, drag, scrub — understand cryptography, keys, and the blockchain by playing with them, not by reading about them."}
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: "2rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/#lessons" className="btn btn-orange">
                {isTH ? "เริ่มเรียน" : "Start learning"} →
              </Link>
              <Link href="/#tools" className="btn btn-ghost">
                {isTH ? "เปิดเครื่องมือ" : "Open the tools"}
              </Link>
            </div>
            <div
              style={{
                marginTop: "3rem",
                display: "flex",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <Stat n="6" label={isTH ? "บทเรียน" : "lessons"} />
              <Stat n="3" label={isTH ? "เครื่องมือ" : "tools"} />
              <Stat n="≈45" label={isTH ? "นาที" : "minutes"} />
            </div>
          </div>

          {/* Right: animated SVG */}
          <div>
            <div
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                maxWidth: 480,
                marginLeft: "auto",
              }}
            >
              <svg
                viewBox="0 0 400 400"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                <defs>
                  <pattern
                    id="dots"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="2"
                      cy="2"
                      r="1"
                      fill="var(--ink-faint)"
                      opacity="0.4"
                    />
                  </pattern>
                  <filter
                    id="blockShadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                    <feOffset dx="0" dy="4" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.15" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect width="400" height="400" fill="url(#dots)" rx="20" />

                <path
                  d="M 80 200 Q 200 80, 320 200 Q 200 320, 80 200"
                  stroke="var(--orange-soft)"
                  strokeWidth="2"
                  strokeDasharray="4 6"
                  fill="none"
                  opacity="0.7"
                />

                {BLOCKS.map((b, i) => {
                  const angle =
                    tick * 0.005 + i * ((Math.PI * 2) / BLOCKS.length);
                  const cx = 200 + Math.cos(angle) * 120;
                  const cy = 200 + Math.sin(angle) * 120;
                  const isFront = Math.sin(angle) > 0;
                  return (
                    <g
                      key={i}
                      opacity={isFront ? 1 : 0.65}
                      filter="url(#blockShadow)"
                    >
                      <rect
                        x={cx - 32}
                        y={cy - 32}
                        width="64"
                        height="64"
                        rx="10"
                        fill={b.color}
                        stroke="var(--ink)"
                        strokeWidth="1.5"
                      />
                      <text
                        x={cx}
                        y={cy - 2}
                        textAnchor="middle"
                        fill="white"
                        fontFamily="var(--font-mono)"
                        fontSize="10"
                        fontWeight="600"
                      >
                        #{b.idx}
                      </text>
                      <text
                        x={cx}
                        y={cy + 12}
                        textAnchor="middle"
                        fill="white"
                        fontFamily="var(--font-mono)"
                        fontSize="7"
                        opacity="0.85"
                      >
                        {b.label}
                      </text>
                    </g>
                  );
                })}

                <g transform="translate(200, 200)">
                  <circle
                    r="56"
                    fill="var(--bg-card)"
                    stroke="var(--rule)"
                    strokeWidth="1.5"
                  />
                  <text
                    textAnchor="middle"
                    y="-30"
                    fontFamily="var(--font-mono)"
                    fontSize="9"
                    fill="var(--ink-mute)"
                    letterSpacing="0.08em"
                  >
                    SHA-256
                  </text>
                  <text
                    textAnchor="middle"
                    y="-12"
                    fontFamily="var(--font-mono)"
                    fontSize="8"
                    fill="var(--ink-soft)"
                  >
                    &ldquo;bitcoin&rdquo;
                  </text>
                  <text
                    textAnchor="middle"
                    y="6"
                    fontFamily="var(--font-mono)"
                    fontSize="9"
                    fill="var(--ink)"
                    fontWeight="600"
                  >
                    {hash.slice(0, 8) || "..."}
                  </text>
                  <text
                    textAnchor="middle"
                    y="20"
                    fontFamily="var(--font-mono)"
                    fontSize="9"
                    fill="var(--ink)"
                    fontWeight="600"
                  >
                    {hash.slice(8, 16) || ""}
                  </text>
                  <text
                    textAnchor="middle"
                    y="34"
                    fontFamily="var(--font-mono)"
                    fontSize="7"
                    fill="var(--ink-mute)"
                  >
                    ↓ 256-bit
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 36,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {n}
      </div>
      <div className="eyebrow" style={{ marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}
