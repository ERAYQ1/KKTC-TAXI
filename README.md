# KKTC Taksi

KKTC genelinde taksi bulma platformu. Ziyaretçiler taksileri bölgeye göre arar, tek dokunuşla arar veya WhatsApp'tan hazır mesajla yazar. Kayıt/login gerekmez — sadece admin taksi ekler/düzenler.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth + Storage)

## Geliştirme

```bash
npm install
cp .env.local.example .env.local   # Supabase URL/anon key doldur
npm run dev
```

### Local Supabase (Docker gerekir)

```bash
npx supabase start   # Postgres+Auth+Storage+Studio ayağa kalkar, çıktıdaki key'leri .env.local'a koy
npx supabase db reset  # supabase/migrations altındaki şemayı uygular
```

## Komutlar

- `npm run dev` — geliştirme sunucusu
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — typecheck

## Klasör Yapısı

- `src/app` — sayfalar (public + `/admin`)
- `src/lib/supabase` — Supabase client (browser/server/middleware)
- `supabase/migrations` — DB şema + RLS
