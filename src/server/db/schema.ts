import {
  pgTable,
  serial,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const folders = pgTable(
  "folders",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    parentId: integer("parent_id"),
    ownerId: text("owner_id").notNull(),
    starred: boolean("starred").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    ownerIdx: index("folders_owner_idx").on(t.ownerId),
    parentIdx: index("folders_parent_idx").on(t.parentId),
    deletedIdx: index("folders_deleted_idx").on(t.deletedAt),
  }),
);

export const files = pgTable(
  "files",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    key: text("key").notNull(),
    size: bigint("size", { mode: "number" }).notNull(),
    parentId: integer("parent_id").notNull(),
    ownerId: text("owner_id").notNull(),
    starred: boolean("starred").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    ownerIdx: index("files_owner_idx").on(t.ownerId),
    parentIdx: index("files_parent_idx").on(t.parentId),
    deletedIdx: index("files_deleted_idx").on(t.deletedAt),
  }),
);

export type Folder = typeof folders.$inferSelect;
export type File = typeof files.$inferSelect;
