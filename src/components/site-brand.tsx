import { Link } from "@tanstack/react-router";

export function SiteBrand() {
  return (
    <Link
      to="/"
      aria-label="AreeLive home"
      className="inline-flex shrink-0 items-center gap-2 rounded-sm text-3xl font-bold italic tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <img
        src="/areelive-logo.svg"
        width="32"
        height="40"
        alt=""
        className="shrink-0 object-contain"
        aria-hidden="true"
      />
      AreeLive
    </Link>
  );
}
