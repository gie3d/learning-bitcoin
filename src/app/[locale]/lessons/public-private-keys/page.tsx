"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LessonLayout } from "@/components/layout/LessonLayout";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { ConceptSection } from "@/components/lesson/ConceptSection";
import { StepExplainer } from "@/components/lesson/StepExplainer";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PrivateKeyGenerator } from "@/components/crypto/PrivateKeyGenerator";
import { ECPointVisualizer } from "@/components/crypto/ECPointVisualizer";
import { ECDLPChallenge } from "@/components/crypto/ECDLPChallenge";
import { generatePrivateKey } from "@/lib/crypto/secp256k1";

function LivePrivateKey() {
  const [key, setKey] = useState("···");
  useEffect(() => {
    setKey(generatePrivateKey());
  }, []);
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        lineHeight: 1.6,
        wordBreak: "break-all",
        color: "var(--orange-deep)",
      }}
    >
      {key}
    </div>
  );
}

export default function PublicPrivateKeysPage() {
  const t = useTranslations("publicPrivateKey");

  return (
    <LessonLayout>
      <LessonHeader
        title={t("title")}
        subtitle={t("subtitle")}
        topic={t("topic")}
        readingTime={t("readingTime")}
        lessonNum="Lesson 3 / 3"
      />

      {/* §1 — What is a private key? */}
      <ConceptSection eyebrow="§1" title={t("s1Title")}>
        {/* Hook */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--rule)",
            borderRadius: "var(--r-lg)",
            padding: 24,
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {t("hookLabel")}
          </div>
          <div
            style={{
              padding: "12px 16px",
              background: "var(--bg)",
              borderRadius: "var(--r-sm)",
            }}
          >
            <LivePrivateKey />
          </div>
          <p style={{ marginTop: 16, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            {t("hookBody")}
          </p>
        </div>

        <p>{t("s1p1")}</p>
        <p>{t("s1p2")}</p>

        {/* Property tiles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {(
            [
              { num: "01", label: t("s1prop1Label"), body: t("s1prop1Body") },
              { num: "02", label: t("s1prop2Label"), body: t("s1prop2Body") },
              { num: "03", label: t("s1prop3Label"), body: t("s1prop3Body") },
            ] as const
          ).map(({ num, label, body }) => (
            <div
              key={num}
              style={{
                padding: 24,
                border: "1px solid var(--rule)",
                borderRadius: "var(--r-md)",
                background: "var(--bg-card)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--orange-deep)",
                  letterSpacing: "0.05em",
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  marginTop: 8,
                  letterSpacing: "-0.01em",
                  color: "var(--ink)",
                }}
              >
                {label}
              </div>
              <div
                style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}
              >
                {body}
              </div>
            </div>
          ))}
        </div>

        <p>{t("s1tryIt")}</p>
        <PrivateKeyGenerator />
      </ConceptSection>

      {/* §2 — From private key to public key */}
      <ConceptSection eyebrow="§2" title={t("s2Title")}>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: t("step1Title"),
              children: (
                <>
                  <p>{t("step1p1")}</p>
                  <p>{t("step1p2")}</p>
                  <CodeBlock language="secp256k1">{t("step1code")}</CodeBlock>
                  <Callout variant="info">{t("step1callout")}</Callout>
                </>
              ),
            },
            {
              number: 2,
              title: t("step2Title"),
              children: (
                <>
                  <p>{t("step2p1")}</p>
                  <p>{t("step2p2")}</p>
                  <ECPointVisualizer />
                </>
              ),
            },
            {
              number: 3,
              title: t("step3Title"),
              children: (
                <>
                  <p>{t("step3p1")}</p>
                  <CodeBlock language="complexity">{t("step3code")}</CodeBlock>
                  <Callout variant="warning">{t("step3callout")}</Callout>
                </>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* §3 — Try the challenge */}
      <ConceptSection eyebrow="§3" title={t("s3Title")}>
        <p>{t("s3body")}</p>
        <ECDLPChallenge />
        <Callout variant="insight">{t("s3callout")}</Callout>
      </ConceptSection>

      {/* §4 — Address derivation */}
      <ConceptSection eyebrow="§4" title={t("s4Title")}>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: t("step4aTitle"),
              children: (
                <>
                  <p>{t("step4ap1")}</p>
                  <p>{t("step4ap2")}</p>
                  <CodeBlock language="address derivation">{t("step4aCode")}</CodeBlock>
                </>
              ),
            },
            {
              number: 2,
              title: t("step4bTitle"),
              children: (
                <>
                  <p>{t("step4bp1")}</p>
                  <Callout variant="info">{t("step4bcallout")}</Callout>
                </>
              ),
            },
            {
              number: 3,
              title: t("step4cTitle"),
              children: (
                <>
                  {/* Key derivation chain */}
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--rule)",
                      borderRadius: "var(--r-lg)",
                      padding: 20,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid var(--orange-soft)",
                        background: "var(--orange-tint)",
                        borderRadius: 12,
                        padding: "10px 14px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "var(--orange-deep)" }}>
                        Private key
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>
                        random 256-bit
                      </div>
                    </div>
                    <div style={{ textAlign: "center", color: "var(--ink-mute)", fontSize: 12 }}>
                      <div>→ ×G →</div>
                      <div style={{ fontSize: 10, opacity: 0.6 }}>secp256k1</div>
                    </div>
                    <div
                      style={{
                        border: "1px solid var(--rule)",
                        background: "var(--bg-card)",
                        borderRadius: 12,
                        padding: "10px 14px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "var(--teal)" }}>
                        Public key
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>
                        33-byte point
                      </div>
                    </div>
                    <div style={{ textAlign: "center", color: "var(--ink-mute)", fontSize: 12 }}>
                      <div>→ SHA256+RIPEMD160 →</div>
                      <div style={{ fontSize: 10, opacity: 0.6 }}>one-way</div>
                    </div>
                    <div
                      style={{
                        border: "1px solid var(--rule)",
                        background: "var(--bg-card)",
                        borderRadius: 12,
                        padding: "10px 14px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "var(--ink-soft)" }}>
                        Address
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>
                        Base58Check
                      </div>
                    </div>
                  </div>
                  <p>{t("step4cp1")}</p>
                </>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* §5 — Why it matters */}
      <ConceptSection eyebrow="§5" title={t("s5Title")}>
        <p>{t("s5intro")}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {(
            [
              { num: "01", title: t("s5ownershipTitle"), body: t("s5ownershipBody") },
              { num: "02", title: t("s5sigTitle"), body: t("s5sigBody") },
              { num: "03", title: t("s5hdTitle"), body: t("s5hdBody") },
              { num: "04", title: t("s5quantumTitle"), body: t("s5quantumBody") },
            ] as const
          ).map(({ num, title, body }) => (
            <div
              key={num}
              style={{
                padding: 24,
                border: "1px solid var(--rule)",
                borderRadius: "var(--r-md)",
                background: "var(--bg-card)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--orange-deep)",
                  letterSpacing: "0.05em",
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  marginTop: 8,
                  letterSpacing: "-0.01em",
                  color: "var(--ink)",
                }}
              >
                {title}
              </div>
              <div
                style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}
              >
                {body}
              </div>
            </div>
          ))}
        </div>
        <Callout variant="insight">{t("s5callout")}</Callout>
      </ConceptSection>

      {/* Editorial next-lesson nav */}
      <div
        className="page-narrow"
        style={{ marginTop: 80, paddingTop: 40, borderTop: "1px solid var(--rule)" }}
      >
        <div className="eyebrow" style={{ marginBottom: 0 }}>
          {t("relatedLabel")}
        </div>
        <Link
          href="/lessons/sha256-irreversibility"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "24px 0",
            textDecoration: "none",
            borderBottom: "1px solid var(--rule-soft)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              letterSpacing: "-0.015em",
              fontWeight: 400,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {t("relatedIrreversibility")}
          </h3>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 32,
              color: "var(--orange-deep)",
              flexShrink: 0,
              paddingLeft: 24,
            }}
          >
            →
          </span>
        </Link>
        <Link
          href="/lessons/how-sha256-works"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 0",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 16, color: "var(--ink-soft)" }}>{t("relatedHowSha256")}</span>
          <span style={{ color: "var(--ink-mute)", fontSize: 18 }}>→</span>
        </Link>
      </div>
    </LessonLayout>
  );
}
