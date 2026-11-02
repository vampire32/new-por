import About from "@/components/site/About";
import Contact from "@/components/site/Contact";
import Experience from "@/components/site/Experience";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import Skills from "@/components/site/Skills";
import StackMarquee from "@/components/site/StackMarquee";
import Testimonials from "@/components/site/Testimonials";
import WorkList from "@/components/site/WorkList";
import { getHomeData } from "@/lib/data";
import { visibleSections } from "@/lib/sections";

export default async function Home() {
  const data = await getHomeData();
  const show = new Set(visibleSections(data).map((s) => s.id));

  return (
    <>
      <Hero data={data} />
      <StackMarquee groups={data.skillGroups} />
      {show.has("work") && <WorkList projects={data.featured} />}
      {show.has("about") && <About profile={data.profile} stats={data.stats} />}
      {show.has("experience") && <Experience items={data.experience} />}
      {show.has("skills") && <Skills groups={data.skillGroups} />}
      {show.has("services") && <Services items={data.services} />}
      {show.has("testimonials") && <Testimonials items={data.testimonials} />}
      <Contact profile={data.profile} />
    </>
  );
}
