# KKTC Taksi

KKTC genelinde taksi bulma platformu. Ziyaretçiler taksileri bölgeye göre arar, tek dokunuşla arar veya WhatsApp'tan hazır mesajla yazar. Kayıt/login gerekmez — sadece yöneticiler giriş yapıp taksi kayıtlarını yönetir.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth + Storage)

## Kurulum

```bash
npm install
cp .env.local.example .env.local
```

### Local Supabase (Docker gerekir)

```bash
npx supabase start          # Postgres + Auth + Storage + Studio
npx supabase db reset       # şema + RLS + demo veri uygular
```

`supabase start` çıktısındaki `API_URL` ve `ANON_KEY` değerlerini `.env.local` içine yazın:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Yönetici hesabı

Public kayıt yoktur; yönetici hesapları elle oluşturulur.

- **Local:** Supabase Studio (http://127.0.0.1:54323) → Authentication → Users → Add user
- **Production:** Supabase Dashboard → Authentication → Users → Add user

Ardından `/admin/login` üzerinden giriş yapılır.

```bash
npm run dev
```

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Tip kontrolü |

## Yapı

```
src/
  app/
    (home)/            ana sayfa (liste, arama, bölge filtresi)
    taksi/[id]/        taksi detayı
    admin/
      login/           yönetici girişi
      (dashboard)/     korumalı yönetim paneli + CRUD
  components/          paylaşılan UI
  lib/
    supabase/          browser / server / proxy istemcileri
    queries.ts         veri okuma
    validation.ts      form ve dosya doğrulama
  proxy.ts             oturum yenileme + /admin optimistic yönlendirme
supabase/
  migrations/          şema, RLS, storage politikaları
  seed.sql             local demo verisi (kurgusal)
```

## Güvenlik notları

- `SUPABASE_SERVICE_ROLE_KEY` yalnızca sunucu tarafıdır ve `NEXT_PUBLIC_` ön eki almaz. Uygulama bu anahtarı kullanmaz.
- Yetkilendirme iki katmanlıdır: `proxy.ts` yalnızca iyimser yönlendirme yapar, gerçek kontrol her admin sayfası ve Server Action içindeki `requireAdmin()` ile yapılır. Üçüncü katman veritabanındaki RLS politikalarıdır.
- `anon` rolü yalnızca `active = true` satırları okuyabilir; yazma yetkisi yoktur.
- Fotoğraf yüklemede tür (JPG/PNG/WebP) ve boyut (2 MB) doğrulanır, dosya adı sunucuda üretilir.
- `supabase/seed.sql` ve depodaki hiçbir dosyaya gerçek kişisel veri eklenmemelidir.
