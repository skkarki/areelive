import { Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Handshake, Mic2, Radio } from "lucide-react";

const opportunities = [
  {
    title: "Become a Creator / Host",
    description:
      "Share your talent, build your audience, and earn on AreeLive. Creators and hosts are the heart of our platform.",
    action: "Apply as Creator / Host",
    icon: Mic2,
    to: "/creators",
  },
  {
    title: "Apply as Agent / Agency",
    description:
      "Recruit and manage creators and hosts as an approved AreeLive agency. Grow your talent network on a global platform.",
    action: "Apply as Agent / Agency",
    icon: Briefcase,
    to: "/join/$role",
    params: { role: "agency" },
  },
  {
    title: "Invite a Broadcaster",
    description:
      "Know someone who would be a great fit for AreeLive? Invite them to join the platform and help grow the community.",
    action: "Invite a Broadcaster",
    icon: Radio,
    to: "/invite-broadcaster",
  },
  {
    title: "Business Cooperation",
    description:
      "Explore commercial partnerships — from payment and technology to marketing, talent, and regional cooperation.",
    action: "Explore Partnerships",
    icon: Handshake,
    to: "/business",
  },
] as const;

export function JoinSection() {
  return (
    <section
      id="join"
      aria-labelledby="join-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 pt-8"
    >
      <div className="mb-14 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary">Join AreeLive</p>
        <h2 id="join-heading" className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Find Your Place on AreeLive
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Whether you create, manage, broadcast, or build — there is a path for you on AreeLive.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {opportunities.map(({ title, description, action, icon: Icon, ...link }) => (
          <Link
            key={title}
            {...link}
            className="group flex flex-col rounded-2xl border border-primary/20 bg-card/70 p-7 transition-colors hover:border-primary/60 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mb-2 text-lg font-bold">{title}</h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
              {action}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
