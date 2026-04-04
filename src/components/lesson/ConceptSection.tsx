interface ConceptSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ConceptSection({ title, children }: ConceptSectionProps) {
  return (
    <section className="mb-14">
      <h2 className="text-2xl font-bold text-text-primary mb-6">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
