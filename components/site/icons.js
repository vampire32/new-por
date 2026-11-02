import { AppWindow, Bot, Boxes, Cloud, CodeXml, CreditCard, Database, Gauge, Layers, Monitor, PenTool, Plug, Server, ShieldCheck, Smartphone, Sparkles, Workflow } from "lucide-react";

// Icons are picked from the admin-entered names, so new categories/services still get a sensible icon.
const SKILL_ICONS = [
  [/\bai\b|automat/i, Bot],
  [/lang/i, CodeXml],
  [/cms|pay/i, CreditCard],
  [/front|ui|web/i, Monitor],
  [/back|server|api/i, Server],
  [/data|db|sql/i, Database],
  [/devops|cloud|deploy|infra/i, Cloud],
  [/mobile|app/i, Smartphone],
  [/design/i, PenTool],
  [/tool/i, Boxes],
];

const SERVICE_ICONS = [
  [/\bai\b|chatbot/i, Bot],
  [/api|integrat/i, Plug],
  [/payment|wordpress/i, CreditCard],
  [/perform|speed|fix|optimi/i, Gauge],
  [/mobile/i, Smartphone],
  [/design|ui|ux/i, PenTool],
  [/secur/i, ShieldCheck],
  [/automat|workflow/i, Workflow],
  [/web|app|dashboard|saas/i, AppWindow],
];

function pick(list, text, fallback) {
  return list.find(([re]) => re.test(text ?? ""))?.[1] ?? fallback;
}

export const skillIcon = (name) => pick(SKILL_ICONS, name, Layers);
export const serviceIcon = (title) => pick(SERVICE_ICONS, title, Sparkles);
