import { Suspense } from "react";

import { RouteFallback } from "@/components/ui/RouteFallback";
import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <RouteFallback title="Ask AI" subtitle="Starting your AI workspace..." />
      }
    >
      <ChatClient />
    </Suspense>
  );
}
