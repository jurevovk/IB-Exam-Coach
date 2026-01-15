import { Suspense } from "react";

import { RouteFallback } from "@/components/ui/RouteFallback";
import PracticeClient from "./PracticeClient";

export const dynamic = "force-dynamic";

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <RouteFallback
          title="Practice"
          subtitle="Preparing your practice session..."
        />
      }
    >
      <PracticeClient />
    </Suspense>
  );
}
