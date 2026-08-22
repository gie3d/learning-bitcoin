"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-20 py-12 border-t border-border bg-bg-soft/30">
      <div className="mx-auto max-w-lesson px-4 text-center">
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg mx-auto">
          {t("support")} ⚡️{" "}
          <span className="block sm:inline mt-2 sm:mt-0">
            <a
              href={`lightning:${t("address")}`}
              className="font-mono font-bold text-orange hover:text-orange-dark transition-colors border-b-2 border-orange/20 hover:border-orange underline-offset-4"
            >
              {t("address")}
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
