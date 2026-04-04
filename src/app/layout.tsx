// Minimal root layout required by Next.js App Router.
// The actual layout with <html>/<body> is in [locale]/layout.tsx.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
