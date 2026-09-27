import { Users, TrendingUp, ShieldCheck, ChartColumn } from "lucide-react";
import { OpportunityCard, OpportunityLayout } from "@/components/opportunity-layout";
import { PartnershipForm } from "@/components/partnership-form";

const responsibilities = [
  {
    icon: Users,
    title: "Recruit Creators & Hosts",
    description:
      "Identify, onboard, and introduce eligible creators and hosts to the AreeLive platform.",
  },
  {
    icon: TrendingUp,
    title: "Manage & Support Talent",
    description:
      "Provide ongoing management, coaching, and operational support to the creators and hosts in your network.",
  },
  {
    icon: ShieldCheck,
    title: "Ensure Compliance",
    description:
      "Ensure all talent under your agency adheres to AreeLive’s community standards and platform policies.",
  },
  {
    icon: ChartColumn,
    title: "Drive Growth",
    description:
      "Help your creators and hosts grow their audiences, engagement, and platform performance.",
  },
];

export function AgencyPage() {
  return (
    <OpportunityLayout
      eyebrow="Agency Programme"
      title="Apply as an Agent or Agency"
      description="Approved agencies on AreeLive recruit, onboard, and manage eligible creators and hosts — helping them grow their presence and earnings on the platform."
    >
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">What is an AreeLive Agency?</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            An AreeLive Agency is an approved partner organisation that works directly with creators
            and hosts on the platform. Agencies provide support, guidance, and management services
            to help their talent succeed. In return, agencies benefit from a structured partnership
            with AreeLive and access to dedicated agency tools and support.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {responsibilities.map((item) => (
            <OpportunityCard key={item.title} {...item} />
          ))}
        </div>
      </section>
      <section className="border-t border-border/30 bg-card/20 px-6 py-16">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="text-2xl font-bold">Submit Your Agency Application</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Complete the form below. Our partnerships team will review your application and contact
            you.
          </p>
        </div>
        <PartnershipForm kind="agency" />
      </section>
    </OpportunityLayout>
  );
}
