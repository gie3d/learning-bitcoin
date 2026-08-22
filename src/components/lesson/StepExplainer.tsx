interface Step {
  number: number;
  title: string;
  children: React.ReactNode;
}

interface StepExplainerProps {
  steps: Step[];
}

const stepColors = [
  { bg: "bg-orange", text: "text-white", connector: "bg-orange/20" },
  { bg: "bg-purple", text: "text-white", connector: "bg-purple/20" },
  { bg: "bg-blue", text: "text-white", connector: "bg-blue/20" },
];

export function StepExplainer({ steps }: StepExplainerProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const color = stepColors[i % stepColors.length];
        return (
          <div key={step.number} className="flex gap-3 sm:gap-5">
            {/* Connector column */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-bold ${color.bg} ${color.text} shadow-sm`}
              >
                {step.number}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 ${color.connector} my-2`} />
              )}
            </div>
            {/* Content */}
            <div className="pb-8 sm:pb-10 flex-1">
              <h3 className="text-base font-bold text-text-primary mb-3 mt-1.5">
                {step.title}
              </h3>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                {step.children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
