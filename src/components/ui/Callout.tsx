interface CalloutProps {
  variant?: "info" | "warning" | "insight";
  children: React.ReactNode;
  className?: string;
}

export function Callout({ children }: CalloutProps) {
  return (
    <div
      style={{
        borderLeft: "3px solid var(--orange)",
        paddingLeft: 20,
        fontStyle: "italic",
        fontFamily: "var(--font-display)",
        fontSize: 17,
        color: "var(--ink-mute)",
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}
