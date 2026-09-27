import { ArrowRight, Phone, ShoppingBag, Megaphone } from "lucide-react";

const highlights = [
  {
    icon: Phone,
    title: "Connect Beyond Live",
    description: "Connect one-to-one through private audio and video experiences on AreeLive.",
    href: "/features#calls",
    label: "Explore Audio & Video Calls",
  },
  {
    icon: ShoppingBag,
    title: "AreeLive Shop / Live Shopping",
    description:
      "Discover products and business storefronts, and see products showcased during livestreams.",
    href: "/shop",
    label: "Explore AreeLive Shop",
  },
  {
    icon: Megaphone,
    title: "Promote With Us",
    description:
      "Bring your business to AreeLive through advertising, creator collaborations, and live-commerce campaigns.",
    href: "/business#promote",
    label: "Promote With Us",
  },
];

export function EcosystemHighlights() {
  return (
    <div className="mt-10 space-y-6">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Live Streaming • Audio Calls • Video Calls • Virtual Gifts • Live Shopping • Business
        Promotion
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description, href, label }) => (
          <article
            key={title}
            className="flex flex-col rounded-xl border border-border bg-card/60 p-6"
          >
            <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3 className="text-sm font-bold">{title}</h3>
            <p className="mt-2 mb-5 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <a
              href={href}
              className="mt-auto inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {label}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
            {title === "AreeLive Shop / Live Shopping" && (
              <a
                href="/shop#sell"
                className="mt-3 w-fit rounded-sm text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Sell on AreeLive
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
