"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  HardDrive,
  Clock,
  Star,
  Trash2,
  Cloud,
} from "lucide-react";
import { cn, formatBytes, STORAGE_LIMIT } from "@/lib/utils";
import NewFolderMenuItem from "./new-folder-menu-item";
import UploadMenuItem from "./upload-menu-item";

type IconType = React.ComponentType<{ className?: string }>;

export default function Sidebar({
  parentId,
  rootId,
  storageUsedBytes,
}: {
  parentId: number;
  rootId: number;
  storageUsedBytes: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isMyDrive = path === "/drive" || path.startsWith("/f/");
  const pct = Math.min(100, (storageUsedBytes / STORAGE_LIMIT) * 100);

  return (
    <aside className="flex h-full flex-col px-3 py-4">
      <div className="relative px-1" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-4 rounded-2xl bg-newBtnBg px-4 py-4 text-sm font-medium text-newBtnText shadow-newBtn transition hover:bg-newBtnHover hover:shadow-card"
        >
          <Plus className="h-6 w-6" />
          <span className="pr-2 text-[15px]">New</span>
        </button>
        {open && (
          <div className="absolute left-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-xl bg-white py-2 shadow-menu">
            <NewFolderMenuItem parentId={parentId} onDone={() => setOpen(false)} />
            <div className="my-1 h-px bg-outline" />
            <UploadMenuItem parentId={parentId} onDone={() => setOpen(false)} />
          </div>
        )}
      </div>

      <nav className="mt-4 flex-1 space-y-0.5">
        <NavLink href={`/f/${rootId}`} icon={HardDrive} label="My Drive" active={isMyDrive} />
        <NavLink href="/recent" icon={Clock} label="Recent" active={path.startsWith("/recent")} />
        <NavLink href="/starred" icon={Star} label="Starred" active={path.startsWith("/starred")} />
        <NavLink href="/trash" icon={Trash2} label="Trash" active={path.startsWith("/trash")} />
      </nav>

      <div className="mt-2 border-t border-outline pt-3">
        <div className="flex items-center gap-5 px-6 py-2 text-[14px] font-medium text-ink">
          <Cloud className="h-5 w-5 text-muted" />
          <span>Storage</span>
        </div>
        <div className="px-6 pb-1 pt-1">
          <div className="h-1 w-full overflow-hidden rounded-full bg-outline">
            <div
              className="h-full rounded-full bg-brand transition-[width]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-muted">
            {formatBytes(storageUsedBytes)} of {formatBytes(STORAGE_LIMIT)} used
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: IconType;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-5 rounded-r-full px-6 py-2 text-[14px] font-medium text-ink transition hover:bg-rowHover",
        active && "bg-selected hover:bg-selected",
      )}
    >
      <Icon className="h-5 w-5 text-muted" />
      <span>{label}</span>
    </Link>
  );
}
