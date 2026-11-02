// Nav items for the home page; a section with no content is hidden along with its link.
export function visibleSections({ profile, featured, experience, skillGroups, services, testimonials }) {
  const has = {
    work: featured?.length > 0,
    about: Boolean(profile?.about?.trim()),
    experience: experience?.length > 0,
    skills: skillGroups?.some((g) => g.skills?.length > 0),
    services: services?.length > 0,
    testimonials: testimonials?.length > 0,
    contact: true,
  };

  return [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "services", label: "Services" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ].filter((s) => has[s.id]);
}
