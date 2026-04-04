import { Badge } from "@/components/ui/Badge";

type Difficulty = "beginner" | "intermediate" | "advanced";

interface LessonHeaderProps {
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  readingTime: string;
  topic: string;
}

export function LessonHeader({
  title,
  subtitle,
  difficulty,
  readingTime,
  topic,
}: LessonHeaderProps) {
  return (
    <div className="mb-10 pb-8 border-b border-border">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant={difficulty}>{difficulty}</Badge>
        <Badge variant="default">{topic}</Badge>
        <span className="text-xs font-mono text-text-secondary ml-auto">
          {readingTime}
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-3">
        {title}
      </h1>
      <p className="text-lg text-text-secondary leading-relaxed">{subtitle}</p>
    </div>
  );
}
