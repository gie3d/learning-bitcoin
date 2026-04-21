import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-text-primary hover:opacity-70 transition-opacity"
        >
          <span className="text-xl">🪙</span>
          <span className="text-sm">{t("brand")}</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
