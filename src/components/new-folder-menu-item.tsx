"use client";

import { useState, useTransition } from "react";
import { FolderPlus, X } from "lucide-react";
import { createFolder } from "@/server/actions/file-actions";

export default function NewFolderMenuItem({
  parentId,
  onDone,
}: {
  parentId: number;
  onDone?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    if (!name.trim()) return;
    start(async () => {
      await createFolder(parentId, name);
      setName("");
      setEditing(false);
      onDone?.();
    });
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex w-full items-center gap-4 px-4 py-2.5 text-sm text-ink hover:bg-rowHover"
      >
        <FolderPlus className="h-4 w-4 text-muted" />
        <span>New folder</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <FolderPlus className="ml-1 h-4 w-4 shrink-0 text-muted" />
      <input
        autoFocus
        value={name}
        placeholder="Untitled folder"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") {
            setEditing(false);
            setName("");
          }
        }}
        className="flex-1 rounded-md border border-outline bg-white px-2 py-1 text-sm text-ink outline-none focus:border-brand"
      />
      <button
        disabled={pending || !name.trim()}
        onClick={submit}
        className="rounded-full px-3 py-1 text-xs font-medium text-brand hover:bg-rowHover disabled:opacity-40"
      >
        Create
      </button>
      <button
        onClick={() => {
          setEditing(false);
          setName("");
        }}
        className="rounded-full p-1 text-muted hover:bg-rowHover"
        aria-label="Cancel"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
