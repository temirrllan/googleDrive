import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Folder } from "@/server/db/schema";

export default function Breadcrumbs({ trail }: { trail: Folder[] }) {
  return (
    <h1 className="flex items-center gap-1 text-[22px] font-normal text-ink">
      {trail.map((f, i) => {
        const last = i === trail.length - 1;
        return (
          <span key={f.id} className="flex items-center gap-1">
            {i > 0 && <span className="px-1 text-muted">{">"}</span>}
            {last ? (
              <span className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-hover">
                {f.name}
                <ChevronDown className="h-4 w-4 text-muted" />
              </span>
            ) : (
              <Link
                href={`/f/${f.id}`}
                className="rounded-md px-2 py-1 hover:bg-hover"
              >
                {f.name}
              </Link>
            )}
          </span>
        );
      })}
    </h1>
  );
}
