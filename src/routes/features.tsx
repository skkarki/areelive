import { createFileRoute } from "@tanstack/react-router";
import {
  Radio,
  Users,
  LockKeyhole,
  Gift,
  Coins,
  Star,
  Globe,
  UserRound,
  Shield,
  Languages,
} from "lucide-react";
import { OpportunityCard, OpportunityLayout } from "@/components/opportunity-layout";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({
    meta: [
      { title: "Platform Features — AreeLive" },
      {
        name: "description",
        content:
          "Explore AreeLive’s live streaming, creator communities, virtual gifts, global discovery, and platform features.",
      },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
});

const features = [
  {
    icon: Radio,
    category: "Core",
    title: "Live Streaming",
    description:
      "Broadcast to global audiences with low-latency, high-quality live video technology built for scale.",
  },
  {
    icon: Users,
    category: "Community",
    title: "Creator Communities",
    description:
      "Build dedicated communities around your content with follower management, fan tiers, and engagement tools.",
  },
  {
    icon: LockKeyhole,
    category: "Interaction",
    title: "Private Interactions",
    description:
      "Offer exclusive one-on-one experiences with premium private call and interaction features.",
  },
  {
    icon: Gift,
    category: "Economy",
    title: "Virtual Gifts",
    description:
      "Receive virtual gifts from your audience during live sessions — a meaningful way for fans to show appreciation.",
  },
  {
    icon: Coins,
    category: "Economy",
    title: "Digital Coins",
    description:
      "AreeLive’s in-platform digital currency enables seamless transactions and gifting across the ecosystem.",
  },
  {
    icon: Star,
    category: "Economy",
    title: "Creator Rewards",
    description:
      "Eligible creators can participate in platform reward programmes designed to recognise and support top performers.",
  },
  {
    icon: Globe,
    category: "Discovery",
    title: "Global Discovery",
    description:
      "Intelligent content discovery connects creators with new audiences across languages and geographies.",
  },
  {
    icon: UserRound,
    category: "Core",
    title: "User Profiles",
    description:
      "Rich, customisable profiles let creators and users express their identity and showcase their content.",
  },
  {
    icon: Shield,
    category: "Safety",
    title: "Moderation & Reporting",
    description:
      "Content moderation tools and user reporting systems help maintain platform safety and community standards.",
  },
  {
    icon: Languages,
    category: "Global",
    title: "Multi-language Support",
    description:
      "AreeLive is built for international markets with multi-language interfaces and localised experiences.",
  },
];

function FeaturesPage() {
  return (
    <OpportunityLayout
      eyebrow="Platform Features"
      title="Everything You Need to Go Live, Globally"
      description="AreeLive brings together powerful tools for creators and audiences — from live streaming and virtual gifts to private interactions and global discovery."
    >
      <section
        aria-label="Platform features"
        className="mx-auto grid max-w-5xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <OpportunityCard key={feature.title} {...feature} />
        ))}
      </section>
    </OpportunityLayout>
  );
}
