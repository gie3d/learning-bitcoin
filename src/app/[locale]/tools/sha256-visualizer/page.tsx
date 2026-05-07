import { ProgressBar } from "@/components/ui/ProgressBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Sha256Visualizer } from "@/components/crypto/Sha256Visualizer";

export default function Sha256VisualizerPage() {
  return (
    <>
      <ProgressBar />
      <SiteHeader />
      <Sha256Visualizer />
      <Footer />
    </>
  );
}
