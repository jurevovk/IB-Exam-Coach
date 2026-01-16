import { Suspense } from "react";

import { RouteFallback } from "@/components/ui/RouteFallback";
import GradeClient from "./GradeClient";

export const dynamic = "force-dynamic";

export default function GradePage() {
  return (
    <Suspense
      fallback={
        <RouteFallback
          title="Grade Answer"
          subtitle="Preparing your grading workspace..."
        />
      }
    >
      <GradeClient />
    </Suspense>
  );
}
