import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between h-14">
        <Link
          href="/"
          className="font-mono text-sm font-medium text-text-primary hover:text-accent-teal transition-colors"
        >
          <span className="text-accent-amber">₿</span> learning-bitcoin
        </Link>
        <nav className="flex items-center gap-4 text-xs font-mono text-text-secondary">
          <Link
            href="/lessons/sha256-irreversibility"
            className="hover:text-text-primary transition-colors"
          >
            SHA-256
          </Link>
        </nav>
      </div>
    </header>
  );
}
