import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ShieldCheck,
  Flag,
  LockKeyhole,
  TriangleAlert,
  Baby,
  Ban,
  Shield,
} from "lucide-react";
import { OpportunityCard, OpportunityLayout } from "@/components/opportunity-layout";

export const Route = createFileRoute("/safety")({
  component: SafetyPage,
  head: () => ({
    meta: [
      { title: "Safety & Trust — AreeLive" },
      {
        name: "description",
        content:
          "Learn about AreeLive’s community standards, reporting, account safety, and commitment to platform integrity.",
      },
    ],
    links: [{ rel: "canonical", href: "/safety" }],
  }),
});

const principles = [
  {
    icon: BookOpen,
    title: "Community Guidelines",
    description:
      "Our community standards define acceptable behaviour and content on AreeLive. Creators and users are expected to follow these guidelines as a condition of platform access.",
  },
  {
    icon: ShieldCheck,
    title: "Content Moderation",
    description:
      "Content moderation helps identify and address content that violates community standards, supporting a safer environment for creators and viewers.",
  },
  {
    icon: Flag,
    title: "User Reporting",
    description:
      "Users can report content, accounts, or behaviour that violates platform rules. Include usernames, timestamps, and relevant details so our team can review your report.",
  },
  {
    icon: LockKeyhole,
    title: "Account Safety",
    description:
      "Protect your account with secure credentials and keep your login details private. AreeLive will never ask you to share your password with another user.",
  },
  {
    icon: TriangleAlert,
    title: "Fraud Prevention",
    description:
      "Fraud, impersonation, misleading submissions, and other deceptive behaviour violate our platform rules. Report suspicious activity to our support team.",
  },
  {
    icon: Baby,
    title: "Protection of Minors",
    description:
      "Users must meet the minimum age required by applicable local law. Content that exploits or endangers minors has no place on AreeLive.",
  },
  {
    icon: Ban,
    title: "Prohibited Content",
    description:
      "Illegal, abusive, deceptive, or harmful content is prohibited. Accounts and content that violate our standards may be restricted or removed.",
  },
  {
    icon: Shield,
    title: "Responsible Platform Use",
    description:
      "We encourage respectful participation and responsible use of platform features. Creators and viewers share a role in keeping the community safe.",
  },
];

function SafetyPage() {
  return (
    <OpportunityLayout
      eyebrow="Safety & Trust"
      title="A Platform You Can Trust"
      description="AreeLive operates with high standards of platform safety, content integrity, and user protection. Safety is not an afterthought — it is foundational to everything we build."
    >
      <section
        aria-label="Safety principles"
        className="mx-auto grid max-w-5xl gap-5 px-6 pb-20 md:grid-cols-2"
      >
        {principles.map((principle) => (
          <OpportunityCard key={principle.title} {...principle} />
        ))}
      </section>
      <section className="border-t border-border/30 bg-card/20 px-6 py-16 text-center">
        <span className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck aria-hidden="true" className="h-5 w-5" />
        </span>
        <h2 className="text-2xl font-bold">Our Commitment to Platform Integrity</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          AreeLive takes its responsibilities as a global platform operator seriously. We work with
          our community to improve safety systems, respond to emerging issues, and maintain the
          trust of our users, creators, and partners.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
          <Link to="/support" hash="report" className="text-primary underline underline-offset-4">
            Report a concern
          </Link>
          <Link
            to="/terms"
            hash="acceptable-use"
            className="text-primary underline underline-offset-4"
          >
            Read our community standards
          </Link>
        </div>
      </section>
    </OpportunityLayout>
  );
}
