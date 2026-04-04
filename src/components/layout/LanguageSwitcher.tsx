"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale() {
    const next = locale === "th" ? "en" : "th";
    // pathname is e.g. "/th/lessons/sha256-irreversibility"
    // Replace the locale segment
    const newPath = pathname.replace(`/${locale}`, `/${next}`);
    startTransition(() => {
      router.replace(newPath);
    });
  }

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border
                 text-xs font-semibold text-text-secondary
                 hover:bg-bg-soft hover:text-text-primary
                 transition-colors disabled:opacity-50"
      aria-label="Switch language"
    >
      <span className="text-sm">{locale === "th" ? "🇬🇧" : "🇹🇭"}</span>
      <span>{t("switchLang")}</span>
    </button>
  );
}
