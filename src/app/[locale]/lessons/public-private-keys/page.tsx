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
    <p className="font-mono text-sm text-orange break-all leading-relaxed tracking-wide">
      {key}
    </p>
  );
}

export default function PublicPrivateKeysPage() {
  const t = useTranslations("publicPrivateKey");
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
          <LivePrivateKey />
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-sm text-text-secondary leading-relaxed">{t("hookBody")}</p>
        </div>
      </div>

      {/* Section 1 */}
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
              <div
                className={`mt-0.5 h-2 w-2 shrink-0 rounded-full bg-${color}`}
              />
              <div>
                <p className={`text-sm font-semibold text-${color} mb-0.5`}>{label}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-secondary leading-relaxed">{t("s1tryIt")}</p>
        <PrivateKeyGenerator />
      </ConceptSection>

      {/* Section 2 */}
      <ConceptSection title={t("s2Title")}>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: t("step1Title"),
              children: (
                <div className="space-y-3">
                  <p className="text-text-secondary leading-relaxed">{t("step1p1")}</p>
                  <p className="text-text-secondary leading-relaxed">{t("step1p2")}</p>
                  <CodeBlock language="secp256k1">{t("step1code")}</CodeBlock>
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
                  <ECPointVisualizer />
                </div>
              ),
            },
            {
              number: 3,
              title: t("step3Title"),
              children: (
                <div className="space-y-3">
                  <p className="text-text-secondary leading-relaxed">{t("step3p1")}</p>
                  <CodeBlock language="complexity">{t("step3code")}</CodeBlock>
                  <Callout variant="warning">{t("step3callout")}</Callout>
                </div>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* Section 3 */}
      <ConceptSection title={t("s3Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s3body")}</p>
        <ECDLPChallenge />
        <Callout variant="insight">{t("s3callout")}</Callout>
      </ConceptSection>

      {/* Section 4 */}
      <ConceptSection title={t("s4Title")}>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: t("step4aTitle"),
              children: (
                <div className="space-y-3">
                  <p className="text-text-secondary leading-relaxed">{t("step4ap1")}</p>
                  <p className="text-text-secondary leading-relaxed">{t("step4ap2")}</p>
                  <CodeBlock language="address derivation">{t("step4aCode")}</CodeBlock>
                </div>
              ),
            },
            {
              number: 2,
              title: t("step4bTitle"),
              children: (
                <div className="space-y-3">
                  <p className="text-text-secondary leading-relaxed">{t("step4bp1")}</p>
                  <Callout variant="info">{t("step4bcallout")}</Callout>
                </div>
              ),
            },
            {
              number: 3,
              title: t("step4cTitle"),
              children: (
                <div className="space-y-3">
                  {/* Derivation chain diagram */}
                  <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-bg-soft p-4 text-xs">
                    <div className="rounded-xl bg-orange/10 border border-orange/30 px-3 py-2 text-center">
                      <p className="font-semibold text-orange">Private key</p>
                      <p className="font-mono text-text-secondary">random 256-bit</p>
                    </div>
                    <div className="text-center text-text-secondary">
                      <p>→ ×G →</p>
                      <p className="opacity-50 text-[10px]">secp256k1</p>
                    </div>
                    <div className="rounded-xl bg-blue-light border border-blue/30 px-3 py-2 text-center">
                      <p className="font-semibold text-blue">Public key</p>
                      <p className="font-mono text-text-secondary">33-byte point</p>
                    </div>
                    <div className="text-center text-text-secondary">
                      <p>→ SHA256+RIPEMD160 →</p>
                      <p className="opacity-50 text-[10px]">one-way</p>
                    </div>
                    <div className="rounded-xl bg-purple-light border border-purple/30 px-3 py-2 text-center">
                      <p className="font-semibold text-purple">Address</p>
                      <p className="font-mono text-text-secondary">Base58Check</p>
                    </div>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{t("step4cp1")}</p>
                </div>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* Section 5 */}
      <ConceptSection title={t("s5Title")}>
        <p className="text-text-secondary leading-relaxed">{t("s5intro")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              { title: t("s5ownershipTitle"), body: t("s5ownershipBody") },
              { title: t("s5sigTitle"), body: t("s5sigBody") },
              { title: t("s5hdTitle"), body: t("s5hdBody") },
              { title: t("s5quantumTitle"), body: t("s5quantumBody") },
            ]
          ).map(({ title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-bg-soft p-4"
            >
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
            href="/lessons/sha256-irreversibility"
            className="group flex items-center justify-between rounded-2xl bg-bg-soft border border-border p-5 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="font-semibold text-text-primary group-hover:text-orange transition-colors">
              {t("relatedIrreversibility")}
            </span>
            <span className="text-text-secondary group-hover:text-orange transition-colors">→</span>
          </Link>
          <Link
            href="/lessons/how-sha256-works"
            className="group flex items-center justify-between rounded-2xl bg-bg-soft border border-border p-5 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="font-semibold text-text-primary group-hover:text-orange transition-colors">
              {t("relatedHowSha256")}
            </span>
            <span className="text-text-secondary group-hover:text-orange transition-colors">→</span>
          </Link>
        </div>
      </div>
    </LessonLayout>
  );
}
