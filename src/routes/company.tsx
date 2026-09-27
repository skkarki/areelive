import { createFileRoute } from "@tanstack/react-router";
import { OpportunityLayout } from "@/components/opportunity-layout";

export const Route = createFileRoute("/company")({
  component: CompanyPage,
  head: () => ({
    meta: [
      { title: "The Company — AreeLive" },
      {
        name: "description",
        content:
          "Learn about AreeLive, a global technology and digital platform business for live entertainment, social connection, and the creator economy.",
      },
    ],
    links: [{ rel: "canonical", href: "/company" }],
  }),
});

function CompanyPage() {
  return (
    <OpportunityLayout
      eyebrow="The Company"
      title="A Technology Company Built for the Future of Entertainment"
      description="AreeLive is a global technology and digital platform business operating at the intersection of live entertainment, social connection, and the creator economy."
    >
      <section
        aria-labelledby="company-overview"
        className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 md:grid-cols-[2fr_1fr]"
      >
        <article className="rounded-xl border border-border bg-card/60 p-7">
          <h2 id="company-overview" className="text-lg font-bold">
            Company Overview
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            AreeLive is a technology-driven digital entertainment platform company with
            international operations. We develop and operate live streaming technology, creator
            tools, and digital engagement infrastructure serving users and creators across global
            markets.
          </p>
        </article>
        <aside className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primary">
            Quick Facts
          </h2>
          <dl className="space-y-4">
            {[
              { label: "Platform Type", value: "Live Streaming & Entertainment" },
              { label: "Markets", value: "Global (150+ Countries)" },
              { label: "Founded", value: "To be confirmed" },
              { label: "Technology", value: "Proprietary Platform" },
            ].map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 text-xs font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>
      <section className="border-t border-border/30 bg-card/20 px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-xl border border-border bg-card/60 p-6">
              <h2 className="text-sm font-bold">Technology Focus</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Our technology stack is built for global scale, low-latency live video delivery,
                real-time interaction, and intelligent content discovery. We invest in platform
                infrastructure, security, and the creator tools that differentiate AreeLive in the
                market.
              </p>
            </article>
            <article className="rounded-xl border border-border bg-card/60 p-6">
              <h2 className="text-sm font-bold">International Operations</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                AreeLive serves users and creators across multiple international markets. Our
                platform is designed for localisation, supporting multiple languages and regional
                content preferences while maintaining consistent safety and quality standards
                globally.
              </p>
            </article>
          </div>
          <article className="rounded-xl border border-border bg-card/60 p-6">
            <h2 className="text-sm font-bold">Legal & Corporate Information</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                "Legal Company Name",
                "Registration Number",
                "Jurisdiction",
                "Registered Address",
              ].map((label) => (
                <div key={label} className="rounded-lg border border-border bg-background/30 p-4">
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-2 text-xs font-medium text-secondary">To be confirmed</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Verified legal and corporate details will be added when confirmed.
            </p>
          </article>
        </div>
      </section>
    </OpportunityLayout>
  );
}
