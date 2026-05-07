interface Step {
  number: number;
  title: string;
  children: React.ReactNode;
}

interface StepExplainerProps {
  steps: Step[];
}

export function StepExplainer({ steps }: StepExplainerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      {steps.map((step) => (
        <div key={step.number} style={{ display: "flex", gap: 24 }}>
          <div style={{ flexShrink: 0, paddingTop: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--orange-deep)",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              {String(step.number).padStart(2, "0")}
            </span>
          </div>
          <div style={{ flex: 1, borderLeft: "1px solid var(--rule)", paddingLeft: 24 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                margin: "0 0 16px",
                color: "var(--ink)",
              }}
            >
              {step.title}
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                fontSize: 16,
                lineHeight: 1.65,
                color: "var(--ink-soft)",
              }}
            >
              {step.children}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
