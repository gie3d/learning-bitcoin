import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LessonLayout } from "@/components/layout/LessonLayout";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { ConceptSection } from "@/components/lesson/ConceptSection";
import { StepExplainer } from "@/components/lesson/StepExplainer";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { HashSandbox } from "@/components/crypto/HashSandbox";
import { RoundSteps } from "@/components/crypto/RoundSteps";
import { OperationsDemo } from "@/components/crypto/OperationsDemo";
import { MessagePaddingDemo } from "@/components/crypto/MessagePaddingDemo";
import { MessageScheduleDemo } from "@/components/crypto/MessageScheduleDemo";

export default function HowSHA256WorksPage() {
  const t = useTranslations("howSha256");

  return (
    <LessonLayout>
      <LessonHeader
        title={t("title")}
        subtitle={t("subtitle")}
        topic={t("topic")}
        readingTime={t("readingTime")}
        lessonNum="Lesson 2 / 3"
      />

      {/* §1 — SHA-256 in three phases */}
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
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              lineHeight: 1.6,
              wordBreak: "break-all",
              color: "var(--orange-deep)",
              padding: "12px 16px",
              background: "var(--bg)",
              borderRadius: "var(--r-sm)",
            }}
          >
            ba7816bf8f01cfea414140de5dae2ec73b00361bbef0469f8f9b64b96d7ff1a
          </div>
          <p style={{ marginTop: 16, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            {t("hookBody")}
          </p>
        </div>

        <p>{t("s1intro")}</p>

        {/* Phase tiles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {(
            [
              { num: "01", labelKey: "s1phase1Label", bodyKey: "s1phase1Body" },
              { num: "02", labelKey: "s1phase2Label", bodyKey: "s1phase2Body" },
              { num: "03", labelKey: "s1phase3Label", bodyKey: "s1phase3Body" },
            ] as const
          ).map(({ num, labelKey, bodyKey }) => (
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
                {t(labelKey)}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: "var(--ink-soft)",
                  lineHeight: 1.55,
                }}
              >
                {t(bodyKey)}
              </div>
            </div>
          ))}
        </div>

        <p>{t("s1tryIt")}</p>
        <HashSandbox />
      </ConceptSection>

      {/* §2 — Padding */}
      <ConceptSection eyebrow="§2" title={t("s2Title")}>
        <p>{t("s2intro")}</p>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: t("step1Title"),
              children: (
                <>
                  <p>{t("step1p1")}</p>
                  <p>{t("step1p2")}</p>
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
                </>
              ),
            },
            {
              number: 3,
              title: t("step3Title"),
              children: (
                <>
                  <p>{t("step3p1")}</p>
                  <MessagePaddingDemo />
                  <Callout variant="info">{t("step3callout")}</Callout>
                </>
              ),
            },
            {
              number: 4,
              title: t("step3bTitle"),
              children: (
                <>
                  <p>{t("step3bp1")}</p>
                  <p>{t("step3bp2")}</p>
                  {/* Block chain diagram */}
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--rule)",
                      borderRadius: "var(--r-lg)",
                      padding: 20,
                    }}
                  >
                    <div className="eyebrow" style={{ marginBottom: 16 }}>
                      {t("step3bChainLabel")}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[1, 2, 3].map((n, i, arr) => (
                        <div key={n}>
                          <div style={{ display: "flex", alignItems: "stretch", gap: 12 }}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid var(--orange-soft)",
                                background: "var(--orange-tint)",
                                borderRadius: 12,
                                padding: "12px 16px",
                                minWidth: 80,
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: 10,
                                  color: "var(--ink-soft)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                Block {n}
                              </span>
                              <span
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: 12,
                                  color: "var(--orange-deep)",
                                  marginTop: 4,
                                }}
                              >
                                512 bits
                              </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                              <span style={{ color: "var(--ink-mute)", fontSize: 12 }}>→</span>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "1px solid var(--teal-soft)",
                                  background: "rgba(44,122,123,0.08)",
                                  borderRadius: 12,
                                  padding: "12px 16px",
                                  flex: 1,
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 10,
                                    color: "var(--teal)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  Compression
                                </span>
                              </div>
                              <span style={{ color: "var(--ink-mute)", fontSize: 12 }}>→</span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid var(--rule)",
                                background: "var(--bg-card)",
                                borderRadius: 12,
                                padding: "12px 16px",
                                minWidth: 80,
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: 10,
                                  color: "var(--ink-soft)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {i === arr.length - 1 ? "Final hash" : "State out"}
                              </span>
                              <span
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: 12,
                                  color: "var(--teal)",
                                  marginTop: 4,
                                }}
                              >
                                256 bits
                              </span>
                            </div>
                          </div>
                          {i < arr.length - 1 && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingRight: "calc(80px / 2 + 12px)",
                                margin: "4px 0",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 10,
                                    color: "var(--ink-mute)",
                                  }}
                                >
                                  becomes initial state
                                </span>
                                <span style={{ color: "var(--ink-mute)", fontSize: 12 }}>↓</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Callout variant="info">{t("step3bExample")}</Callout>
                </>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* §3 — Message schedule */}
      <ConceptSection eyebrow="§3" title={t("s3Title")}>
        <p>{t("s3intro")}</p>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: t("step4Title"),
              children: (
                <>
                  <p>{t("step4p1")}</p>
                  <MessageScheduleDemo />
                </>
              ),
            },
            {
              number: 2,
              title: t("step5Title"),
              children: (
                <>
                  <p>{t("step5p1")}</p>
                  <CodeBlock language="pseudocode">{t("step5code")}</CodeBlock>
                  <Callout variant="insight">{t("step5callout")}</Callout>
                </>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* §4 — Compression */}
      <ConceptSection eyebrow="§4" title={t("s4Title")}>
        <p>{t("s4intro")}</p>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: t("step6Title"),
              children: (
                <>
                  <p>{t("step6p1")}</p>
                  <CodeBlock language="initial values">{t("step6code")}</CodeBlock>
                </>
              ),
            },
            {
              number: 2,
              title: t("step7Title"),
              children: (
                <>
                  <p>{t("step7p1")}</p>
                  <RoundSteps />
                  <OperationsDemo />
                </>
              ),
            },
            {
              number: 3,
              title: t("step8Title"),
              children: (
                <>
                  <p>{t("step8p1")}</p>
                  <Callout variant="warning">{t("step8callout")}</Callout>
                </>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* §5 — Bitcoin context */}
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
              { num: "01", title: t("s5miningTitle"), body: t("s5miningBody") },
              { num: "02", title: t("s5txTitle"), body: t("s5txBody") },
              { num: "03", title: t("s5merkleTitle"), body: t("s5merkleBody") },
              { num: "04", title: t("s5addressTitle"), body: t("s5addressBody") },
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

      {/* Visualizer CTA */}
      <div className="page-narrow" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--rule)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
          }}
        >
          <div
            className="eyebrow"
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--rule-soft)",
              background: "linear-gradient(90deg, var(--orange-tint), var(--bg-card))",
            }}
          >
            {t("visualizerCtaLabel")}
          </div>
          <div
            style={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0, flex: 1 }}>
              {t("visualizerCtaBody")}
            </p>
            <Link
              href="/tools/sha256-visualizer"
              className="btn btn-orange"
              style={{ flexShrink: 0 }}
            >
              {t("visualizerCtaBtn")}
            </Link>
          </div>
        </div>
      </div>

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
            {t("relatedNext")}
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
          href="/lessons/public-private-keys"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 0",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 16, color: "var(--ink-soft)" }}>{t("relatedKeys")}</span>
          <span style={{ color: "var(--ink-mute)", fontSize: 18 }}>→</span>
        </Link>
      </div>
    </LessonLayout>
  );
}
