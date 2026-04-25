import { and, desc, eq, ilike, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "./index";
import { files, folders, type Folder } from "./schema";

export async function getOrCreateRootFolder(ownerId: string): Promise<Folder> {
  const existing = await db
    .select()
    .from(folders)
    .where(
      and(
        eq(folders.ownerId, ownerId),
        isNull(folders.parentId),
        isNull(folders.deletedAt),
      ),
    )
    .limit(1);

  if (existing[0]) return existing[0];

  const [created] = await db
    .insert(folders)
    .values({ name: "My Drive", parentId: null, ownerId })
    .returning();
  return created;
}

export async function getFolder(id: number, ownerId: string) {
  const [row] = await db
    .select()
    .from(folders)
    .where(
      and(
        eq(folders.id, id),
        eq(folders.ownerId, ownerId),
        isNull(folders.deletedAt),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function listChildren(parentId: number, ownerId: string) {
  const [childFolders, childFiles] = await Promise.all([
    db
      .select()
      .from(folders)
      .where(
        and(
          eq(folders.parentId, parentId),
          eq(folders.ownerId, ownerId),
          isNull(folders.deletedAt),
        ),
      )
      .orderBy(desc(folders.starred), folders.name),
    db
      .select()
      .from(files)
      .where(
        and(
          eq(files.parentId, parentId),
          eq(files.ownerId, ownerId),
          isNull(files.deletedAt),
        ),
      )
      .orderBy(desc(files.starred), files.name),
  ]);
  return { folders: childFolders, files: childFiles };
}

export async function getBreadcrumbs(folderId: number, ownerId: string) {
  const trail: Folder[] = [];
  let current = await getFolder(folderId, ownerId);
  while (current) {
    trail.unshift(current);
    if (current.parentId == null) break;
    current = await getFolder(current.parentId, ownerId);
  }
  return trail;
}

export async function listRecent(ownerId: string, limit = 50) {
  return db
    .select()
    .from(files)
    .where(and(eq(files.ownerId, ownerId), isNull(files.deletedAt)))
    .orderBy(desc(files.createdAt))
    .limit(limit);
}

export async function listStarred(ownerId: string) {
  const [starredFolders, starredFiles] = await Promise.all([
    db
      .select()
      .from(folders)
      .where(
        and(
          eq(folders.ownerId, ownerId),
          eq(folders.starred, true),
          isNull(folders.deletedAt),
        ),
      )
      .orderBy(folders.name),
    db
      .select()
      .from(files)
      .where(
        and(
          eq(files.ownerId, ownerId),
          eq(files.starred, true),
          isNull(files.deletedAt),
        ),
      )
      .orderBy(files.name),
  ]);
  return { folders: starredFolders, files: starredFiles };
}

export async function listTrash(ownerId: string) {
  const [trashedFolders, trashedFiles] = await Promise.all([
    db
      .select()
      .from(folders)
      .where(and(eq(folders.ownerId, ownerId), isNotNull(folders.deletedAt)))
      .orderBy(desc(folders.deletedAt)),
    db
      .select()
      .from(files)
      .where(and(eq(files.ownerId, ownerId), isNotNull(files.deletedAt)))
      .orderBy(desc(files.deletedAt)),
  ]);
  return { folders: trashedFolders, files: trashedFiles };
}

export async function searchAll(ownerId: string, q: string) {
  const term = `%${q}%`;
  const [matchedFolders, matchedFiles] = await Promise.all([
    db
      .select()
      .from(folders)
      .where(
        and(
          eq(folders.ownerId, ownerId),
          isNull(folders.deletedAt),
          ilike(folders.name, term),
        ),
      )
      .orderBy(folders.name)
      .limit(100),
    db
      .select()
      .from(files)
      .where(
        and(
          eq(files.ownerId, ownerId),
          isNull(files.deletedAt),
          ilike(files.name, term),
        ),
      )
      .orderBy(files.name)
      .limit(100),
  ]);
  return { folders: matchedFolders, files: matchedFiles };
}

export async function storageUsed(ownerId: string): Promise<number> {
  const rows = await db
    .select({ total: sql<string>`coalesce(sum(${files.size}), 0)` })
    .from(files)
    .where(eq(files.ownerId, ownerId));
  return Number(rows[0]?.total ?? 0);
}
