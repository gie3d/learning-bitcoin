"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface LessonHeaderProps {
  title: string;
  subtitle: string;
  topic: string;
  readingTime: string;
  lessonNum?: string;
  backHref?: string;
  backLabel?: string;
}

export function LessonHeader({
  title,
  subtitle,
  topic,
  readingTime,
  lessonNum,
  backHref = "/",
  backLabel = "Back to lessons",
}: LessonHeaderProps) {
  const d = useTranslations("difficulty");

  return (
    <header style={{ padding: "60px 0 80px", borderBottom: "1px solid var(--rule)" }}>
      <div className="page-narrow">
        <Link
          href={backHref}
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--ink-mute)",
            marginBottom: 32,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          ← {backLabel}
        </Link>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <span className="pill orange dot">{topic}</span>
          <span className="pill">{readingTime}</span>
          {lessonNum && <span className="pill">{lessonNum}</span>}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          {title}
        </h1>

        <p className="lede" style={{ marginTop: 24, maxWidth: 580 }}>
          {subtitle}
        </p>

        <div
          style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--ink-mute)",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--orange-soft)",
              flexShrink: 0,
            }}
          />
          <span>By the bitcoin-explained collective · {d("pendingReview")}</span>
        </div>
      </div>
    </header>
  );
}
