import { describe, expect, test } from "vitest";
import { parseReviewForm, parseTaxiForm, validatePhoto } from "@/lib/validation";

function buildForm(fields: Record<string, string>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.set(key, value);
  }
  return form;
}

const validFields = {
  name: "Girne Taksi",
  phone: "0533 123 45 67",
  whatsapp: "",
  region: "girne",
  price_info: "",
  description: "",
};

describe("parseTaxiForm", () => {
  test("accepts a minimal valid form and defaults whatsapp to phone", () => {
    const { data, fieldErrors } = parseTaxiForm(buildForm(validFields));
    expect(fieldErrors).toBeUndefined();
    expect(data).toMatchObject({
      name: "Girne Taksi",
      phone: "0533 123 45 67",
      whatsapp: "0533 123 45 67",
      region: "girne",
      price_info: null,
      description: null,
    });
  });

  test("rejects a name shorter than 2 characters", () => {
    const { data, fieldErrors } = parseTaxiForm(
      buildForm({ ...validFields, name: "A" }),
    );
    expect(data).toBeUndefined();
    expect(fieldErrors?.name).toBeDefined();
  });

  test("rejects a missing phone number", () => {
    const { fieldErrors } = parseTaxiForm(
      buildForm({ ...validFields, phone: "" }),
    );
    expect(fieldErrors?.phone).toBeDefined();
  });

  test("rejects an invalid phone number", () => {
    const { fieldErrors } = parseTaxiForm(
      buildForm({ ...validFields, phone: "123" }),
    );
    expect(fieldErrors?.phone).toBeDefined();
  });

  test("rejects an unknown region", () => {
    const { fieldErrors } = parseTaxiForm(
      buildForm({ ...validFields, region: "istanbul" }),
    );
    expect(fieldErrors?.region).toBeDefined();
  });

  test("reads boolean checkbox fields", () => {
    const form = buildForm(validFields);
    form.set("is_24_7", "on");
    form.set("featured", "true");
    const { data } = parseTaxiForm(form);
    expect(data?.is_24_7).toBe(true);
    expect(data?.featured).toBe(true);
    expect(data?.active).toBe(false);
  });
});

function pngFile(bytes: number[] = [0, 0, 0, 0], type = "image/png"): File {
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return new File([new Uint8Array([...pngSignature, ...bytes])], "photo.png", {
    type,
  });
}

describe("validatePhoto", () => {
  test("returns null when no file was submitted", async () => {
    expect(await validatePhoto(null)).toBeNull();
  });

  test("rejects a declared MIME type outside the allow-list", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "photo.gif", {
      type: "image/gif",
    });
    const result = await validatePhoto(file);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test("rejects a file whose signature doesn't match its declared type", async () => {
    const fakePng = new File([new Uint8Array([1, 2, 3, 4])], "fake.png", {
      type: "image/png",
    });
    const result = await validatePhoto(fakePng);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test("accepts a real PNG signature declared as image/png", async () => {
    const result = await validatePhoto(pngFile());
    expect(result).toMatchObject({ ext: "png" });
  });
});

describe("parseReviewForm", () => {
  const validFields = {
    author_name: "Ayşe",
    rating: "5",
    comment: "Harika hizmet.",
  };

  test("accepts a minimal valid review", () => {
    const { data, fieldErrors } = parseReviewForm(buildForm(validFields));
    expect(fieldErrors).toBeUndefined();
    expect(data).toEqual({
      author_name: "Ayşe",
      rating: 5,
      comment: "Harika hizmet.",
    });
  });

  test("defaults comment to null when blank", () => {
    const { data } = parseReviewForm(buildForm({ ...validFields, comment: "" }));
    expect(data?.comment).toBeNull();
  });

  test("rejects a name shorter than 2 characters", () => {
    const { fieldErrors } = parseReviewForm(
      buildForm({ ...validFields, author_name: "A" }),
    );
    expect(fieldErrors?.author_name).toBeDefined();
  });

  test("rejects a rating outside 1-5", () => {
    const { fieldErrors } = parseReviewForm(
      buildForm({ ...validFields, rating: "6" }),
    );
    expect(fieldErrors?.rating).toBeDefined();
  });

  test("rejects a non-numeric rating", () => {
    const { fieldErrors } = parseReviewForm(
      buildForm({ ...validFields, rating: "abc" }),
    );
    expect(fieldErrors?.rating).toBeDefined();
  });

  test("rejects a comment longer than 500 characters", () => {
    const { fieldErrors } = parseReviewForm(
      buildForm({ ...validFields, comment: "a".repeat(501) }),
    );
    expect(fieldErrors?.comment).toBeDefined();
  });
});
