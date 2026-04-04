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
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.number} className="flex gap-4">
          {/* Connector column */}
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-accent-amber bg-surface text-xs font-mono font-bold text-accent-amber">
              {step.number}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 bg-border my-1" />
            )}
          </div>
          {/* Content */}
          <div className={`pb-8 ${i === steps.length - 1 ? "" : ""}`}>
            <h3 className="text-base font-semibold text-text-primary mb-2 mt-1">
              {step.title}
            </h3>
            <div className="text-sm text-text-secondary leading-relaxed space-y-3">
              {step.children}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
