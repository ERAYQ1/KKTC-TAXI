import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getFavoriteIds,
  isFavorite,
  onFavoritesChange,
  toggleFavorite,
} from "@/lib/favorites";

beforeEach(() => {
  window.localStorage.clear();
});

describe("favorites (localStorage)", () => {
  test("starts empty", () => {
    expect(getFavoriteIds()).toEqual([]);
    expect(isFavorite("a")).toBe(false);
  });

  test("toggling adds and then removes an id", () => {
    expect(toggleFavorite("a")).toBe(true);
    expect(isFavorite("a")).toBe(true);
    expect(getFavoriteIds()).toEqual(["a"]);

    expect(toggleFavorite("a")).toBe(false);
    expect(isFavorite("a")).toBe(false);
    expect(getFavoriteIds()).toEqual([]);
  });

  test("tracks multiple ids independently", () => {
    toggleFavorite("a");
    toggleFavorite("b");
    expect(getFavoriteIds().sort()).toEqual(["a", "b"]);

    toggleFavorite("a");
    expect(getFavoriteIds()).toEqual(["b"]);
  });

  test("notifies subscribers when favorites change", () => {
    const callback = vi.fn();
    const unsubscribe = onFavoritesChange(callback);

    toggleFavorite("a");
    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();
    toggleFavorite("a");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("ignores corrupted storage instead of throwing", () => {
    window.localStorage.setItem("kktc-taksi:favorites", "not json");
    expect(getFavoriteIds()).toEqual([]);
  });
});
