-- English variants of free-text taxi content. `name` stays single-language
-- (it's a business name, not prose); `description`/`price_info` are prose
-- and now have an optional English counterpart, falling back to the
-- Turkish column when empty.

alter table taxis
  add column if not exists description_en text,
  add column if not exists price_info_en text;
