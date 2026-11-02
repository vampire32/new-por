const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact({ name = "", email = "", message = "", website = "" }) {
  if (String(website).trim()) return { ok: true, spam: true };

  const data = {
    name: String(name).trim(),
    email: String(email).trim(),
    body: String(message).trim(),
  };
  const errors = {};

  if (!data.name) errors.name = "Enter your name.";
  else if (data.name.length > 100) errors.name = "Keep your name under 100 characters.";

  if (!EMAIL.test(data.email) || data.email.length > 200) errors.email = "Enter a valid email address.";

  if (!data.body) errors.message = "Write a message.";
  else if (data.body.length > 5000) errors.message = "Keep the message under 5000 characters.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
