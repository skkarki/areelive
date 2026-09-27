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
import { OpportunityLayout } from "@/components/opportunity-layout";
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
    title: "Strategic Partnership",
    description: "Long-term strategic alliances and joint ventures.",
  },
  {
    icon: CreditCard,
    title: "Payment Partnership",
    description: "Payment processors, wallets, and financial service providers.",
  },
  {
    icon: Megaphone,
    title: "Marketing & Advertising",
    description: "Brand partnerships, advertising, and promotional collaborations.",
  },
  {
    icon: Globe,
    title: "Technology Partnership",
    description: "Technology providers, infrastructure, and platform integrations.",
  },
  {
    icon: Users,
    title: "Talent / Agency Partnership",
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
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <p className="mx-auto mb-10 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          AreeLive is building the next generation of global live entertainment. We partner with
          organisations that can help us grow, improve, and expand our platform and reach. If your
          business has a compelling proposition, we want to hear from you.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partnerships.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-lg border border-border bg-card/60 p-4 transition-colors hover:border-primary/40"
            >
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="text-xs font-bold">{title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        id="promote"
        aria-labelledby="promote-heading"
        className="mx-auto max-w-5xl scroll-mt-28 px-6 pb-16"
      >
        <div className="rounded-xl border border-primary/30 bg-card/60 p-6 md:p-8">
          <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Megaphone aria-hidden="true" className="h-4 w-4" />
          </span>
          <h2 id="promote-heading" className="text-2xl font-bold">
            Promote Your Business on AreeLive
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Bring your brand into the AreeLive ecosystem through marketing and advertising services
            for external businesses, with opportunities to connect through creators, content, and
            live shopping.
          </p>
          <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            {[
              "Advertising",
              "Sponsored campaigns",
              "Brand deals",
              "Creator/influencer collaborations",
              "Sponsored livestreams",
              "Product promotion",
              "Live-commerce campaigns",
              "Marketing partnerships",
            ].map((service) => (
              <li key={service} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {service}
              </li>
            ))}
          </ul>
          <a
            href="#business-enquiry"
            className="gradient-primary mt-7 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-white shadow-glow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Promote With Us
          </a>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Select “Marketing &amp; Advertising” in the enquiry form and tell us about your business
            and campaign goals.
          </p>
        </div>
      </section>
      <section
        id="business-enquiry"
        className="scroll-mt-28 border-t border-border/30 bg-card/20 px-6 py-16"
      >
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="text-2xl font-bold">Business Enquiry Form</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Tell us about your proposal. Send your completed enquiry to our business team through
            your email app.
          </p>
        </div>
        <PartnershipForm kind="business" />
      </section>
    </OpportunityLayout>
  );
}
