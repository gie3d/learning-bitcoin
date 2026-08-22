import { cn } from "@/lib/utils/cn";

type CalloutVariant = "info" | "warning" | "insight";

interface CalloutProps {
  variant?: CalloutVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<CalloutVariant, string> = {
  info: "bg-blue-light border-l-4 border-blue text-text-primary",
  warning: "bg-orange-light border-l-4 border-orange text-text-primary",
  insight: "bg-purple-light border-l-4 border-purple text-text-primary",
};

const variantIcons: Record<CalloutVariant, string> = {
  info: "💡",
  warning: "⚡",
  insight: "✨",
};

export function Callout({
  variant = "info",
  children,
  className,
}: CalloutProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-r-2xl px-4 py-4 text-sm",
        variantStyles[variant],
        className
      )}
    >
      <span className="shrink-0 text-base leading-tight">{variantIcons[variant]}</span>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
