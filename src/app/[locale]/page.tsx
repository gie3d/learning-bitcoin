import Link from "next/link";
import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Badge } from "@/components/ui/Badge";
import { BitcoinLogo } from "@/components/ui/BitcoinLogo";

export default function HomePage() {
  const t = useTranslations("home");
  const d = useTranslations("difficulty");
  const l = useTranslations("lesson");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Hero */}
        <div className="pt-16 pb-14 text-center">
          <BitcoinLogo className="w-16 h-16 mb-6" />
          <h1 className="text-5xl sm:text-6xl font-black text-text-primary tracking-tight mb-5 leading-tight">
            {t("titleLine1")}{" "}
            <span className="gradient-text">{t("titleAccent")}</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Lessons */}
        <div className="pb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-5 text-center">
            {t("lessonsHeading")}
          </h2>
          <div className="space-y-4">
            <Link
              href="/lessons/sha256-irreversibility"
              className="group block rounded-3xl border border-border bg-white p-6
                         shadow-card hover:shadow-card-hover
                         transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0 mt-0.5">🔐</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="intermediate">{d("intermediate")}</Badge>
                    <Badge variant="default">{l("topic")}</Badge>
                    <span className="text-xs text-text-secondary ml-auto">
                      {t("readingTime")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-orange transition-colors mb-2">
                    {t("sha256Title")}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t("sha256Description")}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                <span className="text-text-secondary text-xs">
                  {t("liveDemo")}
                </span>
                <span className="font-semibold text-orange group-hover:translate-x-1 transition-transform inline-block">
                  {t("start")}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
