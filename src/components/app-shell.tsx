import { auth } from "@clerk/nextjs/server";
import { getOrCreateRootFolder, storageUsed } from "@/server/db/queries";
import AppTopbar from "./app-topbar";
import Sidebar from "./sidebar";

export default async function AppShell({
  parentId,
  children,
}: {
  parentId?: number;
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) return <>{children}</>;
  const root = await getOrCreateRootFolder(userId);
  const used = await storageUsed(userId);
  const effectiveParent = parentId ?? root.id;

  return (
    <div className="grid h-screen grid-rows-[64px_1fr] bg-white">
      <AppTopbar />
      <div className="grid grid-cols-[256px_1fr] overflow-hidden">
        <Sidebar parentId={effectiveParent} rootId={root.id} storageUsedBytes={used} />
        <main className="overflow-y-auto rounded-tl-2xl bg-canvas">{children}</main>
      </div>
    </div>
  );
}
