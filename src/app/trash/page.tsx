import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";
import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import TrashRow from "@/components/trash-row";
import EmptyTrashButton from "@/components/empty-trash-button";
import { listTrash } from "@/server/db/queries";

export default async function TrashPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { folders: trashedFolders, files: trashedFiles } = await listTrash(userId);
  const empty = trashedFolders.length === 0 && trashedFiles.length === 0;

  return (
    <AppShell>
      <div className="px-6 py-4">
        <PageHeader
          title="Trash"
          action={<EmptyTrashButton disabled={empty} />}
        />
        <p className="mb-3 text-xs text-muted">
          Items in Trash will stay here until you delete them forever.
        </p>
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="grid grid-cols-[1fr_180px_140px_120px_120px] items-center border-b border-outline px-6 py-2.5 text-xs font-medium text-muted">
            <div>Name</div>
            <div>Owner</div>
            <div>Trashed</div>
            <div>File size</div>
            <div />
          </div>
          {empty ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-outline/60">
              {trashedFolders.map((f) => (
                <TrashRow key={`fold-${f.id}`} item={{ kind: "folder", row: f }} />
              ))}
              {trashedFiles.map((f) => (
                <TrashRow key={`file-${f.id}`} item={{ kind: "file", row: f }} />
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
        <Trash2 className="h-9 w-9 text-muted" />
      </div>
      <h3 className="text-lg font-medium text-ink">Trash is empty</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Items you remove will land here and can be restored.
      </p>
    </div>
  );
}
