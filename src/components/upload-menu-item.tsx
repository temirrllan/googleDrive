"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

export default function UploadMenuItem({
  parentId,
  onDone,
}: {
  parentId: number;
  onDone?: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("driveUploader", {
    headers: { "x-parent-id": String(parentId) },
    onClientUploadComplete: () => {
      router.refresh();
      onDone?.();
    },
    onUploadError: (e) => alert(`Upload failed: ${e.message}`),
  });

  return (
    <>
      <button
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center gap-4 px-4 py-2.5 text-sm text-ink hover:bg-rowHover disabled:opacity-50"
      >
        <Upload className="h-4 w-4 text-muted" />
        <span>{isUploading ? "Uploading…" : "File upload"}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) startUpload(Array.from(files));
          e.target.value = "";
        }}
      />
    </>
  );
}
