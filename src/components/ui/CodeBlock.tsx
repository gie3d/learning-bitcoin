import { cn } from "@/lib/utils/cn";

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  return (
    <div className={cn("rounded-lg border border-code-border overflow-hidden", className)}>
      {language && (
        <div className="flex items-center gap-2 border-b border-code-border bg-code-bg px-4 py-2">
          <span className="font-mono text-xs text-text-secondary uppercase tracking-widest">
            {language}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto bg-code-bg p-4 text-sm">
        <code className="font-mono text-text-primary leading-relaxed">
          {children}
        </code>
      </pre>
    </div>
  );
}
