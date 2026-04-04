import { cn } from "@/lib/utils/cn";

type CalloutVariant = "info" | "warning" | "insight";

interface CalloutProps {
  variant?: CalloutVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<CalloutVariant, string> = {
  info: "border-accent-teal/40 bg-accent-teal/5 text-text-primary",
  warning: "border-warning/40 bg-warning/5 text-text-primary",
  insight: "border-accent-amber/40 bg-accent-amber/5 text-text-primary",
};

const variantIcons: Record<CalloutVariant, string> = {
  info: "ℹ",
  warning: "⚠",
  insight: "◆",
};

export function Callout({
  variant = "info",
  children,
  className,
}: CalloutProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-sm",
        variantStyles[variant],
        className
      )}
    >
      <span className="mt-0.5 shrink-0 font-mono text-xs opacity-60">
        {variantIcons[variant]}
      </span>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
