import { neon } from "@neondatabase/serverless";

/**
 * Neon's free tier replaces the PlanetScale free tier asrvd.me used, which was
 * discontinued in 2024. One table, raw SQL — an ORM would be more machinery
 * than a guestbook justifies.
 *
 * Run the statement in db/schema.sql once against your database, then set
 * DATABASE_URL.
 */
export function dbReady() {
  return Boolean(process.env.DATABASE_URL);
}

export function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  return neon(process.env.DATABASE_URL);
}

export type Entry = {
  id: number;
  body: string;
  author_name: string;
  author_image: string | null;
  author_id: string;
  created_at: string;
};

export async function getEntries(limit = 100): Promise<Entry[]> {
  if (!dbReady()) return [];
  const sql = db();
  return (await sql`
    select id, body, author_name, author_image, author_id, created_at
    from guestbook
    order by created_at desc
    limit ${limit}
  `) as Entry[];
}

export async function addEntry(entry: {
  body: string;
  authorName: string;
  authorImage: string | null;
  authorId: string;
}) {
  const sql = db();
  await sql`
    insert into guestbook (body, author_name, author_image, author_id)
    values (${entry.body}, ${entry.authorName}, ${entry.authorImage}, ${entry.authorId})
  `;
}

/** Scoped to the author id so nobody can delete someone else's message. */
export async function deleteEntry(id: number, authorId: string) {
  const sql = db();
  await sql`delete from guestbook where id = ${id} and author_id = ${authorId}`;
}
