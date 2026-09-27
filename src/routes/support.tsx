import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "AREELIVE Support — Help Center" },
      { name: "description", content: "Get help with your AREELIVE account, live streaming, gifts, payouts, agency onboarding, and broadcaster referrals." },
      { property: "og:title", content: "AREELIVE Support" },
      { property: "og:description", content: "Help with AREELIVE accounts, live streaming, gifts, and payouts." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://areelive.com/support" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://areelive.com/support" }],
  }),
});

function SupportPage() {
  return (
    <LegalShell title="AREELIVE Support" updated="July 5, 2026">
      <p>
        Need help with AREELIVE? Pick the topic that matches your question, or email us any time at{" "}
        <a href="mailto:support@areelive.com">support@areelive.com</a>.
      </p>

      <h2 id="creators" className="scroll-mt-24">Help for creators &amp; hosts</h2>
      <p>
        Going live, virtual gifts, VIP tiers, leaderboards, entry effects, and creator levels. If your
        stream won't start, your gifts aren't showing, or your profile needs updating, email{" "}
        <a href="mailto:support@areelive.com">support@areelive.com</a> from the address on your account
        and include your AREELIVE ID.
      </p>
      <ul>
        <li><a href="/join/creator">Apply as a Host / Broadcaster</a></li>
        <li><a href="/invite-broadcaster">Invite a broadcaster friend &amp; earn</a></li>
      </ul>

      <h2 id="agencies" className="scroll-mt-24">Help for agencies &amp; recruiters</h2>
      <p>
        Agency onboarding, recruiter approvals, host rosters, and performance bonuses. Email{" "}
        <a href="mailto:support@areelive.com">support@areelive.com</a> with your agency or recruiter name.
      </p>
      <ul>
        <li><a href="/join/agency">Apply as an Agency</a></li>
        <li><a href="/join/recruiter">Apply as a Recruiter / Talent Scout</a></li>
        <li><a href="/join/agency_manager">Apply as an Agency Manager</a></li>
        <li><a href="/join/admin">Apply as Admin</a></li>
      </ul>

      <h2 id="technical" className="scroll-mt-24">Account &amp; payment support</h2>
      <p>
        Sign-in issues, profile changes, payout timing, withdrawal methods, or missing earnings — email{" "}
        <a href="mailto:support@areelive.com">support@areelive.com</a> and we'll look it up. Never share
        your password with anyone; AREELIVE will never ask for it.
      </p>

      <h2 id="report" className="scroll-mt-24">Report an issue</h2>
      <p>
        See a bug, abusive behavior, or a safety concern? Report it to{" "}
        <a href="mailto:support@areelive.com">support@areelive.com</a> with as much detail as possible
        (screenshots, usernames, timestamps). Our trust &amp; safety team reviews every report.
      </p>

      <h2>Still need help?</h2>
      <p>
        Visit our <a href="/contact">contact page</a> or email{" "}
        <a href="mailto:support@areelive.com">support@areelive.com</a>. We reply within 1–2 business days.
      </p>
    </LegalShell>
  );
}
