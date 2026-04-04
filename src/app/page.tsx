import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Badge } from "@/components/ui/Badge";

const lessons = [
  {
    slug: "sha256-irreversibility",
    title: "Why is SHA-256 irreversible?",
    description:
      "Type anything and watch it hash instantly. See why even changing one character flips half the output — and try to guess a hash backwards.",
    difficulty: "intermediate" as const,
    topic: "Cryptography",
    readingTime: "8 min",
    emoji: "🔐",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* Hero */}
        <div className="pt-16 pb-14 text-center">
          <div className="text-6xl mb-6">🪙</div>
          <h1 className="text-5xl sm:text-6xl font-black text-text-primary tracking-tight mb-5 leading-tight">
            Bitcoin,{" "}
            <span className="gradient-text">explained.</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
            Interactive lessons that make cryptography click — type, explore,
            and actually understand how Bitcoin works.
          </p>
        </div>

        {/* Lessons */}
        <div className="pb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-5 text-center">
            Lessons
          </h2>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/lessons/${lesson.slug}`}
                className="group block rounded-3xl border border-border bg-white p-6
                           shadow-card hover:shadow-card-hover
                           transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl shrink-0 mt-0.5">{lesson.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={lesson.difficulty}>{lesson.difficulty}</Badge>
                      <Badge variant="default">{lesson.topic}</Badge>
                      <span className="text-xs text-text-secondary ml-auto">
                        {lesson.readingTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-orange transition-colors mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm"
                >
                  <span className="text-text-secondary text-xs">
                    Live demos · Type to explore
                  </span>
                  <span className="font-semibold text-orange group-hover:translate-x-1 transition-transform inline-block">
                    Start →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
