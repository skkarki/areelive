import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Radio as RadioIcon, ShieldCheck, Briefcase, Store, Sparkles, Check, ArrowRight } from "lucide-react";

type RoleKey = "creator" | "agency" | "merchant" | "admin" | "recruiter" | "agency_manager";

const ROLES: {
  key: RoleKey;
  label: string;
  cta: string;
  icon: typeof Building2;
  description: string;
  bullets: string[];
  featured?: boolean;
}[] = [
  {
    key: "creator",
    label: "Apply as Creator",
    cta: "Apply as Creator",
    icon: RadioIcon,
    description: "Go live, build an audience, receive gifts, and grow your community on AREELIVE.",
    bullets: ["Go live in seconds", "Receive virtual gifts", "Climb the leaderboards"],
    featured: true,
  },
  {
    key: "agency",
    label: "Apply as Agency",
    cta: "Apply as Agency",
    icon: Building2,
    description: "Bring hosts and creators to AREELIVE. Strong performance unlocks bonuses and higher privileges.",
    bullets: ["Onboard hosts at scale", "Performance bonuses", "Priority agency support"],
    featured: true,
  },
  {
    key: "merchant",
    label: "Apply as Merchant",
    cta: "Apply as Merchant",
    icon: Store,
    description: "Sell products, run promotions, and partner with creators to reach engaged live audiences.",
    bullets: ["Reach live audiences", "Partner with creators", "Promo tools & analytics"],
    featured: true,
  },
  {
    key: "admin",
    label: "Apply as Admin",
    cta: "Apply as Admin",
    icon: ShieldCheck,
    description: "Support platform operations, user support, moderation, onboarding, and community management.",
    bullets: ["Operations & moderation", "User support", "Community management"],
    featured: true,
  },
  {
    key: "recruiter",
    label: "Apply as Recruiter / Talent Scout",
    cta: "Apply as Recruiter",
    icon: Users,
    description: "Bring many quality users, hosts, or creators. Earn bonuses based on the active hosts you bring.",
    bullets: ["Earn per active host", "Quality-based rewards", "Grow your network"],
  },
  {
    key: "agency_manager",
    label: "Apply as Agency Manager",
    cta: "Apply as Agency Manager",
    icon: Briefcase,
    description: "Manage agencies, guide hosts, track performance, and help grow the creator network.",
    bullets: ["Manage multiple agencies", "Track host performance", "Grow the network"],
  },
];

export const Route = createFileRoute("/join")({
  component: JoinPage,
  head: () => ({
    meta: [
      { title: "Join AREELIVE — Apply as Creator, Agency, Merchant, Admin" },
      { name: "description", content: "Apply to join AREELIVE as a creator, agency, merchant, admin, recruiter, or agency manager. Earn bonuses and unlock growth opportunities." },
      { property: "og:title", content: "Join AREELIVE — Applications Open" },
      { property: "og:description", content: "Apply as creator, agency, merchant, admin, recruiter, or agency manager." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Join AREELIVE" },
      { name: "twitter:description", content: "Apply as creator, agency, merchant, admin, recruiter, or agency manager." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => <div className="p-8 text-center">Not found</div>,
});

function JoinPage() {
  const roleMatch = useMatch({ from: "/join/$role", shouldThrow: false });
  if (roleMatch) return <Outlet />;

  return (
    <div className="min-h-screen bg-background text-foreground">

      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
          <Badge variant="secondary" className="mb-4"><Sparkles className="mr-1 h-3.5 w-3.5" />Applications open</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">Join AREELIVE</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
            Pick the path that fits you. Each application has its own page with the right questions for your role.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => {
            const Icon = r.icon;
            return (
              <Card key={r.key} className={r.featured ? "border-primary/40" : ""}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-5 w-5" /></div>
                    <CardTitle className="text-lg">{r.label}</CardTitle>
                  </div>
                  <CardDescription className="pt-2">{r.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{b}</li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link to="/join/$role" params={{ role: r.key }}>
                      {r.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
