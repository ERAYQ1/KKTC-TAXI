import { describe, expect, test } from "vitest";
import {
  formatPhone,
  isRegion,
  normalisePhone,
  regionLabel,
  telHref,
  whatsappHref,
} from "@/lib/taxi";

describe("normalisePhone", () => {
  test("normalises a leading-zero local number to 90-prefixed digits", () => {
    expect(normalisePhone("0533 123 45 67")).toBe("905331234567");
  });

  test("normalises a +90 international number", () => {
    expect(normalisePhone("+90 533 123 45 67")).toBe("905331234567");
  });

  test("normalises a bare local number without leading zero", () => {
    expect(normalisePhone("533 123 45 67")).toBe("905331234567");
  });

  test("returns empty string for input with no digits", () => {
    expect(normalisePhone("abc")).toBe("");
  });
});

describe("telHref / whatsappHref", () => {
  test("builds a tel: link with normalised digits", () => {
    expect(telHref("0533 123 45 67")).toBe("tel:+905331234567");
  });

  test("builds a wa.me link with the canned message", () => {
    const href = whatsappHref("0533 123 45 67");
    expect(href).toContain("https://wa.me/905331234567?text=");
    expect(href).toContain(encodeURIComponent("Merhaba, KKTC Taksi'den geldim."));
  });
});

describe("formatPhone", () => {
  test("formats a normalised number into local grouping", () => {
    expect(formatPhone("0533 123 45 67")).toBe("0533 123 45 67");
  });

  test("falls back to the raw input when digit count is unexpected", () => {
    expect(formatPhone("123")).toBe("123");
  });
});

describe("isRegion / regionLabel", () => {
  test("accepts a known region value", () => {
    expect(isRegion("girne")).toBe(true);
  });

  test("rejects an unknown region value", () => {
    expect(isRegion("istanbul")).toBe(false);
  });

  test("looks up the Turkish label for a known region", () => {
    expect(regionLabel("gazimagusa")).toBe("Gazimağusa");
  });

  test("falls back to 'Diğer' for an unknown region", () => {
    expect(regionLabel("mars")).toBe("Diğer");
  });
});
