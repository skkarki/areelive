import { createFileRoute } from "@tanstack/react-router";
import {
  ShoppingBag,
  Store,
  BadgeCheck,
  Search,
  TrendingUp,
  Radio,
  Handshake,
  Shirt,
  Sparkles,
  Palette,
  Heart,
  Watch,
} from "lucide-react";
import { OpportunityCard, OpportunityLayout } from "@/components/opportunity-layout";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "AreeLive Shop — Discover Products & Live Shopping" },
      {
        name: "description",
        content:
          "Explore AreeLive Shop: business storefronts, product discovery, live shopping, and opportunities for small businesses to become sellers.",
      },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
});

const categories = [
  { icon: Shirt, name: "Fashion" },
  { icon: Sparkles, name: "Beauty" },
  { icon: Palette, name: "Handmade" },
  { icon: Heart, name: "Lifestyle" },
  { icon: Watch, name: "Accessories" },
];
const shopFeatures = [
  {
    icon: BadgeCheck,
    title: "Verified Business / Seller Profiles",
    description:
      "Learn about the businesses behind the products through verified business and seller profiles.",
  },
  {
    icon: Store,
    title: "Business Storefronts",
    description:
      "Explore seller storefronts with product listings that bring a business’s collection together.",
  },
  {
    icon: Search,
    title: "Product Discovery",
    description: "Discover products across Fashion, Beauty, Handmade, Lifestyle, and Accessories.",
  },
  {
    icon: TrendingUp,
    title: "Trending Products",
    description: "Explore trending products as part of product discovery in the AreeLive app.",
  },
  {
    icon: Radio,
    title: "Live Shopping",
    description:
      "Businesses can showcase products during livestreams, bringing product demonstrations into the live experience.",
  },
  {
    icon: Handshake,
    title: "Creator & Business Collaborations",
    description:
      "Creators and businesses can collaborate to promote products through livestreams and live-commerce campaigns.",
  },
];

function ShopPage() {
  return (
    <OpportunityLayout
      eyebrow="AreeLive Shop"
      title="Discover Products. Experience Them Live."
      description="AreeLive brings small businesses, creators, and product discovery together through business storefronts and live shopping in the app."
    >
      <section aria-labelledby="shop-categories" className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-2xl border border-primary/30 bg-card/60 p-6 shadow-glow md:p-8">
          <div className="flex items-center gap-3">
            <ShoppingBag aria-hidden="true" className="h-6 w-6 text-primary" />
            <h2 id="shop-categories" className="text-xl font-bold">
              Explore AreeLive Shop
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Find your interests across product categories, then discover storefronts and live
            product showcases in AreeLive.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map(({ icon: Icon, name }) => (
              <div key={name} className="rounded-xl border border-border bg-primary/5 p-5">
                <Icon aria-hidden="true" className="mb-4 h-6 w-6 text-primary" />
                <h3 className="text-sm font-semibold">{name}</h3>
              </div>
            ))}
          </div>
          <a
            href="/#download"
            className="gradient-primary mt-6 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-white shadow-glow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Get AreeLive to Explore the Shop
          </a>
        </div>
      </section>
      <section
        aria-label="Shop features"
        className="mx-auto grid max-w-5xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3"
      >
        {shopFeatures.map((feature) => (
          <OpportunityCard key={feature.title} {...feature} />
        ))}
      </section>
      <section
        id="sell"
        aria-labelledby="sell-heading"
        className="scroll-mt-28 border-t border-border/30 bg-card/20 px-6 py-16"
      >
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">
            For Small Businesses
          </p>
          <h2 id="sell-heading" className="mt-4 text-3xl font-bold">
            Sell on AreeLive
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Small businesses can apply to become sellers. Introduce your business, product
            categories, and plans for a storefront or live shopping through our existing Business
            Cooperation enquiry workflow.
          </p>
          <a
            href="/business#business-enquiry"
            className="gradient-primary mt-6 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-white shadow-glow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Sell on AreeLive
          </a>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Select “Other Business Enquiry” and describe your seller application in the proposal
            field.
          </p>
          <a
            href="/business#promote"
            className="mt-6 inline-block rounded-sm text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Promote With Us
          </a>
        </div>
      </section>
    </OpportunityLayout>
  );
}
