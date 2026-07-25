export const LANGS = ["tr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_COOKIE = "lang";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

/**
 * Static UI copy only. Taxi record content (description, price info) has its
 * own English column in the database — see `localizedDescription` /
 * `localizedPriceInfo` in `@/lib/taxi` — and is not part of this dictionary.
 * `name` stays single-language; it's a business name, not prose.
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

  // --- Admin panel ---
  adminPanelTitle: { tr: "Yönetim Paneli", en: "Admin Panel" },
  adminNavReviews: { tr: "Yorumlar", en: "Reviews" },
  adminNavHistory: { tr: "Geçmiş", en: "History" },
  adminNavNewTaxi: { tr: "Yeni taksi", en: "New taxi" },
  adminLogout: { tr: "Çıkış", en: "Log out" },

  adminDashboardHeading: { tr: "Taksiler", en: "Taxis" },
  adminActiveOfTotalTemplate: { tr: "{active} aktif / {total} toplam", en: "{active} active / {total} total" },
  adminStatTotal: { tr: "Toplam", en: "Total" },
  adminStatActive: { tr: "Aktif", en: "Active" },
  adminStatInactive: { tr: "Pasif", en: "Inactive" },
  adminStatFeatured: { tr: "Öne çıkan", en: "Featured" },
  adminEmptyTitle: { tr: "Henüz taksi eklenmedi", en: "No taxis yet" },
  adminEmptyCta: { tr: "İlk taksiyi ekle", en: "Add the first taxi" },
  adminSelected: { tr: "Seçilenler:", en: "Selected:" },
  adminBulkActivate: { tr: "Aktif et", en: "Activate" },
  adminBulkDeactivate: { tr: "Pasife al", en: "Deactivate" },
  adminBulkDelete: { tr: "Sil", en: "Delete" },
  adminConfirmBulkActivate: { tr: "Seçili taksiler aktif edilsin mi?", en: "Activate the selected taxis?" },
  adminConfirmBulkDeactivate: { tr: "Seçili taksiler pasife alınsın mı?", en: "Deactivate the selected taxis?" },
  adminConfirmBulkDelete: {
    tr: "Seçili taksiler kalıcı olarak silinsin mi? Bu işlem geri alınamaz.",
    en: "Permanently delete the selected taxis? This cannot be undone.",
  },
  adminFeaturedBadge: { tr: "öne çıkan", en: "featured" },
  adminEdit: { tr: "Düzenle", en: "Edit" },
  adminSelectAriaTemplate: { tr: "{name} seç", en: "Select {name}" },
  adminConfirmDeactivateOneTemplate: {
    tr: '"{name}" pasife alınsın mı? Sitede görünmeyecek.',
    en: '"{name}" — deactivate? It will no longer be visible on the site.',
  },
  adminConfirmActivateOneTemplate: {
    tr: '"{name}" aktif edilsin mi?',
    en: '"{name}" — activate?',
  },
  adminConfirmDeleteOneTemplate: {
    tr: '"{name}" kalıcı olarak silinsin mi? Bu işlem geri alınamaz.',
    en: '"{name}" — permanently delete? This cannot be undone.',
  },

  adminEditTaxiSuffix: { tr: "— düzenle", en: "— edit" },
  adminNewTaxiHeading: { tr: "Yeni taksi ekle", en: "Add a new taxi" },
  adminSaveChanges: { tr: "Değişiklikleri kaydet", en: "Save changes" },
  adminSaveTaxi: { tr: "Taksiyi kaydet", en: "Save taxi" },
  adminSaving: { tr: "Kaydediliyor…", en: "Saving…" },
  adminCancel: { tr: "Vazgeç", en: "Cancel" },

  adminFieldName: { tr: "Taksi / şoför adı", en: "Taxi / driver name" },
  adminFieldPhone: { tr: "Telefon", en: "Phone" },
  adminFieldWhatsapp: { tr: "WhatsApp", en: "WhatsApp" },
  adminFieldWhatsappHint: { tr: "Boş bırakılırsa telefon kullanılır", en: "Uses the phone number if left blank" },
  adminFieldRegion: { tr: "Bölge", en: "Region" },
  adminFieldRegionPlaceholder: { tr: "Bölge seçin", en: "Select a region" },
  adminFieldPriceTr: { tr: "Fiyat bilgisi (TR)", en: "Price info (TR)" },
  adminFieldPriceEn: { tr: "Fiyat bilgisi (EN)", en: "Price info (EN)" },
  adminFieldPriceEnHint: { tr: "Boş bırakılırsa TR metin kullanılır", en: "Falls back to the TR text if left blank" },
  adminFieldDescriptionTr: { tr: "Açıklama (TR)", en: "Description (TR)" },
  adminFieldDescriptionEn: { tr: "Açıklama (EN)", en: "Description (EN)" },
  adminFieldPricePlaceholder: {
    tr: "Örn. Şehir içi 150 TL, havalimanı 600 TL",
    en: "e.g. In-city 150 TL, airport 600 TL",
  },
  adminFieldPhoto: { tr: "Fotoğraf", en: "Photo" },
  adminPhotoFormatsHint: { tr: "JPG, PNG veya WebP · en fazla {mb} MB", en: "JPG, PNG or WebP · up to {mb} MB" },
  adminFieldPhotoCurrentAlt: { tr: "Mevcut fotoğraf", en: "Current photo" },
  adminFieldPhotoHintKeep: { tr: "yeni dosya seçmezseniz mevcut fotoğraf kalır", en: "keeps the current photo unless you pick a new file" },
  adminFieldSettings: { tr: "Ayarlar", en: "Settings" },
  adminFieldPublished: { tr: "Sitede yayında", en: "Published on site" },
  adminField24_7: { tr: "7/24 hizmet veriyor", en: "Available 24/7" },
  adminFieldFeatured: { tr: "Öne çıkar (listede üstte gösterilir)", en: "Feature (shown at the top of the list)" },

  adminReviewsHeading: { tr: "Yorumlar", en: "Reviews" },
  adminReviewsPendingOfTotalTemplate: { tr: "{pending} bekleyen / {total} toplam", en: "{pending} pending / {total} total" },
  adminReviewsPendingHeading: { tr: "Onay bekleyen", en: "Awaiting approval" },
  adminReviewsNonePending: { tr: "Bekleyen yorum yok.", en: "No reviews waiting for approval." },
  adminReviewsApprovedHeading: { tr: "Onaylı", en: "Approved" },
  adminReviewsNoneApproved: { tr: "Onaylı yorum yok.", en: "No approved reviews." },
  adminReviewsDeletedTaxi: { tr: "Silinmiş taksi", en: "Deleted taxi" },
  adminApprove: { tr: "Onayla", en: "Approve" },
  adminConfirmDeleteReview: { tr: "Bu yorum kalıcı olarak silinsin mi?", en: "Permanently delete this review?" },

  adminHistoryHeading: { tr: "İşlem geçmişi", en: "History" },
  adminHistoryLastNTemplate: { tr: "Son {n} işlem", en: "Last {n} actions" },
  adminHistoryEmpty: { tr: "Henüz kayıt yok.", en: "No entries yet." },
  auditLoginFailed: { tr: "Başarısız giriş", en: "Failed login" },
  auditCreateTaxi: { tr: "Taksi eklendi", en: "Taxi created" },
  auditUpdateTaxi: { tr: "Taksi güncellendi", en: "Taxi updated" },
  auditDeleteTaxi: { tr: "Taksi silindi", en: "Taxi deleted" },
  auditActivateTaxi: { tr: "Taksi aktif edildi", en: "Taxi activated" },
  auditDeactivateTaxi: { tr: "Taksi pasife alındı", en: "Taxi deactivated" },
  auditBulkActivate: { tr: "Toplu aktif etme", en: "Bulk activate" },
  auditBulkDeactivate: { tr: "Toplu pasife alma", en: "Bulk deactivate" },
  auditBulkDelete: { tr: "Toplu silme", en: "Bulk delete" },
  auditApproveReview: { tr: "Yorum onaylandı", en: "Review approved" },
  auditDeleteReview: { tr: "Yorum silindi", en: "Review deleted" },

  adminLoginHeading: { tr: "Yönetici Girişi", en: "Admin Login" },
  adminLoginSubtitle: { tr: "Taksi kayıtlarını yönetmek için giriş yapın.", en: "Sign in to manage taxi listings." },
  adminEmailLabel: { tr: "E-posta", en: "Email" },
  adminPasswordLabel: { tr: "Şifre", en: "Password" },
  adminLoginSubmit: { tr: "Giriş yap", en: "Log in" },
  adminLoggingIn: { tr: "Giriş yapılıyor…", en: "Logging in…" },

  errEmailPasswordRequired: { tr: "E-posta ve şifre gerekli.", en: "Email and password are required." },
  errTooManyLoginAttemptsTemplate: {
    tr: "Çok fazla deneme yapıldı. {n} dakika sonra tekrar deneyin.",
    en: "Too many attempts. Try again in {n} minute(s).",
  },
  errInvalidCredentials: { tr: "E-posta veya şifre hatalı.", en: "Invalid email or password." },
  errTooManyWrites: { tr: "Çok fazla işlem yapıldı. Biraz sonra tekrar deneyin.", en: "Too many actions. Try again shortly." },
  errInvalidRecord: { tr: "Geçersiz kayıt.", en: "Invalid record." },
  errTaxiCreateFailed: { tr: "Taksi kaydedilemedi. Tekrar deneyin.", en: "Could not save the taxi. Try again." },
  errTaxiUpdateFailed: { tr: "Taksi güncellenemedi. Tekrar deneyin.", en: "Could not update the taxi. Try again." },
  errPhotoUploadFailed: { tr: "Fotoğraf yüklenemedi. Tekrar deneyin.", en: "Could not upload the photo. Try again." },
  errStatusUpdateFailed: { tr: "Durum güncellenemedi.", en: "Could not update the status." },
  errTaxiDeleteFailed: { tr: "Taksi silinemedi.", en: "Could not delete the taxi." },
  errBulkUpdateFailed: { tr: "Toplu güncelleme başarısız.", en: "Bulk update failed." },
  errBulkDeleteFailed: { tr: "Toplu silme başarısız.", en: "Bulk delete failed." },
  errReviewApproveFailed: { tr: "Yorum onaylanamadı.", en: "Could not approve the review." },
  errReviewDeleteFailed: { tr: "Yorum silinemedi.", en: "Could not delete the review." },

  fieldErrNameLength: { tr: "İsim en az 2 karakter olmalı.", en: "Name must be at least 2 characters." },
  fieldErrNameMax: { tr: "İsim en fazla 80 karakter olabilir.", en: "Name can be at most 80 characters." },
  fieldErrPhoneRequired: { tr: "Telefon numarası zorunlu.", en: "Phone number is required." },
  fieldErrPhoneInvalid: {
    tr: "Geçerli bir numara girin (örn. 0533 123 45 67).",
    en: "Enter a valid number (e.g. 0533 123 45 67).",
  },
  fieldErrWhatsappInvalid: { tr: "Geçerli bir WhatsApp numarası girin.", en: "Enter a valid WhatsApp number." },
  fieldErrRegionRequired: { tr: "Bölge seçin.", en: "Select a region." },
  fieldErrPriceMax: { tr: "Fiyat bilgisi en fazla 120 karakter olabilir.", en: "Price info can be at most 120 characters." },
  fieldErrPriceEnMax: {
    tr: "Fiyat bilgisi (EN) en fazla 120 karakter olabilir.",
    en: "Price info (EN) can be at most 120 characters.",
  },
  fieldErrDescriptionMax: { tr: "Açıklama en fazla 1000 karakter olabilir.", en: "Description can be at most 1000 characters." },
  fieldErrDescriptionEnMax: {
    tr: "Açıklama (EN) en fazla 1000 karakter olabilir.",
    en: "Description (EN) can be at most 1000 characters.",
  },
  errPhotoWrongType: { tr: "Fotoğraf JPG, PNG veya WebP olmalı.", en: "Photo must be JPG, PNG or WebP." },
  errPhotoTooLarge: { tr: "Fotoğraf en fazla 2 MB olabilir.", en: "Photo can be at most 2 MB." },
  errPhotoInvalidFile: {
    tr: "Dosya geçerli bir JPG, PNG veya WebP görseli değil.",
    en: "File is not a valid JPG, PNG or WebP image.",
  },
} as const;

export type DictKey = keyof typeof dict;

export function t(lang: Lang, key: DictKey, vars?: Record<string, string | number>): string {
  const template = dict[key][lang];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}
