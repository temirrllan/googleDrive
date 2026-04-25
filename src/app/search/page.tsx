import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import FolderRow from "@/components/folder-row";
import FileRow from "@/components/file-row";
import { searchAll } from "@/server/db/queries";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { q: qRaw } = await searchParams;
  const q = (qRaw ?? "").trim();

  if (!q) {
    return (
      <AppShell>
        <div className="px-6 py-4">
          <PageHeader title="Search" />
          <Empty
            title="Type something into the search bar"
            body="Names match, case-insensitive."
          />
        </div>
      </AppShell>
    );
  }

  const { folders: matchedFolders, files: matchedFiles } = await searchAll(userId, q);
  const empty = matchedFolders.length === 0 && matchedFiles.length === 0;

  return (
    <AppShell>
      <div className="px-6 py-4">
        <PageHeader title={`Results for “${q}”`} />
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="grid grid-cols-[1fr_180px_140px_120px_88px] items-center border-b border-outline px-6 py-2.5 text-xs font-medium text-muted">
            <div>Name</div>
            <div>Owner</div>
            <div>Last modified</div>
            <div>File size</div>
            <div />
          </div>
          {empty ? (
            <Empty
              title={`No matches for “${q}”`}
              body="Try a shorter or simpler term."
            />
          ) : (
            <ul className="divide-y divide-outline/60">
              {matchedFolders.map((f) => (
                <FolderRow key={`fold-${f.id}`} folder={f} />
              ))}
              {matchedFiles.map((f) => (
                <FileRow key={`file-${f.id}`} file={f} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-canvas">
        <Search className="h-9 w-9 text-muted" />
      </div>
      <h3 className="text-lg font-medium text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
    </div>
  );
}
