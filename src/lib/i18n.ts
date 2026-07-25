export const LANGS = ["tr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_COOKIE = "lang";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

/**
 * Static UI copy only. Taxi names/descriptions come from the database in
 * whatever language the admin entered them — translating user content would
 * need a translation service, which is out of scope here.
 */
const dict = {
  heroTitlePrefix: { tr: "KKTC'de taksiye", en: "Find a taxi in" },
  heroTitleHighlight: { tr: "tek dokunuşla", en: "Northern Cyprus" },
  heroTitleSuffix: { tr: "ulaşın", en: "in one tap" },
  heroSubtitle: {
    tr: "Bölgenizdeki taksiyi bulun, doğrudan arayın veya WhatsApp'tan hazır mesajla yazın. Kayıt gerekmez.",
    en: "Find a taxi near you, call directly, or message on WhatsApp with a ready-made text. No sign-up needed.",
  },
  searchPlaceholder: { tr: "Taksi adı veya bölge ara", en: "Search by taxi name or region" },
  searchButton: { tr: "Ara", en: "Search" },
  filterAll: { tr: "Tümü", en: "All" },
  filter24_7: { tr: "7/24", en: "24/7" },
  allTaxisHeading: { tr: "Tüm taksiler", en: "All taxis" },
  regionTaxisHeading: { tr: "taksileri", en: "taxis" },
  taxiCountSuffix: { tr: "taksi", en: "taxis" },
  emptyStateTitle: { tr: "Aramanıza uygun taksi bulunamadı", en: "No taxis match your search" },
  emptyStateSubtitle: {
    tr: "Farklı bir bölge seçmeyi veya aramanızı sadeleştirmeyi deneyin.",
    en: "Try a different region or simplify your search.",
  },
  navTaxis: { tr: "Taksiler", en: "Taxis" },
  navFavorites: { tr: "Favorilerim", en: "Favorites" },
  callButton: { tr: "Ara", en: "Call" },
  whatsappButton: { tr: "WhatsApp", en: "WhatsApp" },
  featuredBadge: { tr: "Öne çıkan", en: "Featured" },
  hoursBadge: { tr: "7/24 hizmet", en: "24/7 service" },
  priceLabel: { tr: "Fiyat:", en: "Price:" },
  backToAll: { tr: "Tüm taksiler", en: "All taxis" },
  footerRights: { tr: "Tüm hakları saklıdır.", en: "All rights reserved." },
  footerPriceNote: {
    tr: "Taksi ücretleri şoför tarafından belirlenir; bilgiler değişebilir.",
    en: "Fares are set by the driver and may change.",
  },
  favoritesTitle: { tr: "Favorilerim", en: "My favorites" },
  favoritesEmpty: {
    tr: "Henüz favori taksiniz yok. Bir taksi kartındaki yıldıza dokunun.",
    en: "No favorite taxis yet. Tap the star on a taxi card.",
  },
  favoriteAdd: { tr: "Favorilere ekle", en: "Add to favorites" },
  favoriteRemove: { tr: "Favorilerden çıkar", en: "Remove from favorites" },
  reviewsTitle: { tr: "Yorumlar", en: "Reviews" },
  reviewsEmpty: { tr: "Henüz onaylı yorum yok.", en: "No approved reviews yet." },
  reviewFormTitle: { tr: "Yorum bırak", en: "Leave a review" },
  reviewFormNote: {
    tr: "Yorumunuz yönetici onayından sonra yayınlanır.",
    en: "Your review is published after admin approval.",
  },
  reviewNameLabel: { tr: "Adınız", en: "Your name" },
  reviewRatingLabel: { tr: "Puan", en: "Rating" },
  reviewCommentLabel: { tr: "Yorum", en: "Comment" },
  reviewSubmit: { tr: "Gönder", en: "Submit" },
  reviewSubmitted: { tr: "Teşekkürler! Yorumunuz incelemeye alındı.", en: "Thanks! Your review is pending review." },
} as const;

export type DictKey = keyof typeof dict;

export function t(lang: Lang, key: DictKey): string {
  return dict[key][lang];
}
