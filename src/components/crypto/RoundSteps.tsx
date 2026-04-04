"use client";

import { useTranslations } from "next-intl";

export function RoundSteps() {
  const t = useTranslations("roundSteps");

  const steps = [
    { key: "step1", formula: "S1 = rot(e, 6) ^ rot(e, 11) ^ rot(e, 25)", color: "text-blue" },
    { key: "step2", formula: "ch = (e & f) ^ (~e & g)", color: "text-purple" },
    { key: "step3", formula: "t1 = h + S1 + ch + k + w", color: "text-orange" },
    { key: "step4", formula: "S0 = rot(a, 2) ^ rot(a, 13) ^ rot(a, 22)", color: "text-blue" },
    { key: "step5", formula: "maj = (a & b) ^ (a & c) ^ (b & c)", color: "text-green" },
    { key: "step6", formula: "[a', a, b, c, e', e, f, g]", color: "text-orange" },
  ];

  return (
    <div className="space-y-3 my-6">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
        <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
          {t("title")}
        </h4>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {steps.map((s, i) => (
          <div
            key={i}
            className="group relative rounded-2xl border border-border bg-white p-4 transition-all hover:border-orange/20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h5 className="text-[13px] font-bold text-text-primary">
                {t(`${s.key}Title` as any)}
              </h5>
              <code className={`text-[10px] font-mono px-2 py-0.5 rounded-lg bg-bg-soft ${s.color} font-bold border border-border/40 w-fit`}>
                {s.formula}
              </code>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              {t.rich(`${s.key}Desc` as any, {
                c: (chunks) => (
                  <span className="font-mono font-bold text-text-primary px-1 rounded bg-bg-soft border border-border/30">
                    {chunks}
                  </span>
                ),
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
