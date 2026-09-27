import { useId, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { SiteBrand } from "@/components/site-brand";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { trackEvent } from "@/lib/analytics";

const navigation = [
  { label: "About", href: "/#how" },
  { label: "Features", href: "/features" },
  { label: "Creators", href: "/creators" },
  { label: "Safety", href: "/safety" },
  { label: "Company", href: "/company" },
];
const joinLinks = [
  { label: "Become a Creator / Host", href: "/creators" },
  { label: "Apply as Agent / Agency", href: "/join/agency" },
  { label: "Invite Broadcaster", href: "/invite-broadcaster" },
  { label: "Business Cooperation", href: "/business" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigationId = useId();
  return (
    <header className="sticky top-0 z-50 border-b border-border/20 bg-background/95 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-1 px-4 py-4 md:gap-4 md:px-8">
        <div className="[&_a]:gap-1 [&_a]:text-xl [&_img]:w-6 sm:[&_a]:gap-2 sm:[&_a]:text-3xl sm:[&_img]:w-8">
          <SiteBrand />
        </div>
        <nav
          id={navigationId}
          aria-label="Main navigation"
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col gap-1 border-b border-border bg-background p-4 lg:static lg:flex lg:flex-row lg:items-center lg:gap-7 lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:px-0"
            >
              {item.label}
            </a>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-5 py-3 text-sm font-semibold text-foreground outline-none hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-primary">
              Join <ChevronDown aria-hidden="true" className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-64 rounded-lg border-primary/30 bg-card p-1 shadow-glow"
            >
              {joinLinks.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  asChild
                  className="cursor-pointer rounded-md px-3 py-2.5 focus:bg-primary/15 focus:text-foreground"
                >
                  <a href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <a
            href="/#download"
            onClick={() => {
              setOpen(false);
              trackEvent("download_click", { location: "header", platform: "web" });
            }}
            className="gradient-primary inline-flex shrink-0 items-center justify-center rounded-2xl px-2 py-3 text-xs font-bold text-white shadow-glow transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-3 md:px-6 md:text-sm"
          >
            Get AreeLive
          </a>
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls={navigationId}
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg p-1.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-2 lg:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
