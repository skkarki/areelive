import { createFileRoute, Link } from "@tanstack/react-router";
import { OpportunityCard, OpportunityLayout } from "@/components/opportunity-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/creators")({
  component: CreatorsPage,
  head: () => ({
    meta: [
      { title: "For Creators — AreeLive" },
      {
        name: "description",
        content:
          "Build your audience, engage your community, and grow your creator career on AreeLive.",
      },
    ],
  }),
});

const benefits = [
  {
    title: "Build Your Audience",
    description:
      "Access powerful discovery tools that connect your content with audiences across the world. AreeLive’s recommendation engine surfaces your streams to viewers who are most likely to engage.",
  },
  {
    title: "Engage Your Community",
    description:
      "Foster connections with your audience through live interaction features, community spaces, and real-time engagement tools designed for meaningful creator–audience relationships.",
  },
  {
    title: "Grow Your Presence",
    description:
      "Track your performance with detailed analytics, understand your audience demographics, and optimise your content strategy with data-driven insights.",
  },
  {
    title: "Creator Ecosystem",
    description:
      "Eligible creators can participate in AreeLive’s creator programme, which includes platform rewards, promotional opportunities, and access to exclusive creator resources.",
  },
];

function CreatorsPage() {
  return (
    <OpportunityLayout
      eyebrow="For Creators"
      title="Your Audience is Global. Your Platform Should Be Too."
      description="AreeLive provides creators with the tools, technology, and community infrastructure to build meaningful audiences and sustainable digital careers."
    >
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-12 grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="max-w-sm text-3xl font-bold leading-tight">
              A Platform Built Around Creators
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AreeLive was designed from the ground up with creators at the centre. We provide the
              infrastructure, audience reach, and engagement tools that allow creators to focus on
              what they do best — creating exceptional live content.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card/50 p-6">
            {[
              { value: "Global", label: "Audience Reach" },
              { value: "Live", label: "Community Interaction" },
              { value: "Real-time", label: "Analytics" },
              { value: "Dedicated", label: "Creator Support" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-primary/5 px-3 py-5 text-center">
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-xl font-bold text-primary">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {benefits.map((benefit) => (
            <OpportunityCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </section>
      <section className="border-t border-border/30 bg-card/20 px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to Start Creating?</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          Join creators building their global audience on AreeLive.
        </p>
        <Button asChild className="mt-7 bg-primary px-7 shadow-glow">
          <Link to="/join/$role" params={{ role: "creator" }}>
            Apply as a Creator
          </Link>
        </Button>
      </section>
    </OpportunityLayout>
  );
}
