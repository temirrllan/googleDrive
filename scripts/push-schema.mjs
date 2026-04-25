import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);

const statements = [
  `CREATE TABLE IF NOT EXISTS "folders" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" text NOT NULL,
     "parent_id" integer,
     "owner_id" text NOT NULL,
     "created_at" timestamp DEFAULT now() NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS "files" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" text NOT NULL,
     "url" text NOT NULL,
     "key" text NOT NULL,
     "size" bigint NOT NULL,
     "parent_id" integer NOT NULL,
     "owner_id" text NOT NULL,
     "created_at" timestamp DEFAULT now() NOT NULL
   )`,
  `ALTER TABLE "folders" ADD COLUMN IF NOT EXISTS "starred" boolean DEFAULT false NOT NULL`,
  `ALTER TABLE "folders" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp`,
  `ALTER TABLE "files" ADD COLUMN IF NOT EXISTS "starred" boolean DEFAULT false NOT NULL`,
  `ALTER TABLE "files" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp`,
  `CREATE INDEX IF NOT EXISTS "folders_owner_idx" ON "folders" ("owner_id")`,
  `CREATE INDEX IF NOT EXISTS "folders_parent_idx" ON "folders" ("parent_id")`,
  `CREATE INDEX IF NOT EXISTS "folders_deleted_idx" ON "folders" ("deleted_at")`,
  `CREATE INDEX IF NOT EXISTS "files_owner_idx" ON "files" ("owner_id")`,
  `CREATE INDEX IF NOT EXISTS "files_parent_idx" ON "files" ("parent_id")`,
  `CREATE INDEX IF NOT EXISTS "files_deleted_idx" ON "files" ("deleted_at")`,
];

for (const stmt of statements) {
  await sql(stmt);
  console.log("ok:", stmt.split("\n")[0].trim());
}
console.log("done");
