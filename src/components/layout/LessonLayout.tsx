import { ProgressBar } from "@/components/ui/ProgressBar";
import { SiteHeader } from "./SiteHeader";
import { Footer } from "./Footer";

interface LessonLayoutProps {
  children: React.ReactNode;
}

export function LessonLayout({ children }: LessonLayoutProps) {
  return (
    <>
      <ProgressBar />
      <SiteHeader />
      <main style={{ paddingBottom: 100 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
