import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites-list";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = {
  title: "Favorilerim",
  robots: { index: false, follow: false },
};

export default async function FavoritesPage() {
  const lang = await getLang();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {t(lang, "favoritesTitle")}
      </h1>

      <div className="mt-6">
        <FavoritesList
          copy={{
            empty: t(lang, "favoritesEmpty"),
            favoriteAdd: t(lang, "favoriteAdd"),
            favoriteRemove: t(lang, "favoriteRemove"),
            featured: t(lang, "featuredBadge"),
            hours: t(lang, "filter24_7"),
          }}
        />
      </div>
    </div>
  );
}
