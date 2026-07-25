import { describe, expect, test } from "vitest";
import { isLang, LANGS, t, type DictKey } from "@/lib/i18n";

// Keys mirrored here on purpose: t() is typed against the dictionary, so a
// missing key would be a compile error, not a runtime one. This list is the
// runtime check that every key actually resolves to non-empty text in both
// languages.
const keys: DictKey[] = [
  "heroTitlePrefix",
  "heroTitleHighlight",
  "heroTitleSuffix",
  "heroSubtitle",
  "searchPlaceholder",
  "searchButton",
  "filterAll",
  "filter24_7",
  "allTaxisHeading",
  "regionTaxisHeading",
  "taxiCountSuffix",
  "emptyStateTitle",
  "emptyStateSubtitle",
  "navTaxis",
  "navFavorites",
  "callButton",
  "whatsappButton",
  "featuredBadge",
  "hoursBadge",
  "priceLabel",
  "backToAll",
  "footerRights",
  "footerPriceNote",
  "favoritesTitle",
  "favoritesEmpty",
  "favoriteAdd",
  "favoriteRemove",
  "reviewsTitle",
  "reviewsEmpty",
  "reviewFormTitle",
  "reviewFormNote",
  "reviewNameLabel",
  "reviewRatingLabel",
  "reviewCommentLabel",
  "reviewSubmit",
  "reviewSubmitted",
];

describe("i18n dictionary", () => {
  test("every key resolves to non-empty text in every language", () => {
    for (const key of keys) {
      for (const lang of LANGS) {
        expect(t(lang, key).length).toBeGreaterThan(0);
      }
    }
  });

  test("tr and en text differ for at least most keys", () => {
    const identical = keys.filter((key) => t("tr", key) === t("en", key));
    // A couple of keys (e.g. "7/24") are legitimately identical across
    // languages; the dictionary is broken if most of them are.
    expect(identical.length).toBeLessThan(keys.length / 2);
  });
});

describe("isLang", () => {
  test("accepts known languages", () => {
    expect(isLang("tr")).toBe(true);
    expect(isLang("en")).toBe(true);
  });

  test("rejects unknown values", () => {
    expect(isLang("fr")).toBe(false);
    expect(isLang(null)).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });
});
