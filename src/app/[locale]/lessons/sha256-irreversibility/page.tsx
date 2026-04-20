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
            b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576f2a97c2d552ea9a8
          </p>
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            {t("hookBody")}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <ConceptSection title={t("s1Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s1p1")}</p>
        <p className="text-text-secondary leading-relaxed">{t("s1p2")}</p>
        <div className="space-y-3">
          {(
            [
              { key: "s1prop1", color: "text-orange" },
              { key: "s1prop2", color: "text-purple" },
              { key: "s1prop3", color: "text-blue" },
            ] as const
          ).map(({ key, color }, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl bg-bg-soft border border-border p-4"
            >
              <span
                className={`font-mono text-xs font-bold shrink-0 mt-0.5 ${color}`}
              >
                0{i + 1}
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

      {/* Section 2 */}
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
                  <p className="text-text-secondary leading-relaxed">
                    {t.rich("step3p1", {
                      c: (chunks) => (
                        <code className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe]">
                          {chunks}
                        </code>
                      ),
                    })}
                  </p>
                  <RoundSteps />
                  <OperationsDemo />
                  <p className="text-text-secondary leading-relaxed">
                    {t.rich("step3p2", {
                      c: (chunks) => (
                        <code className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[#faf5ff] text-[#7e22ce] border border-[#f3e8ff]">
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

      {/* Section 3 */}
      <ConceptSection title={t("s3Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s3body")}</p>
        <HashSandbox />
      </ConceptSection>

      {/* Section 5 */}
      <ConceptSection title={t("s4Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s4Body")}</p>
        <ReverseChallenge />
        <Callout variant="warning">{t("s4callout")}</Callout>
      </ConceptSection>

      {/* Section 6 */}
      <ConceptSection title={t("s5Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s5intro")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-border bg-orange-light p-5">
            <div className="text-2xl mb-3">⛏️</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">
              {t("s5miningTitle")}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t("s5miningBody")}
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-purple-light p-5">
            <div className="text-2xl mb-3">🔑</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">
              {t("s5addressTitle")}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t("s5addressBody")}
            </p>
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
          href="/lessons/how-sha256-works"
          className="group flex items-center justify-between rounded-2xl bg-bg-soft border border-border p-5 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="font-semibold text-text-primary group-hover:text-orange transition-colors">
            {t("relatedNext")}
          </span>
          <span className="text-text-secondary group-hover:text-orange transition-colors">→</span>
        </Link>
        <Link
          href="/lessons/public-private-keys"
          className="group flex items-center justify-between rounded-2xl bg-bg-soft border border-border p-5 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="font-semibold text-text-primary group-hover:text-orange transition-colors">
            {t("relatedKeys")}
          </span>
          <span className="text-text-secondary group-hover:text-orange transition-colors">→</span>
        </Link>
      </div>
    </LessonLayout>
  );
}
