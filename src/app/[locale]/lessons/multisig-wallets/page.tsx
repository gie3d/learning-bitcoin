"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LessonLayout } from "@/components/layout/LessonLayout";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { ConceptSection } from "@/components/lesson/ConceptSection";
import { StepExplainer } from "@/components/lesson/StepExplainer";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { MultisigVault } from "@/components/crypto/MultisigVault";
import { MultisigConfigExplorer } from "@/components/crypto/MultisigConfigExplorer";

export default function MultisigWalletsPage() {
  const t = useTranslations("multisig");
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
        <div className="bg-code-bg px-5 py-6">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="rounded-2xl border border-orange/40 bg-orange/10 px-3 py-2 text-center">
              <p className="text-2xl">🔑</p>
              <p className="text-[10px] font-semibold text-orange mt-1">{t("hookKey1")}</p>
            </div>
            <div className="rounded-2xl border border-purple/40 bg-purple-light px-3 py-2 text-center">
              <p className="text-2xl">🔑</p>
              <p className="text-[10px] font-semibold text-purple mt-1">{t("hookKey2")}</p>
            </div>
            <div className="rounded-2xl border border-border bg-bg-soft px-3 py-2 text-center opacity-40">
              <p className="text-2xl">🔑</p>
              <p className="text-[10px] font-semibold text-text-secondary mt-1">
                {t("hookKey3")}
              </p>
            </div>
            <p className="text-text-secondary text-lg">→</p>
            <div className="rounded-2xl border border-green/40 bg-green-light px-4 py-3 text-center">
              <p className="text-2xl">🔓</p>
              <p className="text-[10px] font-semibold text-green mt-1">{t("hookUnlock")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-sm text-text-secondary leading-relaxed">{t("hookBody")}</p>
        </div>
      </div>

      {/* Section 1 — what it is */}
      <ConceptSection title={t("s1Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s1p1")}</p>
        <p className="text-text-secondary leading-relaxed">{t("s1p2")}</p>
        <div className="space-y-3">
          {(
            [
              { label: t("s1prop1Label"), body: t("s1prop1Body"), color: "orange" },
              { label: t("s1prop2Label"), body: t("s1prop2Body"), color: "purple" },
              { label: t("s1prop3Label"), body: t("s1prop3Body"), color: "blue" },
            ] as { label: string; body: string; color: "orange" | "purple" | "blue" }[]
          ).map(({ label, body, color }) => (
            <div
              key={label}
              className="flex gap-3 rounded-2xl border border-border bg-bg-soft p-4"
            >
              <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full bg-${color}`} />
              <div>
                <p className={`text-sm font-semibold text-${color} mb-0.5`}>{label}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <Callout variant="info">{t("s1callout")}</Callout>
      </ConceptSection>

      {/* Section 2 — how it works */}
      <ConceptSection title={t("s2Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s2intro")}</p>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: t("step1Title"),
              children: (
                <div className="space-y-3">
                  <p className="text-text-secondary leading-relaxed">{t("step1p1")}</p>
                  <CodeBlock language="redeem script">{t("step1code")}</CodeBlock>
                  <p className="text-text-secondary leading-relaxed">{t("step1p2")}</p>
                  <Callout variant="info">{t("step1callout")}</Callout>
                </div>
              ),
            },
            {
              number: 2,
              title: t("step2Title"),
              children: (
                <div className="space-y-3">
                  <p className="text-text-secondary leading-relaxed">{t("step2p1")}</p>
                  <p className="text-text-secondary leading-relaxed">{t("step2p2")}</p>
                  <CodeBlock language="psbt flow">{t("step2code")}</CodeBlock>
                </div>
              ),
            },
            {
              number: 3,
              title: t("step3Title"),
              children: (
                <div className="space-y-3">
                  <p className="text-text-secondary leading-relaxed">{t("step3p1")}</p>
                  <CodeBlock language="script evaluation">{t("step3code")}</CodeBlock>
                  <Callout variant="warning">{t("step3callout")}</Callout>
                </div>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* Section 3 — interactive vault */}
      <ConceptSection title={t("s3Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s3body")}</p>
        <MultisigVault />
        <Callout variant="insight">{t("s3callout")}</Callout>
      </ConceptSection>

      {/* Section 4 — choosing M and N */}
      <ConceptSection title={t("s4Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s4body")}</p>
        <MultisigConfigExplorer />
        <Callout variant="warning">{t("s4callout")}</Callout>
      </ConceptSection>

      {/* Section 5 — why it matters */}
      <ConceptSection title={t("s5Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s5intro")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: t("s5custodyTitle"), body: t("s5custodyBody") },
            { title: t("s5treasuryTitle"), body: t("s5treasuryBody") },
            { title: t("s5inheritanceTitle"), body: t("s5inheritanceBody") },
            { title: t("s5taprootTitle"), body: t("s5taprootBody") },
          ].map(({ title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-bg-soft p-4">
              <p className="text-sm font-semibold text-text-primary mb-1">{title}</p>
              <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <Callout variant="insight">{t("s5callout")}</Callout>
      </ConceptSection>

      {/* Related lessons */}
      <div className="mt-16 pt-8 border-t border-border">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
          {t("relatedLabel")}
        </p>
        <div className="space-y-3">
          <Link
            href="/lessons/public-private-keys"
            className="group flex items-center justify-between rounded-2xl bg-bg-soft border border-border p-5 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="font-semibold text-text-primary group-hover:text-orange transition-colors">
              {t("relatedKeys")}
            </span>
            <span className="text-text-secondary group-hover:text-orange transition-colors">→</span>
          </Link>
          <Link
            href="/lessons/sha256-irreversibility"
            className="group flex items-center justify-between rounded-2xl bg-bg-soft border border-border p-5 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="font-semibold text-text-primary group-hover:text-orange transition-colors">
              {t("relatedIrreversibility")}
            </span>
            <span className="text-text-secondary group-hover:text-orange transition-colors">→</span>
          </Link>
        </div>
      </div>
    </LessonLayout>
  );
}
