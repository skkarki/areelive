import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function LegalShell({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-black tracking-tight">AREELIVE</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/join" className="text-muted-foreground hover:text-foreground">Join</Link>
            <Link to="/invite-broadcaster" className="text-muted-foreground hover:text-foreground">Invite</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <article className="mt-8 text-[15px] leading-7 text-foreground/90 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-primary [&_a]:underline [&_strong]:text-foreground">
          {children}
        </article>
      </main>
    </div>
  );
}