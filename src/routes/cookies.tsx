import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
  head: () => ({
    meta: [
      { title: "Cookie & Tracking Notice — AREELIVE" },
      { name: "description", content: "How AREELIVE uses cookies, referral links, invite codes, device identifiers, and analytics." },
      { property: "og:title", content: "AREELIVE Cookie & Tracking Notice" },
      { property: "og:description", content: "Cookies, referral tracking, invite codes, and analytics used by AREELIVE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function CookiesPage() {
  return (
    <LegalShell title="Cookie & Tracking Notice" updated="July 5, 2026">
      <p>
        This Notice explains how AREELIVE uses cookies and similar tracking technologies on our app and
        website. It supplements our <Link to="/privacy" className="underline">Privacy Policy</Link>.
      </p>

      <h2>1. What we use</h2>
      <p>Depending on the surface and your settings, AREELIVE may use:</p>
      <ul>
        <li><strong>Cookies and local storage</strong> to keep you signed in and remember preferences;</li>
        <li><strong>Referral links and invite codes</strong> to attribute broadcaster referrals to the correct inviter;</li>
        <li><strong>Device identifiers</strong> to detect fraud, duplicate accounts, and abuse;</li>
        <li><strong>Analytics</strong> to understand how the Services are used and to improve them;</li>
        <li><strong>Campaign and performance tracking</strong> to measure marketing and program performance.</li>
      </ul>

      <h2>2. Why we use them</h2>
      <ul>
        <li>Operate core features (sign-in, sessions, security);</li>
        <li>Attribute broadcaster referrals and calculate bonus eligibility;</li>
        <li>Prevent fraud, spam, and self-referrals;</li>
        <li>Understand aggregate usage patterns and improve product experience;</li>
        <li>Measure the effectiveness of campaigns and programs.</li>
      </ul>

      <h2>3. Third parties</h2>
      <p>
        Some cookies and identifiers are set by trusted service providers (for example, analytics, error
        monitoring, and payment providers) that help us run the Services. These providers process data on
        our behalf under appropriate agreements.
      </p>

      <h2>4. Your choices</h2>
      <ul>
        <li>You can control cookies through your browser settings.</li>
        <li>You can control device-level ad and analytics identifiers through your operating system.</li>
        <li>
          Blocking essential cookies may prevent parts of the Services (including sign-in and referral
          attribution) from working correctly.
        </li>
      </ul>

      <h2>5. Changes</h2>
      <p>
        We may update this Notice from time to time. When we do, we will update the "Last updated" date
        above.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about tracking or cookies? Email{" "}
        <a href="mailto:privacy@areelive.app">privacy@areelive.app</a>.
      </p>
    </LegalShell>
  );
}