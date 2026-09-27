import { createFileRoute } from "@tanstack/react-router";
import {
  Handshake,
  CreditCard,
  Megaphone,
  Globe,
  Users,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { OpportunityCard, OpportunityLayout } from "@/components/opportunity-layout";
import { PartnershipForm } from "@/components/partnership-form";

export const Route = createFileRoute("/business")({
  component: BusinessPage,
  head: () => ({
    meta: [
      { title: "Business Cooperation — Partner with AreeLive" },
      {
        name: "description",
        content:
          "Explore strategic, payment, marketing, technology, talent, and regional partnerships with AreeLive.",
      },
    ],
  }),
});

const partnerships = [
  {
    icon: Handshake,
    title: "Strategic Partnerships",
    description: "Long-term strategic alliances and joint ventures.",
  },
  {
    icon: CreditCard,
    title: "Payment Partnerships",
    description: "Payment processors, wallets, and financial service providers.",
  },
  {
    icon: Megaphone,
    title: "Marketing & Advertising",
    description: "Brand partnerships, advertising, and promotional collaborations.",
  },
  {
    icon: Globe,
    title: "Technology Partnerships",
    description: "Technology providers, infrastructure, and platform integrations.",
  },
  {
    icon: Users,
    title: "Talent / Agency Partnerships",
    description: "Talent agencies, creator networks, and management companies.",
  },
  {
    icon: MapPin,
    title: "Regional Cooperation",
    description: "Regional operators, distributors, and market-entry partners.",
  },
  {
    icon: MessageSquare,
    title: "Other Business Enquiry",
    description: "Any other commercial or business enquiry not listed above.",
  },
];

function BusinessPage() {
  return (
    <OpportunityLayout
      eyebrow="Business Cooperation"
      title="Partner with AreeLive"
      description="We welcome strategic partnerships with companies, payment providers, technology businesses, marketing partners, talent organisations, and regional operators who share our vision for the future of live entertainment."
    >
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          AreeLive is building the next generation of global live entertainment. We partner with
          organisations that can help us grow, improve, and expand our platform and reach. If your
          business has a compelling proposition, we want to hear from you.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partnerships.map((item) => (
            <OpportunityCard key={item.title} {...item} />
          ))}
        </div>
      </section>
      <section className="border-t border-border/30 bg-card/20 px-6 py-16">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="text-2xl font-bold">Business Enquiry Form</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Tell us about your proposal. Send your completed enquiry to our business team through
            your email app.
          </p>
        </div>
        <PartnershipForm kind="business" />
      </section>
    </OpportunityLayout>
  );
}
