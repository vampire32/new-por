import { describe, expect, test } from "vitest";
import { slugify, validateContact } from "./validation";

describe("validateContact", () => {
  test("accepts a valid message and trims it", () => {
    expect(validateContact({ name: " Ali ", email: "ali@x.com ", message: " Hello there ", website: "" }))
      .toEqual({ ok: true, data: { name: "Ali", email: "ali@x.com", body: "Hello there" } });
  });

  test("reports every missing or invalid field", () => {
    expect(validateContact({ name: "", email: "nope", message: "", website: "" }).errors).toEqual({
      name: "Enter your name.",
      email: "Enter a valid email address.",
      message: "Write a message.",
    });
  });

  test("rejects over-long fields", () => {
    expect(validateContact({ name: "A", email: "a@b.co", message: "x".repeat(5001), website: "" }).errors.message)
      .toBe("Keep the message under 5000 characters.");
    expect(validateContact({ name: "n".repeat(101), email: "a@b.co", message: "hi", website: "" }).errors.name)
      .toBe("Keep your name under 100 characters.");
  });

  test("rejects emails with spaces or no domain dot", () => {
    expect(validateContact({ name: "A", email: "a b@c.com", message: "hi" }).ok).toBe(false);
    expect(validateContact({ name: "A", email: "a@localhost", message: "hi" }).ok).toBe(false);
  });

  test("flags the honeypot as spam", () => {
    expect(validateContact({ name: "A", email: "a@b.co", message: "hi", website: "spam.com" }))
      .toEqual({ ok: true, spam: true });
  });

  test("survives missing fields", () => {
    expect(validateContact({}).ok).toBe(false);
  });
});

describe("slugify", () => {
  test("lowercases and hyphenates", () => {
    expect(slugify("  My SaaS Dashboard! v2 ")).toBe("my-saas-dashboard-v2");
  });
});
