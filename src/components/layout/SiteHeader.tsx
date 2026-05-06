"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState } from "react";

export function SiteHeader() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"curious" | "builder">("curious");

  const isTH = locale === "th";

  function switchLocale(next: "en" | "th") {
    if (next === locale) return;
    const newPath = pathname.replace(`/${locale}`, `/${next}`);
    startTransition(() => {
      router.replace(newPath);
    });
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <span style={{ transform: "translateY(-1px)", display: "inline-block" }}>₿</span>
          </span>
          <span>
            Bitcoin,{" "}
            <em style={{ fontStyle: "italic", color: "var(--orange-deep)" }}>explained</em>
          </span>
        </Link>

        <nav className="nav">
          <Link href="/#lessons" className="nav-link">
            {isTH ? "บทเรียน" : "Lessons"}
          </Link>
          <Link href="/#tools" className="nav-link">
            {isTH ? "เครื่องมือ" : "Tools"}
          </Link>
        </nav>

        <div
          className="mode-toggle"
          title={isTH ? "โหมดผู้อ่าน" : "Audience mode — affects tone and depth"}
        >
          <button
            className={mode === "curious" ? "active" : ""}
            onClick={() => setMode("curious")}
          >
            {isTH ? "อยากรู้" : "Curious"}
          </button>
          <button
            className={mode === "builder" ? "active" : ""}
            onClick={() => setMode("builder")}
          >
            {isTH ? "นักพัฒนา" : "Builder"}
          </button>
        </div>

        <div className="lang-toggle">
          <button
            className={locale === "en" ? "active" : ""}
            onClick={() => switchLocale("en")}
            disabled={isPending}
          >
            EN
          </button>
          <button
            className={locale === "th" ? "active" : ""}
            onClick={() => switchLocale("th")}
            disabled={isPending}
          >
            TH
          </button>
        </div>
      </div>
    </header>
  );
}
