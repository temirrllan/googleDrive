"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Folder as FolderIcon, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Folder } from "@/server/db/schema";
import { trashFolder, toggleStar } from "@/server/actions/file-actions";

export default function FolderRow({ folder }: { folder: Folder }) {
  const [pending, start] = useTransition();

  return (
    <li className="group">
      <Link
        href={`/f/${folder.id}`}
        className="grid grid-cols-[1fr_180px_140px_120px_88px] items-center px-6 py-2 text-[14px] text-ink hover:bg-rowHover"
      >
        <div className="flex min-w-0 items-center gap-3">
          <FolderIcon className="h-5 w-5 shrink-0" fill="#5f6368" stroke="#5f6368" />
          <span className="truncate">{folder.name}</span>
        </div>
        <div className="text-muted">me</div>
        <div className="text-muted">{new Date(folder.createdAt).toLocaleDateString()}</div>
        <div className="text-muted">—</div>
        <div className="flex items-center justify-end gap-1">
          <button
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              start(() => toggleStar("folder", folder.id));
            }}
            className={cn(
              "rounded-full p-1.5 hover:bg-hover disabled:opacity-50",
              folder.starred
                ? "text-amber-500"
                : "invisible text-muted hover:text-ink group-hover:visible",
            )}
            aria-label={folder.starred ? "Unstar" : "Star"}
          >
            <Star
              className="h-4 w-4"
              fill={folder.starred ? "currentColor" : "none"}
            />
          </button>
          <button
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              start(() => trashFolder(folder.id));
            }}
            className="invisible rounded-full p-1.5 text-muted hover:bg-hover hover:text-ink group-hover:visible disabled:opacity-50"
            aria-label="Move to trash"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </Link>
    </li>
  );
}
