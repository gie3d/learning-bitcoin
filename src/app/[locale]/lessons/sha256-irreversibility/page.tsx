import { useTranslations } from "next-intl";
import { LessonLayout } from "@/components/layout/LessonLayout";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { ConceptSection } from "@/components/lesson/ConceptSection";
import { StepExplainer } from "@/components/lesson/StepExplainer";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { HashSandbox } from "@/components/crypto/HashSandbox";
import { AvalancheDemo } from "@/components/crypto/AvalancheDemo";
import { ReverseChallenge } from "@/components/crypto/ReverseChallenge";
import { OperationsDemo } from "@/components/crypto/OperationsDemo";

const SHA256_ROUND_CODE = `// One round of SHA-256 (simplified)
function round(a, b, c, d, e, f, g, h, w, k) {
  const S1  = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
  const ch  = (e & f) ^ (~e & g)          // bitwise choice
  const t1  = h + S1 + ch + k + w         // modular addition
  const S0  = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
  const maj = (a & b) ^ (a & c) ^ (b & c) // bitwise majority
  const t2  = S0 + maj

  return [t1 + t2, a, b, c, d + t1, e, f, g]
}
// 64 of these rounds, each feeding into the next.
// No step is invertible — XOR loses bits, modular addition wraps.`;

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
                  <p>{t("step3p1")}</p>
                  <CodeBlock language="pseudocode">{SHA256_ROUND_CODE}</CodeBlock>
                  <OperationsDemo />
                  <p>{t("step3p2")}</p>
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
    </LessonLayout>
  );
}
