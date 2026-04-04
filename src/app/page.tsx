import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Badge } from "@/components/ui/Badge";

const lessons = [
  {
    slug: "sha256-irreversibility",
    title: "Why is SHA-256 irreversible?",
    description:
      "Understand the three reasons SHA-256 is a one-way function: information destruction, the avalanche effect, and no algebraic inverse. Includes live interactive demos.",
    difficulty: "intermediate" as const,
    topic: "Cryptography",
    readingTime: "8 min",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        {/* Hero */}
        <div className="mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Learning{" "}
            <span className="text-accent-amber">Bitcoin</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-prose leading-relaxed">
            Bitcoin from first principles. No hype, no shortcuts — just clear
            explanations with interactive examples that make the cryptography
            tangible.
          </p>
        </div>

        {/* Lessons */}
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-4">
            Lessons
          </h2>
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/lessons/${lesson.slug}`}
                className="group block rounded-lg border border-border bg-surface
                           p-5 hover:border-accent-teal/40 hover:bg-surface/80
                           transition-colors"
              >
                <div className="flex flex-wrap items-start gap-3 mb-2">
                  <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-teal transition-colors flex-1">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={lesson.difficulty}>{lesson.difficulty}</Badge>
                    <Badge variant="default">{lesson.topic}</Badge>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  {lesson.description}
                </p>
                <div className="text-xs font-mono text-text-secondary/60">
                  {lesson.readingTime} read →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
