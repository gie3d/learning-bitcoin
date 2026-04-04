import { cn } from "@/lib/utils/cn";

type BadgeVariant = "beginner" | "intermediate" | "advanced" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  beginner: "bg-success/10 text-success border-success/20",
  intermediate: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  advanced: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
  default: "bg-surface text-text-secondary border-border",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono tracking-wide uppercase",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
