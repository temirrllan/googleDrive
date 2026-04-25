"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { db } from "@/server/db";
import { files, folders } from "@/server/db/schema";

const utapi = new UTApi();

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function bumpAll() {
  for (const path of ["/recent", "/starred", "/trash"]) revalidatePath(path);
}

export async function createFolder(parentId: number, name: string) {
  const userId = await requireUser();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name required");

  const [parent] = await db
    .select({ id: folders.id })
    .from(folders)
    .where(and(eq(folders.id, parentId), eq(folders.ownerId, userId)))
    .limit(1);
  if (!parent) throw new Error("Parent not found");

  await db.insert(folders).values({ name: trimmed, parentId, ownerId: userId });
  revalidatePath(`/f/${parentId}`);
}

export async function trashFile(fileId: number) {
  const userId = await requireUser();
  const [row] = await db
    .select({ parentId: files.parentId })
    .from(files)
    .where(and(eq(files.id, fileId), eq(files.ownerId, userId)))
    .limit(1);
  if (!row) throw new Error("File not found");

  await db
    .update(files)
    .set({ deletedAt: new Date() })
    .where(eq(files.id, fileId));
  revalidatePath(`/f/${row.parentId}`);
  bumpAll();
}

export async function trashFolder(folderId: number) {
  const userId = await requireUser();
  const [target] = await db
    .select({ parentId: folders.parentId })
    .from(folders)
    .where(and(eq(folders.id, folderId), eq(folders.ownerId, userId)))
    .limit(1);
  if (!target) throw new Error("Folder not found");
  if (target.parentId == null) throw new Error("Cannot trash root folder");

  await db
    .update(folders)
    .set({ deletedAt: new Date() })
    .where(eq(folders.id, folderId));
  revalidatePath(`/f/${target.parentId}`);
  bumpAll();
}

export async function restoreFile(fileId: number) {
  const userId = await requireUser();
  await db
    .update(files)
    .set({ deletedAt: null })
    .where(and(eq(files.id, fileId), eq(files.ownerId, userId)));
  bumpAll();
}

export async function restoreFolder(folderId: number) {
  const userId = await requireUser();
  await db
    .update(folders)
    .set({ deletedAt: null })
    .where(and(eq(folders.id, folderId), eq(folders.ownerId, userId)));
  bumpAll();
}

export async function permanentDeleteFile(fileId: number) {
  const userId = await requireUser();
  const [row] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, fileId), eq(files.ownerId, userId)))
    .limit(1);
  if (!row) throw new Error("File not found");

  await utapi.deleteFiles(row.key);
  await db.delete(files).where(eq(files.id, fileId));
  bumpAll();
}

export async function permanentDeleteFolder(folderId: number) {
  const userId = await requireUser();
  const [target] = await db
    .select()
    .from(folders)
    .where(and(eq(folders.id, folderId), eq(folders.ownerId, userId)))
    .limit(1);
  if (!target) throw new Error("Folder not found");
  if (target.parentId == null) throw new Error("Cannot delete root folder");

  const allFolderIds = [folderId, ...(await collectDescendants(folderId, userId))];
  const fileRows = await db
    .select()
    .from(files)
    .where(and(eq(files.ownerId, userId), inArray(files.parentId, allFolderIds)));

  if (fileRows.length > 0) {
    await utapi.deleteFiles(fileRows.map((f) => f.key));
    await db.delete(files).where(inArray(files.id, fileRows.map((f) => f.id)));
  }
  await db.delete(folders).where(inArray(folders.id, allFolderIds));
  bumpAll();
}

export async function emptyTrash() {
  const userId = await requireUser();

  const trashedFiles = await db
    .select()
    .from(files)
    .where(and(eq(files.ownerId, userId), isNotNull(files.deletedAt)));
  if (trashedFiles.length > 0) {
    await utapi.deleteFiles(trashedFiles.map((f) => f.key));
    await db.delete(files).where(inArray(files.id, trashedFiles.map((f) => f.id)));
  }

  const trashedFolderRows = await db
    .select({ id: folders.id })
    .from(folders)
    .where(and(eq(folders.ownerId, userId), isNotNull(folders.deletedAt)));

  const allIds = new Set<number>();
  for (const f of trashedFolderRows) {
    allIds.add(f.id);
    for (const d of await collectDescendants(f.id, userId)) allIds.add(d);
  }
  if (allIds.size > 0) {
    const ids = [...allIds];
    const orphanFiles = await db
      .select()
      .from(files)
      .where(and(eq(files.ownerId, userId), inArray(files.parentId, ids)));
    if (orphanFiles.length > 0) {
      await utapi.deleteFiles(orphanFiles.map((f) => f.key));
      await db.delete(files).where(inArray(files.id, orphanFiles.map((f) => f.id)));
    }
    await db.delete(folders).where(inArray(folders.id, ids));
  }
  bumpAll();
}

export async function toggleStar(kind: "file" | "folder", id: number) {
  const userId = await requireUser();
  if (kind === "file") {
    await db
      .update(files)
      .set({ starred: sql`NOT ${files.starred}` })
      .where(and(eq(files.id, id), eq(files.ownerId, userId)));
  } else {
    await db
      .update(folders)
      .set({ starred: sql`NOT ${folders.starred}` })
      .where(and(eq(folders.id, id), eq(folders.ownerId, userId)));
  }
  bumpAll();
  revalidatePath("/", "layout");
}

async function collectDescendants(rootId: number, ownerId: string): Promise<number[]> {
  const out: number[] = [];
  const stack = [rootId];
  while (stack.length) {
    const current = stack.pop()!;
    const children = await db
      .select({ id: folders.id })
      .from(folders)
      .where(and(eq(folders.parentId, current), eq(folders.ownerId, ownerId)));
    for (const c of children) {
      out.push(c.id);
      stack.push(c.id);
    }
  }
  return out;
}
