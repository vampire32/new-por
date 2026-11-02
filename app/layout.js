import { Newsreader, Hanken_Grotesk } from "next/font/google";
import { getProfile } from "@/lib/data";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  weight: "400",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const p = (await getProfile()) ?? {};
  const title = p.seo_title || p.name || "Portfolio";
  const description = p.seo_description || p.headline || "";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: title, template: `%s | ${p.name || "Portfolio"}` },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(p.photo_url && { images: [p.photo_url] }),
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${newsreader.variable} ${hanken.variable} h-full antialiased`}>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body>; this only silences that one element. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
