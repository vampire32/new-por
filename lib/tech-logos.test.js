import { expect, test } from "vitest";
import { techLogo } from "./tech-logos";

test("finds logos by exact title, ignoring case and punctuation", () => {
  expect(techLogo("Next.js")?.title).toBe("Next.js");
  expect(techLogo("nextjs")?.title).toBe("Next.js");
  expect(techLogo("GitHub Actions")?.title).toBe("GitHub Actions");
});

test("understands common short names", () => {
  expect(techLogo("Postgres")?.title).toBe("PostgreSQL");
  expect(techLogo("Tailwind")?.title).toBe("Tailwind CSS");
  expect(techLogo("Node")?.title).toBe("Node.js");
  expect(techLogo("React Native")?.title).toBe("React");
});

test("returns a path and a colour readable on a light background", () => {
  const logo = techLogo("React");
  expect(logo.path.length).toBeGreaterThan(10);
  expect(logo.color).toMatch(/^#[0-9A-F]{6}$/i);
});

test("returns null for things that aren't brands", () => {
  expect(techLogo("REST APIs")).toBe(null);
  expect(techLogo("")).toBe(null);
});
