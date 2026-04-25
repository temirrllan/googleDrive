"use client";

import { useTransition } from "react";
import { emptyTrash } from "@/server/actions/file-actions";

export default function EmptyTrashButton({ disabled }: { disabled?: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending || disabled}
      onClick={() => {
        if (!confirm("Permanently delete everything in Trash?")) return;
        start(() => emptyTrash());
      }}
      className="rounded-full border border-outline bg-white px-4 py-1.5 text-sm font-medium text-ink hover:bg-rowHover disabled:opacity-40"
    >
      Empty trash
    </button>
  );
}
