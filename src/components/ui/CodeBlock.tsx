import { cn } from "@/lib/utils/cn";

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

function highlightCode(code: string) {
  // 1. Escape all HTML first to prevent XSS and rendering issues
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Syntax patterns (matching against ESCAPED text)
  const patterns = [
    { name: "comment", regex: /(\/\/.*)/ },
    { name: "keyword", regex: /\b(function|const|return|let|var)\b/ },
    { name: "number", regex: /\b(\d+)\b/ },
    // Match common symbols, including the escaped &amp;
    { name: "operator", regex: /([|^+*/=~-]|&amp;)/ },
    { name: "bracket", regex: /([(){}[\]])/ },
  ];

  // Map patterns to colors
  const classes: Record<string, string> = {
    comment: "text-green/70 italic",
    keyword: "text-blue font-bold",
    number: "text-purple font-medium",
    operator: "text-orange font-bold",
    bracket: "text-text-secondary opacity-40",
  };

  // Create one giant regex with all patterns as capture groups
  const fullRegex = new RegExp(patterns.map((p) => p.regex.source).join("|"), "g");

  // 3. Replace in the already-escaped string
  return escaped.replace(fullRegex, (match, ...args) => {
    const groupIndex = args.findIndex((val, i) => val !== undefined && i < patterns.length);
    if (groupIndex === -1) return match;

    const pattern = patterns[groupIndex];
    return `<span class="${classes[pattern.name]}">${match}</span>`;
  });
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const highlighted = highlightCode(children);

  return (
    <div
      className={cn(
        "bg-code-bg shadow-card border border-code-border rounded-2xl overflow-hidden",
        "sm:-ml-14 sm:-mr-4", // Pull left on sm+ to clear step numbers
        className
      )}
    >
      {language && (
        <div className="flex items-center gap-2 border-b border-code-border bg-code-bg px-4 py-2 sm:px-4 sm:py-2.5">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-orange/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green/40" />
          </div>
          <span className="font-mono text-[11px] sm:text-[12px] font-bold text-text-secondary/60 uppercase tracking-widest ml-2">
            {language}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto p-4 sm:p-5 text-[14px] sm:text-[16px] leading-relaxed">
        <code
          className="font-mono text-code-text"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
