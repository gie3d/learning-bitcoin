"use client";

import { cn } from "@/lib/utils/cn";
import { diffHashes } from "@/lib/crypto/hashDiff";

interface HashDisplayProps {
  hash: string;
  diffAgainst?: string;
  className?: string;
}

export function HashDisplay({ hash, diffAgainst, className }: HashDisplayProps) {
  if (!hash) {
    return (
      <div className={cn("font-mono text-sm text-text-secondary/40 break-all", className)}>
        {"0".repeat(64)}
      </div>
    );
  }

  const diffs = diffAgainst ? diffHashes(hash, diffAgainst) : null;

  // Split into groups of 8 for readability
  const groups: string[] = [];
  for (let i = 0; i < hash.length; i += 8) {
    groups.push(hash.slice(i, i + 8));
  }

  if (diffs) {
    // Render with per-character diff coloring
    const groupDiffs = [];
    for (let g = 0; g < 8; g++) {
      groupDiffs.push(diffs.slice(g * 8, g * 8 + 8));
    }

    return (
      <div
        className={cn(
          "font-mono text-sm break-all flex flex-wrap gap-x-2 gap-y-1",
          className
        )}
      >
        {groupDiffs.map((group, gi) => (
          <span key={gi} className="whitespace-nowrap">
            {group.map((d, ci) => (
              <span
                key={ci}
                className={
                  d.status === "same"
                    ? "text-accent-teal"
                    : "text-accent-amber"
                }
              >
                {d.char}
              </span>
            ))}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "font-mono text-sm text-text-primary break-all flex flex-wrap gap-x-2 gap-y-1",
        className
      )}
    >
      {groups.map((group, i) => (
        <span key={i} className="whitespace-nowrap opacity-90">
          {group}
        </span>
      ))}
    </div>
  );
}
