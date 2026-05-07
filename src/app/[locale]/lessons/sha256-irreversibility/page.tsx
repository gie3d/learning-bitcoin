import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LessonLayout } from "@/components/layout/LessonLayout";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { ConceptSection } from "@/components/lesson/ConceptSection";
import { StepExplainer } from "@/components/lesson/StepExplainer";
import { Callout } from "@/components/ui/Callout";
import { HashSandbox } from "@/components/crypto/HashSandbox";
import { AvalancheDemo } from "@/components/crypto/AvalancheDemo";
import { ReverseChallenge } from "@/components/crypto/ReverseChallenge";
import { OperationsDemo } from "@/components/crypto/OperationsDemo";
import { RoundSteps } from "@/components/crypto/RoundSteps";

export default function SHA256IrreversibilityPage() {
  const t = useTranslations("lesson");

  return (
    <LessonLayout>
      <LessonHeader
        title={t("title")}
        subtitle={t("subtitle")}
        topic={t("topic")}
        readingTime={t("readingTime")}
        lessonNum="Lesson 1 / 3"
      />

      {/* §1 — What is a hash function? */}
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
            b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576f2a97c2d552ea9a8
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
              { num: "01", labelKey: "s1prop1Label", bodyKey: "s1prop1Body" },
              { num: "02", labelKey: "s1prop2Label", bodyKey: "s1prop2Body" },
              { num: "03", labelKey: "s1prop3Label", bodyKey: "s1prop3Body" },
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

      {/* §2 — Why it's irreversible */}
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
                  <Callout variant="insight">{t("step1callout")}</Callout>
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
                  <AvalancheDemo />
                </>
              ),
            },
            {
              number: 3,
              title: t("step3Title"),
              children: (
                <>
                  <p>
                    {t.rich("step3p1", {
                      c: (chunks) => (
                        <code
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "var(--orange-tint)",
                            color: "var(--orange-deep)",
                          }}
                        >
                          {chunks}
                        </code>
                      ),
                    })}
                  </p>
                  <RoundSteps />
                  <OperationsDemo />
                  <p>
                    {t.rich("step3p2", {
                      c: (chunks) => (
                        <code
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "var(--orange-tint)",
                            color: "var(--orange-deep)",
                          }}
                        >
                          {chunks}
                        </code>
                      ),
                    })}
                  </p>
                </>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* §3 — Try it yourself */}
      <ConceptSection eyebrow="§3" title={t("s3Title")}>
        <p>{t("s3body")}</p>
        <HashSandbox />
      </ConceptSection>

      {/* §4 — Try to reverse it */}
      <ConceptSection eyebrow="§4" title={t("s4Title")}>
        <p>{t("s4Body")}</p>
        <ReverseChallenge />
        <Callout variant="warning">{t("s4callout")}</Callout>
      </ConceptSection>

      {/* §5 — Why it matters for Bitcoin */}
      <ConceptSection eyebrow="§5" title={t("s5Title")}>
        <p>{t("s5intro")}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          <div
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
              01
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
              {t("s5miningTitle")}
            </div>
            <div
              style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}
            >
              {t("s5miningBody")}
            </div>
          </div>
          <div
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
              02
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
              {t("s5addressTitle")}
            </div>
            <div
              style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}
            >
              {t("s5addressBody")}
            </div>
          </div>
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
          href="/lessons/how-sha256-works"
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
