import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import FileRow from "@/components/file-row";
import { listRecent } from "@/server/db/queries";

export default async function RecentPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const items = await listRecent(userId, 100);

  return (
    <AppShell>
      <div className="px-6 py-4">
        <PageHeader title="Recent" />
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="grid grid-cols-[1fr_180px_140px_120px_88px] items-center border-b border-outline px-6 py-2.5 text-xs font-medium text-muted">
            <div>Name</div>
            <div>Owner</div>
            <div>Last modified</div>
            <div>File size</div>
            <div />
          </div>
          {items.length === 0 ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-outline/60">
              {items.map((f) => (
                <FileRow key={f.id} file={f} />
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
        <Clock className="h-9 w-9 text-muted" />
      </div>
      <h3 className="text-lg font-medium text-ink">No recent files</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Files you upload will show up here, newest first.
      </p>
    </div>
  );
}
