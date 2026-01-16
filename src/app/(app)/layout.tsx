import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceShell sidebar={<WorkspaceSidebar />}>
      {children}
    </WorkspaceShell>
  );
}
