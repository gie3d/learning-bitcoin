import { ProgressBar } from "@/components/ui/ProgressBar";
import { SiteHeader } from "./SiteHeader";

interface LessonLayoutProps {
  children: React.ReactNode;
}

export function LessonLayout({ children }: LessonLayoutProps) {
  return (
    <>
      <ProgressBar />
      <SiteHeader />
      <main className="mx-auto max-w-lesson px-4 sm:px-6 py-12 sm:py-16">
        {children}
      </main>
    </>
  );
}
