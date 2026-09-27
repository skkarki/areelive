import { Link } from "@tanstack/react-router";
import { Instagram, Youtube } from "lucide-react";
import { SiteBrand } from "@/components/site-brand";

const groups = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/creators" },
      { label: "Company", href: "/company" },
      { label: "Careers", href: "/join" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Features", href: "/features" },
      { label: "Creators", href: "/creators" },
      { label: "Safety", href: "/safety" },
      { label: "Get AreeLive", href: "/#download" },
    ],
  },
  {
    title: "Join AreeLive",
    links: [
      { label: "Apply as Host / Creator", href: "/join/creator" },
      { label: "Apply as Agent / Agency", href: "/join/agency" },
      { label: "Invite Broadcaster", href: "/invite-broadcaster" },
      { label: "Business Cooperation", href: "/business" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "/support" },
      { label: "Creator Support", href: "/support#creators" },
      { label: "Agency Support", href: "/support#agencies" },
      { label: "Technical Support", href: "/support#technical" },
      { label: "Report an Issue", href: "/support#report" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Community Guidelines", href: "/terms#acceptable-use" },
      { label: "Creator Terms", href: "/terms#applications" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Refund Policy", href: "/terms#payments" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/30 bg-background text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:px-8 md:pt-14">
        <div className="mb-14 flex flex-col justify-between gap-7 sm:flex-row sm:items-start md:mb-16">
          <div>
            <SiteBrand />
            <p className="mt-6 max-w-md text-sm leading-relaxed md:text-base">
              The future of global live entertainment.
              <br />
              Connecting creators and audiences across 150+ countries.
            </p>
          </div>
          <div aria-label="Social channels" className="flex gap-3">
            <SocialPlaceholder label="Instagram">
              <Instagram className="h-5 w-5" />
            </SocialPlaceholder>
            <SocialPlaceholder label="X">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.5 22H2.3l8.2-9.4L.8 2h6.5l4.4 6.7L18.9 2Zm-1.1 18h1.8L6.3 4H4.4l13.4 16Z" />
              </svg>
            </SocialPlaceholder>
            <SocialPlaceholder label="YouTube">
              <Youtube className="h-5 w-5" />
            </SocialPlaceholder>
          </div>
        </div>
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-1 gap-x-8 gap-y-9 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-muted-foreground/75">
                {group.title}
              </h2>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="rounded-sm text-sm leading-relaxed transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-base"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-border/30 pt-6 text-xs">
          <span>© {new Date().getFullYear()} AreeLive. All rights reserved.</span>
          <Link to="/referral-policy" className="hover:text-foreground">
            Referral Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

function SocialPlaceholder({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span
      role="img"
      aria-label={`${label} — official profile link coming soon`}
      title={`${label} — official profile link coming soon`}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/80 text-muted-foreground"
    >
      {children}
    </span>
  );
}
