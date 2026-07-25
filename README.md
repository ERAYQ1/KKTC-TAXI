# KKTC Taksi

KKTC genelinde taksi bulma platformu. Ziyaretçiler taksileri bölgeye göre arar, tek dokunuşla arar veya WhatsApp'tan hazır mesajla yazar. Kayıt/login gerekmez — sadece yöneticiler giriş yapıp taksi kayıtlarını yönetir.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth + Storage)

## Özellikler

- Bölge/arama filtreli genel taksi listesi, sayfalama (12/sayfa)
- Taksi detayında yorumlar (ziyaretçi gönderir, admin onaylar) ve favoriler (tarayıcıda, `localStorage`)
- TR/EN dil seçici; arayüz metinleri (admin panel dahil) çift dilli. Taksi açıklaması ve fiyat bilgisi için ayrı EN alanı var — boş bırakılırsa TR metne düşer (bölge adları ve taksi/şoför adı tek dil kalır)
- Admin panelinde istatistik özeti, toplu aktif/pasif/sil işlemleri, yorum moderasyonu, işlem geçmişi (audit log)
- Giriş ve admin yazma işlemlerinde bellek-içi rate limiting (`src/lib/rate-limit.ts`, tek instance için — çoklu instance'ta paylaşılmaz)
- Kod-üretimli OG görseli, favicon ve PWA manifest'i (`next/og`, harici asset gerekmez)

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
| `npm run test` | Vitest (unit testler) |
| `npm run test:watch` | Vitest, izleme modunda |

## Yapı

```
src/
  app/
    (home)/            ana sayfa (liste, arama, bölge filtresi, sayfalama)
    taksi/[id]/        taksi detayı, yorumlar, yorum formu
    favoriler/         localStorage favori listesi (client)
    api/favorites/     favori id'lerini taksi kaydına çeviren GET route
    admin/
      login/           yönetici girişi (rate limit'li)
      (dashboard)/     korumalı yönetim paneli: istatistik, CRUD, toplu işlem
        yorumlar/       yorum moderasyonu
        gecmis/         işlem geçmişi (audit log)
    actions.ts         dil seçici Server Action
    opengraph-image.tsx, icon.tsx, apple-icon.tsx, manifest.ts  — next/og ile üretilen görseller
  components/          paylaşılan UI
  lib/
    supabase/          browser / server / proxy istemcileri
    queries.ts         veri okuma (sayfalama dahil)
    validation.ts      form ve dosya doğrulama
    rate-limit.ts       bellek-içi sliding-window limiter
    audit.ts           admin işlem günlüğü yazma/okuma
    reviews.ts          yorum sorguları (server-only)
    review-utils.ts      yorum tipi + ortalama puan (test edilebilir, saf)
    favorites.ts         localStorage favori yardımcıları (client)
    i18n.ts              TR/EN sözlük (saf, test edilebilir)
    get-lang.ts          cookie'den aktif dili okur (server-only)
  proxy.ts             oturum yenileme + /admin optimistic yönlendirme
supabase/
  migrations/          şema, RLS, storage politikaları, audit log + yorumlar
  seed.sql             local demo verisi (kurgusal, yer tutucu fotoğraflı)
```

## Güvenlik notları

- `SUPABASE_SERVICE_ROLE_KEY` yalnızca sunucu tarafıdır ve `NEXT_PUBLIC_` ön eki almaz. Uygulama bu anahtarı kullanmaz.
- Yetkilendirme iki katmanlıdır: `proxy.ts` yalnızca iyimser yönlendirme yapar, gerçek kontrol her admin sayfası ve Server Action içindeki `requireAdmin()` ile yapılır. Üçüncü katman veritabanındaki RLS politikalarıdır.
- `anon` rolü yalnızca `active = true` satırları okuyabilir; yazma yetkisi yoktur (yorumlarda `insert` hariç, o da yalnızca `approved = false` ile sınırlı).
- Fotoğraf yüklemede tür (JPG/PNG/WebP) ve boyut (2 MB) doğrulanır, dosya adı sunucuda üretilir.
- Giriş denemeleri IP+e-posta başına 5/5dk, admin yazma işlemleri kullanıcı başına 30/dk, yorum gönderimi IP başına 5/saat ile sınırlanır (`src/lib/rate-limit.ts`). Bellek-içi olduğundan tek sunucu instance'ı varsayar.
- Her admin yazma işlemi (`admin_audit_log` tablosu) kim/ne/ne zaman ile kaydedilir; panelde "Geçmiş" sekmesinden görülür.
- `supabase/seed.sql` ve depodaki hiçbir dosyaya gerçek kişisel veri eklenmemelidir.
