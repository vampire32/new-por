import * as icons from "simple-icons";

// Server-only: importing every Simple Icon is fine here because none of it reaches the browser bundle.
const key = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

const ALIASES = {
  postgres: "postgresql", node: "nodejs", next: "nextjs", tailwind: "tailwindcss",
  js: "javascript", ts: "typescript", mongo: "mongodb", vue: "vuedotjs", expressjs: "express",
  reactjs: "react", reactnative: "react", // React Native ships under React's mark
};

const BY_KEY = new Map();
for (const icon of Object.values(icons)) {
  if (icon?.title && icon.path) BY_KEY.set(key(icon.title), icon);
}

// Very light brand colours (e.g. JavaScript yellow) disappear on white, so they fall back to ink.
function readable(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.75 ? "#1C2533" : `#${hex}`;
}

export function techLogo(name) {
  const k = key(name ?? "");
  if (!k) return null;
  const icon = BY_KEY.get(k) ?? BY_KEY.get(ALIASES[k]);
  return icon ? { title: icon.title, path: icon.path, color: readable(icon.hex) } : null;
}
