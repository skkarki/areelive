import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Gift, Trophy, Crown, Zap, Wallet, Radio, Users, Star, ArrowRight, Apple, Smartphone, Globe, QrCode, Info, Download, Mail, Check, Loader2 } from "lucide-react";
import { useState, useId, type FormEvent } from "react";
import { useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { trackEvent, type AnalyticsPayload } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero.jpg";
import phoneImg from "@/assets/phone-mockup.png";
import { JoinSection } from "@/components/join-section";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AreeLive — Go Live, Get Gifted, Grow Your Fandom" },
      {
        name: "description",
        content:
          "AreeLive is the live streaming app for creators. Go live in seconds, receive virtual gifts, climb leaderboards, and cash out with instant payouts.",
      },
      { property: "og:title", content: "AreeLive — Go Live, Get Gifted, Grow Your Fandom" },
      {
        property: "og:description",
        content:
          "The live streaming app for creators. Gifts, VIP tiers, leaderboards, and instant payouts.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      {
        property: "og:image",
        content:
          "https://id-preview--14baeff1-8712-4dc3-ae58-8895104e1f57.lovable.app/__l5e/assets-v1/62ab2976-fcd1-482a-a9ec-bdfa0abfabd9/og-areelive.jpg",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "640" },
      { property: "og:image:alt", content: "AREELIVE — Go Live, Get Gifted, Grow Your Fandom" },
      { name: "twitter:title", content: "AreeLive — Go Live, Get Gifted, Grow Your Fandom" },
      {
        name: "twitter:description",
        content:
          "The live streaming app for creators. Gifts, VIP tiers, leaderboards, and instant payouts.",
      },
      {
        name: "twitter:image",
        content:
          "https://id-preview--14baeff1-8712-4dc3-ae58-8895104e1f57.lovable.app/__l5e/assets-v1/62ab2976-fcd1-482a-a9ec-bdfa0abfabd9/og-areelive.jpg",
      },
      { name: "twitter:image:alt", content: "AREELIVE — Go Live, Get Gifted, Grow Your Fandom" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AreeLive",
          applicationCategory: "SocialNetworkingApplication",
          operatingSystem: "iOS, Android",
          description:
            "Live streaming app for creators with virtual gifts, VIP tiers, leaderboards, and instant payouts.",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "2400000",
          },
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
});

function Index() {
  useEffect(() => {
    trackEvent("page_view", { location: "home", path: "/" });
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main id="main">
        <Hero />
        <Features />
        <HowItWorks />
        <Creators />
        <JoinSection />
        <CTA />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative gradient-hero">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Now live in 30+ countries
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
            Go live.<br />
            Get gifted.<br />
            <span className="text-gradient-primary">Grow your fandom.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            AreeLive turns any moment into a show. Stream in seconds, receive
            virtual gifts from your fans, climb the leaderboards, and cash out
            straight to your wallet.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#download"
              onClick={() => trackEvent("download_click", { location: "hero", platform: "web" })}
              className="group relative inline-flex"
            >
              <span className="absolute -inset-1 gradient-primary opacity-70 blur-lg rounded-full group-hover:opacity-100 transition" />
              <Button
                size="lg"
                className="relative gradient-primary text-white border-0 shadow-glow rounded-full font-bold text-base h-14 px-10 hover:scale-[1.03] transition-transform"
              >
                Get AreeLive — Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="#how">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-14 px-8 border-border/70 bg-card/40 backdrop-blur font-semibold"
              >
                Watch a live show
              </Button>
            </a>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {["gradient-primary", "gradient-gold", "gradient-primary"].map((g, i) => (
                <span key={i} className={`w-6 h-6 rounded-full border-2 border-background ${g}`} />
              ))}
            </div>
            Free to download · iOS &amp; Android · No credit card
          </div>
          <div className="flex items-center gap-8 pt-4">
            {[
              { k: "2.4M+", v: "Creators" },
              { k: "180M", v: "Gifts sent" },
              { k: "4.8★", v: "App rating" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-2xl font-bold text-gradient-gold">{s.k}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-10 gradient-primary opacity-30 blur-3xl rounded-full" />
          <img
            src={heroImg}
            alt="AreeLive streaming stage with neon lights"
            width={1536}
            height={1024}
            fetchPriority="high"
            className="relative rounded-3xl border border-border/60 shadow-glow"
          />
          <img
            src={phoneImg}
            alt="AreeLive app on a phone"
            width={768}
            height={1024}
            loading="lazy"
            className="absolute -bottom-10 -left-10 w-48 md:w-64 drop-shadow-2xl hidden sm:block"
          />
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Radio, title: "One-tap Go Live", desc: "Launch a broadcast in under 3 seconds with adaptive HD streaming." },
    { icon: Gift, title: "Rich Gift Store", desc: "Roses, rockets, sports cars — animated gifts that make your show pop." },
    { icon: Crown, title: "VIP Tiers", desc: "Reward your biggest fans with badges, entry effects, and exclusive perks." },
    { icon: Trophy, title: "Leaderboards", desc: "Daily, weekly, and regional charts. Compete, climb, and get discovered." },
    { icon: Wallet, title: "Instant Payouts", desc: "Convert gifts to earnings and withdraw to your bank in one tap." },
    { icon: Zap, title: "Entry Effects", desc: "Roll out the red carpet with cinematic animations when top fans arrive." },
  ];
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-2xl mb-14">
        <p className="text-sm uppercase tracking-widest text-accent font-semibold">Features</p>
        <h2 className="text-4xl md:text-5xl font-black mt-3">Everything you need to <span className="text-gradient-primary">put on a show</span>.</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((f) => (
          <div key={f.title} className="glass-card p-8 hover:border-primary/60 transition group">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow mb-5 group-hover:scale-110 transition">
              <f.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Create your profile", desc: "Pick a handle, add your vibe, and set your first stream category." },
    { n: "02", title: "Go live", desc: "Tap the pink button. AreeLive handles the rest — encoding, chat, moderation." },
    { n: "03", title: "Get gifted & cash out", desc: "Fans send gifts. You watch coins pile up. Withdraw whenever you want." },
  ];
  return (
    <section id="how" className="border-y border-border/50 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <p className="text-sm uppercase tracking-widest text-accent font-semibold">How it works</p>
          <h2 className="text-4xl md:text-5xl font-black mt-3">From download to <span className="text-gradient-gold">first payout</span>.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="glass-card p-8">
              <div className="text-5xl font-black text-gradient-primary mb-4">{s.n}</div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Creators() {
  return (
    <section id="creators" className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
      <div className="relative order-2 lg:order-1">
        <div className="absolute -inset-6 gradient-gold opacity-30 blur-3xl rounded-full" />
        <div className="relative glass-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary" />
              <div>
                <div className="font-bold">@nova.live</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accent text-accent" /> Level 42 · Diamond
                </div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full gradient-gold text-xs font-bold text-background">VIP 6</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "This week", v: "$8,420" },
              { l: "Gifts", v: "24.1k" },
              { l: "Fans", v: "312k" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-background/60 border border-border/50 p-3 text-center">
                <div className="text-lg font-bold">{s.v}</div>
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl gradient-primary p-4 flex items-center justify-between shadow-glow">
            <div>
              <div className="text-xs text-white/80">Next payout</div>
              <div className="text-2xl font-bold text-white">$1,240.00</div>
            </div>
            <Button size="sm" className="bg-white text-primary hover:bg-white/90 rounded-full font-semibold">
              Withdraw
            </Button>
          </div>
        </div>
      </div>
      <div className="order-1 lg:order-2 space-y-6">
        <p className="text-sm uppercase tracking-widest text-accent font-semibold">For creators</p>
        <h2 className="text-4xl md:text-5xl font-black leading-tight">
          Turn your audience into <span className="text-gradient-primary">income</span>.
        </h2>
        <p className="text-lg text-muted-foreground">
          AreeLive pays out up to 60% of gift value. Track your progress with
          live analytics, unlock creator levels and medals, and grow with our
          agency program.
        </p>
        <ul className="space-y-3">
          {["Transparent revenue split", "Weekly withdrawals with no minimum", "Dedicated creator support", "Agency & talent programs"].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center">
                <Users className="w-3 h-3 text-background" />
              </span>
              <span className="text-sm">{t}</span>
            </li>
          ))}
        </ul>
        <Link to="/join/$role" params={{ role: "creator" }}>
          <Button size="lg" className="gradient-primary text-white border-0 shadow-glow rounded-full font-semibold h-12 px-8">
            Apply as a creator
          </Button>
        </Link>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="download" className="max-w-6xl mx-auto px-6 pb-24 scroll-mt-24">
      <div className="relative overflow-hidden rounded-4xl gradient-primary p-8 md:p-16 shadow-glow">
        <div className="absolute inset-0 opacity-30 gradient-hero" />
        <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold">
              <Download className="w-3.5 h-3.5" /> Free download
            </div>
            <h2 className="text-4xl md:text-6xl font-black">The stage is yours.</h2>
            <p className="text-white/90 text-lg max-w-xl">
              Three quick steps and you're broadcasting. Pick your platform below.
            </p>
            <ol className="space-y-3 text-white/90 max-w-md">
              {[
                "Install AreeLive on your device",
                "Sign up with your phone or email",
                "Tap Go Live — you're on stage",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-white text-primary font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <DownloadOptions />
        </div>
      </div>
    </section>
  );
}

function DownloadOptions() {
  const options: {
    icon: typeof Apple;
    label: string;
    sub: string;
    href: string;
    platform: NonNullable<AnalyticsPayload["platform"]>;
    external?: boolean;
    fallback?: string;
  }[] = [
    {
      icon: Apple,
      label: "Download on iOS",
      sub: "App Store · iPhone & iPad",
      href: "https://apps.apple.com/app/areelive",
      platform: "ios",
      external: true,
      fallback: "Not on the App Store in your country yet? Join the TestFlight waitlist via support@areelive.app.",
    },
    {
      icon: Smartphone,
      label: "Download on Android",
      sub: "Google Play · Android 8+",
      href: "https://play.google.com/store/apps/details?id=app.areelive",
      platform: "android",
      external: true,
      fallback: "Play Store unavailable? Grab the signed APK from areelive.app/apk and enable installs from unknown sources.",
    },
    {
      icon: Globe,
      label: "Open Web App",
      sub: "Chrome, Safari, Edge",
      href: "https://web.areelive.app",
      platform: "web",
      external: true,
      fallback: "Works in any modern browser. On mobile, add to Home Screen for a full-screen experience.",
    },
  ];

  return (
    <div className="glass-card p-6 space-y-3 bg-background/70">
      {options.map((o) => (
        <a
          key={o.label}
          href={o.href}
          target={o.external ? "_blank" : undefined}
          rel={o.external ? "noopener noreferrer" : undefined}
          onClick={() =>
            trackEvent("download_click", {
              platform: o.platform,
              location: "download_section",
              href: o.href,
            })
          }
          data-analytics-event="download_click"
          data-analytics-platform={o.platform}
          className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/60 hover:bg-card p-4 transition"
        >
          <span className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
            <o.icon className="w-6 h-6 text-white" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-bold">{o.label}</div>
            <div className="text-xs text-muted-foreground truncate">{o.sub}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition" />
        </a>
      ))}

      <EmailSignup />

      <div className="rounded-2xl border border-border/60 bg-card/40 p-4 flex gap-3">
        <QrCode className="w-8 h-8 text-accent flex-shrink-0" />
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Scan to install</span>
          <br />
          Open your camera and point it at the QR on areelive.app/get to install on the right platform automatically.
        </div>
      </div>

      <details className="rounded-2xl border border-border/60 bg-card/40 p-4 text-xs text-muted-foreground group">
        <summary className="flex items-center gap-2 cursor-pointer font-semibold text-foreground list-none">
          <Info className="w-4 h-4 text-accent" />
          Store not available in your region?
          <ArrowRight className="w-3 h-3 ml-auto group-open:rotate-90 transition-transform" />
        </summary>
        <ul className="mt-3 space-y-2 pl-6 list-disc">
          {options
            .filter((o) => o.fallback)
            .map((o) => (
              <li key={o.label}>
                <span className="font-semibold text-foreground">{o.label.replace("Download on ", "").replace("Open ", "")}:</span>{" "}
                {o.fallback}
              </li>
            ))}
          <li>
            Still stuck? Email{" "}
            <a href="mailto:support@areelive.app" className="text-accent underline">
              support@areelive.app
            </a>{" "}
            and we'll send a direct install link.
          </li>
        </ul>
      </details>
    </div>
  );
}

const emailSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email")
  .email("Enter a valid email address")
  .max(255, "Email is too long");

function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const emailId = useId();
  const msgId = `${emailId}-msg`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Enter a valid email");
      return;
    }

    setStatus("loading");
    trackEvent("email_signup_submit", { location: "download_section" });

    const { error } = await supabase.from("waitlist").insert({
      email: parsed.data.toLowerCase(),
      source: "download_section",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });

    if (error) {
      // Unique violation = already on the list. Treat as success.
      if (error.code === "23505") {
        trackEvent("email_signup_success", { location: "download_section", duplicate: true });
        setStatus("success");
        setMessage("You're already on the list — we'll be in touch soon.");
        setEmail("");
        return;
      }
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      return;
    }

    trackEvent("email_signup_success", { location: "download_section" });
    setStatus("success");
    setMessage("You're on the list. We'll email you the moment AreeLive launches.");
    setEmail("");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-accent/60 bg-accent/10 p-4 flex gap-3">
        <span className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-background" />
        </span>
        <div className="text-sm">
          <div className="font-semibold text-foreground">You're in!</div>
          <div className="text-muted-foreground text-xs mt-0.5">{message}</div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border/60 bg-card/40 p-4 space-y-3"
      noValidate
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Mail className="w-4 h-4 text-accent" />
        Or get a launch invite by email
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          id={emailId}
          name="email"
          aria-label="Email address for launch invite"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          aria-invalid={status === "error"}
          aria-describedby={msgId}
          className="bg-background/70 border-border/70 h-11 rounded-full px-4"
          maxLength={255}
          disabled={status === "loading"}
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="gradient-primary text-white border-0 shadow-glow rounded-full font-semibold h-11 px-6"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Notify me <ArrowRight className="ml-1 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
      <p
        id={msgId}
        className={`text-xs ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}
      >
        {status === "error"
          ? message
          : "No spam — just the launch date and early-access invites."}
      </p>
    </form>
  );
}

