import Link from "next/link";
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

export default function HowSHA256WorksPage() {
  const t = useTranslations("howSha256");
  const d = useTranslations("difficulty");

  return (
    <LessonLayout>
      <LessonHeader
        title={t("title")}
        subtitle={t("subtitle")}
        difficultyVariant="intermediate"
        difficultyLabel={d("intermediate")}
        readingTime={t("readingTime")}
        topic={t("topic")}
      />

      {/* Hook */}
      <div className="mb-12 rounded-3xl overflow-hidden shadow-card border border-border">
        <div className="px-5 py-3 text-xs font-semibold text-text-secondary bg-bg-soft">
          {t("hookLabel")}
        </div>
        <div className="bg-code-bg px-5 py-4">
          <p className="font-mono text-sm text-blue break-all leading-relaxed tracking-wide">
            ba7816bf8f01cfea414140de5dae2ec73b00361bbef0469f8f9b64b96d7ff1a
          </p>
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-sm text-text-secondary leading-relaxed">{t("hookBody")}</p>
        </div>
      </div>

      {/* Section 1: Three phases */}
      <ConceptSection title={t("s1Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s1intro")}</p>
        <div className="space-y-3">
          {(
            [
              { key: "s1phase1", color: "text-orange", num: "01" },
              { key: "s1phase2", color: "text-purple", num: "02" },
              { key: "s1phase3", color: "text-blue",   num: "03" },
            ] as const
          ).map(({ key, color, num }) => (
            <div
              key={key}
              className="flex gap-4 rounded-2xl bg-bg-soft border border-border p-4"
            >
              <span className={`font-mono text-xs font-bold shrink-0 mt-0.5 ${color}`}>
                {num}
              </span>
              <span className="text-sm text-text-secondary">
                <strong className="text-text-primary">
                  {t(`${key}Label` as Parameters<typeof t>[0])}
                </strong>{" "}
                — {t(`${key}Body` as Parameters<typeof t>[0])}
              </span>
            </div>
          ))}
        </div>
        <p className="text-text-secondary leading-relaxed">{t("s1tryIt")}</p>
        <HashSandbox />
      </ConceptSection>

      {/* Section 2: Padding */}
      <ConceptSection title={t("s2Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s2intro")}</p>
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
          ]}
        />
      </ConceptSection>

      {/* Section 3: Message Schedule */}
      <ConceptSection title={t("s3Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s3intro")}</p>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: t("step4Title"),
              children: <p>{t("step4p1")}</p>,
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

      {/* Section 4: Compression */}
      <ConceptSection title={t("s4Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s4intro")}</p>
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

      {/* Section 5: Bitcoin context */}
      <ConceptSection title={t("s5Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s5intro")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-border bg-orange-light p-5">
            <div className="text-2xl mb-3">⛏️</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">{t("s5miningTitle")}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{t("s5miningBody")}</p>
          </div>
          <div className="rounded-3xl border border-border bg-bg-soft p-5">
            <div className="text-2xl mb-3">📜</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">{t("s5txTitle")}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{t("s5txBody")}</p>
          </div>
          <div className="rounded-3xl border border-border bg-purple-light p-5">
            <div className="text-2xl mb-3">🌳</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">{t("s5merkleTitle")}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{t("s5merkleBody")}</p>
          </div>
          <div className="rounded-3xl border border-border bg-blue-light p-5">
            <div className="text-2xl mb-3">🔑</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">{t("s5addressTitle")}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{t("s5addressBody")}</p>
          </div>
        </div>
        <Callout variant="insight">{t("s5callout")}</Callout>
      </ConceptSection>

      {/* Related lesson */}
      <div className="mt-16 pt-8 border-t border-border">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
          {t("relatedLabel")}
        </p>
        <Link
          href="/lessons/sha256-irreversibility"
          className="group flex items-center justify-between rounded-2xl bg-bg-soft border border-border p-5 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="font-semibold text-text-primary group-hover:text-orange transition-colors">
            {t("relatedNext")}
          </span>
          <span className="text-text-secondary group-hover:text-orange transition-colors">→</span>
        </Link>
      </div>
    </LessonLayout>
  );
}
