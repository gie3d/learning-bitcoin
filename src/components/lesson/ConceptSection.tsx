interface ConceptSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ConceptSection({ title, children }: ConceptSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-text-primary mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
