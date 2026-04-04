import { Badge } from "@/components/ui/Badge";

type DifficultyVariant = "beginner" | "intermediate" | "advanced";

interface LessonHeaderProps {
  title: string;
  subtitle: string;
  difficultyVariant: DifficultyVariant;
  difficultyLabel: string;
  readingTime: string;
  topic: string;
}

export function LessonHeader({
  title,
  subtitle,
  difficultyVariant,
  difficultyLabel,
  readingTime,
  topic,
}: LessonHeaderProps) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Badge variant={difficultyVariant}>{difficultyLabel}</Badge>
        <Badge variant="default">{topic}</Badge>
        <span className="text-sm text-text-secondary ml-auto">{readingTime}</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-5">
        {title}
      </h1>
      <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">{subtitle}</p>
    </div>
  );
}
