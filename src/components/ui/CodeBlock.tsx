import { cn } from "@/lib/utils/cn";

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  return (
    <div className={cn("rounded-2xl border border-code-border overflow-hidden shadow-card", className)}>
      {language && (
        <div className="flex items-center gap-2 border-b border-code-border bg-code-bg px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red/40" />
            <div className="w-3 h-3 rounded-full bg-orange/40" />
            <div className="w-3 h-3 rounded-full bg-green/40" />
          </div>
          <span className="font-mono text-xs text-text-secondary ml-2">
            {language}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto bg-code-bg p-5 text-sm">
        <code className="font-mono text-code-text leading-relaxed">
          {children}
        </code>
      </pre>
    </div>
  );
}
