-- Run this once against your Neon database (SQL Editor in the Neon console).
create table if not exists guestbook (
  id           serial primary key,
  body         text        not null,
  author_name  text        not null,
  author_image text,
  author_id    text        not null,
  created_at   timestamptz not null default now()
);

create index if not exists guestbook_created_at_idx on guestbook (created_at desc);
