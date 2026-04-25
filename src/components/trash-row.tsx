"use client";

import { useTransition } from "react";
import {
  Folder as FolderIcon,
  File as FileIcon,
  Undo2,
  Trash,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";
import type { File, Folder } from "@/server/db/schema";
import {
  permanentDeleteFile,
  permanentDeleteFolder,
  restoreFile,
  restoreFolder,
} from "@/server/actions/file-actions";

type Item =
  | { kind: "folder"; row: Folder }
  | { kind: "file"; row: File };

export default function TrashRow({ item }: { item: Item }) {
  const [pending, start] = useTransition();
  const isFolder = item.kind === "folder";
  const name = item.row.name;
  const deletedAt = item.row.deletedAt;

  return (
    <li className="group grid grid-cols-[1fr_180px_140px_120px_120px] items-center px-6 py-2 text-[14px] text-ink hover:bg-rowHover">
      <div className="flex min-w-0 items-center gap-3">
        {isFolder ? (
          <FolderIcon className="h-5 w-5 shrink-0" fill="#5f6368" stroke="#5f6368" />
        ) : (
          <FileIcon className="h-5 w-5 shrink-0 text-muted" />
        )}
        <span className="truncate">{name}</span>
      </div>
      <div className="text-muted">me</div>
      <div className="text-muted">
        {deletedAt ? new Date(deletedAt).toLocaleDateString() : "—"}
      </div>
      <div className="text-muted">
        {item.kind === "file" ? formatBytes(item.row.size) : "—"}
      </div>
      <div className="flex items-center justify-end gap-1">
        <button
          disabled={pending}
          onClick={() =>
            start(() =>
              isFolder ? restoreFolder(item.row.id) : restoreFile(item.row.id),
            )
          }
          className="rounded-full p-1.5 text-muted hover:bg-hover hover:text-ink disabled:opacity-50"
          aria-label="Restore"
          title="Restore"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          disabled={pending}
          onClick={() => {
            if (!confirm(`Delete "${name}" forever?`)) return;
            start(() =>
              isFolder
                ? permanentDeleteFolder(item.row.id)
                : permanentDeleteFile(item.row.id),
            );
          }}
          className="rounded-full p-1.5 text-muted hover:bg-hover hover:text-red-600 disabled:opacity-50"
          aria-label="Delete forever"
          title="Delete forever"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
