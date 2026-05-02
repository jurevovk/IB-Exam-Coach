import { notFound } from "next/navigation";

import { getEconomicsUnit1Lesson } from "@/lib/economics/unit1Lessons";

import { EconomicsLessonClient } from "./EconomicsLessonClient";

type EconomicsLessonPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export default async function EconomicsLessonPage({
  params,
}: EconomicsLessonPageProps) {
  const { lessonId } = await params;
  const lesson = getEconomicsUnit1Lesson(lessonId);

  if (!lesson) {
    notFound();
  }

  return <EconomicsLessonClient lessonId={lessonId} />;
}
