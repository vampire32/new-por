import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { getHomeData } from "@/lib/data";
import { visibleSections } from "@/lib/sections";

export default async function SiteLayout({ children }) {
  const data = await getHomeData();
  const sections = visibleSections(data);

  return (
    <>
      <noscript>
        <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <Header name={data.profile?.name} sections={sections} />
      <main id="main" className="flex-1">{children}</main>
      <Footer profile={data.profile} sections={sections} />
    </>
  );
}
