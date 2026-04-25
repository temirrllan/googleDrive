"use client";

import { useTransition } from "react";
import {
  File as FileIcon,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Star,
  Trash2,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import type { File } from "@/server/db/schema";
import { trashFile, toggleStar } from "@/server/actions/file-actions";

function pickIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext))
    return { Icon: FileImage, color: "#a142f4" };
  if (["mp4", "mov", "webm", "avi", "mkv"].includes(ext))
    return { Icon: FileVideo, color: "#f06292" };
  if (["mp3", "wav", "ogg", "flac", "m4a"].includes(ext))
    return { Icon: FileAudio, color: "#26a69a" };
  if (["pdf"].includes(ext)) return { Icon: FileText, color: "#ea4335" };
  if (["doc", "docx", "txt", "md"].includes(ext))
    return { Icon: FileText, color: "#1a73e8" };
  if (["xls", "xlsx", "csv"].includes(ext))
    return { Icon: FileText, color: "#0f9d58" };
  return { Icon: FileIcon, color: "#5f6368" };
}

export default function FileRow({ file }: { file: File }) {
  const [pending, start] = useTransition();
  const { Icon, color } = pickIcon(file.name);

  return (
    <li className="group">
      <a
        href={file.url}
        target="_blank"
        rel="noreferrer"
        className="grid grid-cols-[1fr_180px_140px_120px_88px] items-center px-6 py-2 text-[14px] text-ink hover:bg-rowHover"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Icon className="h-5 w-5 shrink-0" stroke={color} />
          <span className="truncate">{file.name}</span>
        </div>
        <div className="text-muted">me</div>
        <div className="text-muted">{new Date(file.createdAt).toLocaleDateString()}</div>
        <div className="text-muted">{formatBytes(file.size)}</div>
        <div className="flex items-center justify-end gap-1">
          <button
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              start(() => toggleStar("file", file.id));
            }}
            className={cn(
              "rounded-full p-1.5 hover:bg-hover disabled:opacity-50",
              file.starred
                ? "text-amber-500"
                : "invisible text-muted hover:text-ink group-hover:visible",
            )}
            aria-label={file.starred ? "Unstar" : "Star"}
          >
            <Star
              className="h-4 w-4"
              fill={file.starred ? "currentColor" : "none"}
            />
          </button>
          <button
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              start(() => trashFile(file.id));
            }}
            className="invisible rounded-full p-1.5 text-muted hover:bg-hover hover:text-ink group-hover:visible disabled:opacity-50"
            aria-label="Move to trash"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </a>
    </li>
  );
}
