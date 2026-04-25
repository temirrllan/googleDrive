import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import FolderRow from "@/components/folder-row";
import FileRow from "@/components/file-row";
import { listStarred } from "@/server/db/queries";

export default async function StarredPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { folders: starredFolders, files: starredFiles } = await listStarred(userId);
  const empty = starredFolders.length === 0 && starredFiles.length === 0;

  return (
    <AppShell>
      <div className="px-6 py-4">
        <PageHeader title="Starred" />
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="grid grid-cols-[1fr_180px_140px_120px_88px] items-center border-b border-outline px-6 py-2.5 text-xs font-medium text-muted">
            <div>Name</div>
            <div>Owner</div>
            <div>Last modified</div>
            <div>File size</div>
            <div />
          </div>
          {empty ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-outline/60">
              {starredFolders.map((f) => (
                <FolderRow key={`fold-${f.id}`} folder={f} />
              ))}
              {starredFiles.map((f) => (
                <FileRow key={`file-${f.id}`} file={f} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-canvas">
        <Star className="h-9 w-9 text-muted" />
      </div>
      <h3 className="text-lg font-medium text-ink">Nothing starred yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Hover an item and click the star to keep it handy here.
      </p>
    </div>
  );
}
