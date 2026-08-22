import { useTranslations } from "next-intl";
import { LessonLayout } from "@/components/layout/LessonLayout";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { Sha256Visualizer } from "@/components/crypto/Sha256Visualizer";

export default function Sha256VisualizerPage() {
  const t = useTranslations("sha256Visualizer");
  const d = useTranslations("difficulty");

  return (
    <LessonLayout>
      <LessonHeader
        title={t("title")}
        subtitle={t("subtitle")}
        difficultyVariant="intermediate"
        difficultyLabel={d("intermediate")}
        readingTime={t("readingTime")}
        topic={t("topic")}
      />
      <Sha256Visualizer />
    </LessonLayout>
  );
}
