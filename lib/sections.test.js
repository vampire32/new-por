import { expect, test } from "vitest";
import { visibleSections } from "./sections";

const full = {
  profile: { about: "x" },
  featured: [{}],
  experience: [{}],
  skillGroups: [{ skills: [{}] }],
  services: [{}],
  testimonials: [{}],
};

test("shows every section in spec order when all have content", () => {
  expect(visibleSections(full).map((s) => s.id))
    .toEqual(["work", "about", "experience", "skills", "services", "testimonials", "contact"]);
});

test("hides empty sections but always keeps contact", () => {
  expect(visibleSections({ ...full, testimonials: [], featured: [], profile: { about: "" } }).map((s) => s.id))
    .toEqual(["experience", "skills", "services", "contact"]);
});

test("hides skills when categories have no skills", () => {
  expect(visibleSections({ ...full, skillGroups: [{ skills: [] }] }).map((s) => s.id)).not.toContain("skills");
});

test("handles a missing profile row", () => {
  expect(visibleSections({ ...full, profile: null }).map((s) => s.id)).not.toContain("about");
});
