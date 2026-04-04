import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-text-primary hover:opacity-70 transition-opacity"
        >
          <span className="text-xl">🪙</span>
          <span className="text-sm">learning-bitcoin</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/lessons/sha256-irreversibility"
            className="px-3 py-1.5 rounded-full text-text-secondary hover:bg-bg-soft hover:text-text-primary transition-colors font-medium"
          >
            SHA-256
          </Link>
        </nav>
      </div>
    </header>
  );
}
