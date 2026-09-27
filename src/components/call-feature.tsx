import { Phone, Video, Mic, UserRound, LockKeyhole } from "lucide-react";

export function CallFeature() {
  return (
    <section
      id="calls"
      aria-labelledby="calls-heading"
      className="mx-auto grid max-w-5xl scroll-mt-28 items-center gap-10 px-6 pb-20 md:grid-cols-2"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-secondary">
          Audio &amp; Video Calls
        </p>
        <h2 id="calls-heading" className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Connect Beyond Live
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Connect one-to-one through private audio and video experiences on AreeLive.
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          {[
            { icon: Phone, label: "One-to-one audio calls" },
            { icon: Video, label: "One-to-one video calls" },
            { icon: LockKeyhole, label: "Private creator/user interactions" },
          ].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
              {label}
            </li>
          ))}
        </ul>
        <a
          href="/#download"
          className="gradient-primary mt-7 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-white shadow-glow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Get AreeLive
        </a>
      </div>
      <figure className="rounded-2xl border border-primary/30 bg-card/60 p-4 shadow-glow sm:p-6">
        <div
          aria-hidden="true"
          className="relative overflow-hidden rounded-xl border border-border bg-background p-6 text-center"
        >
          <div className="absolute inset-0 gradient-hero" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <LockKeyhole className="h-3 w-3" />
              Private connection
            </span>
            <div className="relative mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
              <UserRound className="h-12 w-12 text-primary" />
              <span className="gradient-primary absolute -right-2 bottom-0 flex h-12 w-12 items-center justify-center rounded-full border-4 border-card text-white">
                <UserRound className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-6 flex h-8 items-center justify-center gap-1.5">
              {[12, 20, 28, 16, 32, 24, 14, 26, 18].map((height, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-full gradient-primary"
                  style={{ height }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold">Your conversation. Your connection.</p>
            <div className="mt-6 flex justify-center gap-4">
              {[Mic, Video, Phone].map((Icon, index) => (
                <span
                  key={index}
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${index === 2 ? "gradient-primary text-white" : "bg-muted text-foreground"}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
        </div>
        <figcaption className="mt-4 text-center text-xs text-muted-foreground">
          Audio &amp; Video Calls in the AreeLive app · Illustrative preview
        </figcaption>
      </figure>
    </section>
  );
}
