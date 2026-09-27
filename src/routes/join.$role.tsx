import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ApplicationForm, ROLE_META, type RoleKey } from "@/components/application-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

const VALID_ROLES: RoleKey[] = [
  "creator", "agency", "merchant", "admin", "recruiter", "agency_manager", "host",
];

function isRoleKey(v: string): v is RoleKey {
  return (VALID_ROLES as string[]).includes(v);
}

export const Route = createFileRoute("/join/$role")({
  loader: ({ params }) => {
    if (!isRoleKey(params.role)) throw notFound();
    return { role: params.role as RoleKey };
  },
  head: ({ loaderData }) => {
    const label = loaderData ? ROLE_META[loaderData.role].label : "Application";
    return {
      meta: [
        { title: `Apply as ${label} — AREELIVE` },
        { name: "description", content: `Submit your application to join AREELIVE as ${label}.` },
        { property: "og:title", content: `Apply as ${label} — AREELIVE` },
        { property: "og:description", content: `Submit your application to join AREELIVE as ${label}.` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: RoleApply,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl p-10 text-center">
      <h1 className="text-2xl font-bold">Role not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">Pick a role from the list below.</p>
      <Button asChild className="mt-4"><Link to="/join">Back to Join AREELIVE</Link></Button>
    </div>
  ),
});

function RoleApply() {
  const { role } = Route.useLoaderData() as { role: RoleKey };
  const label = ROLE_META[role].label;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-black tracking-tight">AREELIVE</Link>
          <nav className="flex items-center gap-2">
            <Link to="/join" className="text-sm text-muted-foreground hover:text-foreground">All roles</Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 text-center">
          <Badge variant="secondary" className="mb-4"><Sparkles className="mr-1 h-3.5 w-3.5" />Application</Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Apply as {label}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
            Fill in the form below. Our team reviews every application and will contact you soon.
          </p>
          <Button asChild variant="ghost" size="sm" className="mt-4">
            <Link to="/join"><ArrowLeft className="mr-1 h-4 w-4" />Choose a different role</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <ApplicationForm initialRole={role} lockRole idPrefix={`join-${role}`} />
      </section>
    </div>
  );
}
