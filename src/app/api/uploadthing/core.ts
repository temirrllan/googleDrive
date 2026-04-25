import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { files, folders } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
  driveUploader: f({
    blob: { maxFileSize: "256MB", maxFileCount: 20 },
  })
    .middleware(async ({ req }) => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");

      const headerParent = req.headers.get("x-parent-id");
      const url = new URL(req.url);
      const queryParent = url.searchParams.get("parentId");
      const parentId = Number(headerParent ?? queryParent);
      if (!Number.isFinite(parentId)) {
        throw new UploadThingError("Missing parentId");
      }

      const [parent] = await db
        .select({ id: folders.id })
        .from(folders)
        .where(and(eq(folders.id, parentId), eq(folders.ownerId, userId)))
        .limit(1);
      if (!parent) throw new UploadThingError("Parent folder not found");

      return { userId, parentId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(files).values({
        name: file.name,
        url: file.ufsUrl,
        key: file.key,
        size: file.size,
        parentId: metadata.parentId,
        ownerId: metadata.userId,
      });
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
