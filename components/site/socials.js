export function socialLinks(profile) {
  return [
    { label: "GitHub", href: profile?.github_url },
    { label: "LinkedIn", href: profile?.linkedin_url },
    { label: "X", href: profile?.x_url },
  ].filter((l) => l.href);
}
