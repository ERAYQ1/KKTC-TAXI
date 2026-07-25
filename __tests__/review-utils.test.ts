import { describe, expect, test } from "vitest";
import { averageRating, type Review } from "@/lib/review-utils";

function review(rating: number): Review {
  return {
    id: "id",
    taxi_id: "taxi",
    author_name: "Ali",
    rating,
    comment: null,
    approved: true,
    created_at: new Date().toISOString(),
  };
}

describe("averageRating", () => {
  test("returns null for an empty list", () => {
    expect(averageRating([])).toBeNull();
  });

  test("returns the exact rating for a single review", () => {
    expect(averageRating([review(4)])).toBe(4);
  });

  test("averages and rounds to one decimal place", () => {
    expect(averageRating([review(5), review(4), review(4)])).toBe(4.3);
  });
});
