import { cn } from "@/lib/utils/cn";

type BadgeVariant = "beginner" | "intermediate" | "advanced" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  beginner: "bg-green-light text-green border-green/20",
  intermediate: "bg-orange-light text-orange border-orange/20",
  advanced: "bg-purple-light text-purple border-purple/20",
  default: "bg-bg-soft text-text-secondary border-border",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
