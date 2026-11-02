import { expect, test } from "vitest";
import { FIELDS, parseForm } from "./admin-fields";

function fd(entries) {
  const f = new FormData();
  for (const [k, v] of entries) f.append(k, v);
  return f;
}

test("parses text, numbers, booleans, tags and dates", () => {
  const { values } = parseForm(
    fd([
      ["title", "  Shop  "],
      ["slug", ""],
      ["year", "2024"],
      ["tech", "Next.js, Node.js , ,Postgres"],
      ["featured", "on"],
      ["summary", ""],
    ]),
    FIELDS.projects
  );
  expect(values.title).toBe("Shop");
  expect(values.slug).toBe(null);
  expect(values.year).toBe(2024);
  expect(values.tech).toEqual(["Next.js", "Node.js", "Postgres"]);
  expect(values.featured).toBe(true);
  expect(values.published).toBe(false); // unchecked checkbox is absent from FormData
  expect(values.summary).toBe(null);
});

test("empty date means null (Present) and bad year means null", () => {
  const { values } = parseForm(fd([["role", "Dev"], ["company", "X"], ["start_date", "2023-01-01"], ["end_date", ""]]), FIELDS.experience);
  expect(values.end_date).toBe(null);
  expect(parseForm(fd([["year", "abc"]]), FIELDS.projects).values.year).toBe(null);
});

test("files: new upload is queued, remove clears, untouched is left alone", () => {
  const file = new File(["x"], "me.png", { type: "image/png" });
  const empty = new File([], "", { type: "application/octet-stream" });

  const a = parseForm(fd([["photo_url", file]]), FIELDS.profile);
  expect(a.uploads).toEqual([{ name: "photo_url", file }]);
  expect("photo_url" in a.values).toBe(false);

  const b = parseForm(fd([["photo_url", empty], ["photo_url__remove", "on"]]), FIELDS.profile);
  expect(b.values.photo_url).toBe(null);
  expect(b.uploads).toEqual([]);

  const c = parseForm(fd([["photo_url", empty]]), FIELDS.profile);
  expect("photo_url" in c.values).toBe(false);
});

test("reports missing required fields", () => {
  expect(parseForm(fd([["title", " "]]), FIELDS.projects).missing).toEqual(["title"]);
});
