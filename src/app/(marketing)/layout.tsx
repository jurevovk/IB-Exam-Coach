import { MarketingAuthGate } from "@/components/marketing/MarketingAuthGate";
import { MarketingNav } from "@/components/nav/MarketingNav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-text-main">
      <MarketingAuthGate>
        <MarketingNav />
        {children}
      </MarketingAuthGate>
    </div>
  );
}
