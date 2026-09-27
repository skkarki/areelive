import { Link } from "@tanstack/react-router";

export function SiteBrand() {
  return (
    <Link
      to="/"
      aria-label="AreeLive home"
      className="inline-flex shrink-0 items-center gap-2 rounded-sm text-3xl font-bold italic tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <svg
        width="32"
        height="40"
        viewBox="0 0 34 40"
        fill="none"
        className="text-violet-600"
        aria-hidden="true"
      >
        <circle cx="6" cy="20" r="4" fill="currentColor" />
        <path
          d="M13 12 Q24 20 13 28 M17 7 Q34 20 17 33 M21 2 Q44 20 21 38"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      AreeLive
    </Link>
  );
}
