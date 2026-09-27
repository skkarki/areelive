import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Zap, type LucideIcon } from "lucide-react";

export function OpportunityLayout({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5"
        >
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
            <Zap aria-hidden="true" className="h-5 w-5 text-primary" />
            AreeLive
          </Link>
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <Link to="/creators" className="hover:text-foreground">
              For Creators
            </Link>
            <Link to="/join/$role" params={{ role: "agency" }} className="hover:text-foreground">
              Agency Programme
            </Link>
            <Link to="/business" className="hover:text-foreground">
              Business Cooperation
            </Link>
          </div>
        </nav>
      </header>
      <main>
        <section className="bg-[radial-gradient(ellipse_at_top,var(--color-primary)_-350%,transparent_65%)] px-6 pb-20 pt-14 text-center md:pb-24 md:pt-20">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-secondary">
            {eyebrow}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        </section>
        {children}
      </main>
    </div>
  );
}

export function OpportunityCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <article className="rounded-xl border border-border bg-card/60 p-6">
      {Icon ? (
        <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : (
        <span className="mb-4 block h-5 w-1 rounded-full bg-primary" aria-hidden="true" />
      )}
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm">{description}</p>
    </article>
  );
}
