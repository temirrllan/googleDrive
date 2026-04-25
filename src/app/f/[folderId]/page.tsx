import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { FolderOpen } from "lucide-react";
import {
  getBreadcrumbs,
  getFolder,
  listChildren,
} from "@/server/db/queries";
import AppShell from "@/components/app-shell";
import Breadcrumbs from "@/components/breadcrumbs";
import FolderRow from "@/components/folder-row";
import FileRow from "@/components/file-row";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId: folderIdRaw } = await params;
  const folderId = Number(folderIdRaw);
  if (!Number.isFinite(folderId)) notFound();

  const { userId } = await auth();
  if (!userId) redirect("/");

  const folder = await getFolder(folderId, userId);
  if (!folder) notFound();

  const [{ folders: subfolders, files: childFiles }, trail] = await Promise.all([
    listChildren(folderId, userId),
    getBreadcrumbs(folderId, userId),
  ]);

  const empty = subfolders.length === 0 && childFiles.length === 0;

  return (
    <AppShell parentId={folderId}>
      <div className="px-6 py-4">
        <div className="mb-4">
          <Breadcrumbs trail={trail} />
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="grid grid-cols-[1fr_180px_140px_120px_40px] items-center border-b border-outline px-6 py-2.5 text-xs font-medium text-muted">
            <div>Name</div>
            <div>Owner</div>
            <div>Last modified</div>
            <div>File size</div>
            <div />
          </div>

          {empty ? (
            <EmptyState />
          ) : (
            <ul className="divide-y divide-outline/60">
              {subfolders.map((f) => (
                <FolderRow key={`fold-${f.id}`} folder={f} />
              ))}
              {childFiles.map((f) => (
                <FileRow key={`file-${f.id}`} file={f} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-canvas">
        <FolderOpen className="h-9 w-9 text-muted" />
      </div>
      <h3 className="text-lg font-medium text-ink">A place for all of your files</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Drop files anywhere on this page, or use the &quot;+ New&quot; button.
      </p>
    </div>
  );
}
