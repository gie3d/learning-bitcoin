interface ConceptSectionProps {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}

export function ConceptSection({ eyebrow, title, children }: ConceptSectionProps) {
  return (
    <section style={{ padding: "80px 0", borderBottom: "1px solid var(--rule-soft)" }}>
      <div className="page-narrow">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {eyebrow && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--orange-deep)",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {eyebrow}
            </span>
          )}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>
        <div
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--ink-soft)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
