import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

export const Route = createFileRoute("/referral-policy")({
  component: ReferralPolicyPage,
  head: () => ({
    meta: [
      { title: "Broadcaster Invite & Earn Policy — AREELIVE" },
      { name: "description", content: "Rules and conditions for the AREELIVE Broadcaster Invite & Earn program, including bonus eligibility and abuse policy." },
      { property: "og:title", content: "AREELIVE Broadcaster Invite & Earn Policy" },
      { property: "og:description", content: "Rules and bonus conditions for AREELIVE's Broadcaster Invite & Earn program." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "/referral-policy" }],
  }),
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function ReferralPolicyPage() {
  return (
    <LegalShell title="Referral / Invite Bonus Policy" updated="July 5, 2026">
      <p>
        This Policy explains the rules of the AREELIVE <strong>Broadcaster Invite &amp; Earn Program</strong>.
        It is part of, and should be read together with, our{" "}
        <Link to="/terms" className="underline">Terms &amp; Conditions</Link> and{" "}
        <Link to="/privacy" className="underline">Privacy Policy</Link>.
      </p>

      <h2>1. Broadcaster Invite &amp; Earn Program</h2>
      <ul>
        <li>
          Existing broadcasters on AREELIVE may invite broadcaster friends to join AREELIVE
          <strong> without becoming an agency</strong>. The Invite &amp; Earn Program is separate from the
          Agency program.
        </li>
        <li>
          Eligible users may earn a <strong>one-time bonus</strong> for each approved invited broadcaster,
          subject to the conditions below.
        </li>
        <li>Conditions apply. Not every referral results in a bonus.</li>
      </ul>

      <h2>2. When a bonus is released</h2>
      <p>A referral bonus is released only after the invited broadcaster:</p>
      <ul>
        <li>Has been reviewed and approved by AREELIVE;</li>
        <li>Has completed any required verification or KYC;</li>
        <li>Has met AREELIVE's minimum <strong>activity, quality, and performance</strong> requirements;</li>
        <li>Is confirmed to be a genuine, new AREELIVE broadcaster.</li>
      </ul>

      <h2>3. Ineligible referrals</h2>
      <p>The following are not eligible for a bonus:</p>
      <ul>
        <li>Self-referrals or referrals of your own alternate accounts;</li>
        <li>Duplicate referrals of the same person by one or more users;</li>
        <li>Referrals of users who are already on AREELIVE;</li>
        <li>Referrals of fake accounts, bots, or inactive users;</li>
        <li>Referrals tied to fraud, coercion, spam, or other suspicious activity;</li>
        <li>Referrals that violate these Terms or applicable law.</li>
      </ul>

      <h2>4. AREELIVE's rights</h2>
      <p>
        AREELIVE has the right to <strong>approve, reject, delay, cancel, or reverse</strong> any bonus if
        we determine, in our reasonable discretion, that a referral involves abuse, fraud, or a policy
        violation. We may also request additional information or documentation before releasing a bonus.
      </p>

      <h2>5. Changes to the Program</h2>
      <p>
        The bonus amount, payment method, currency, timing, and eligibility rules may change from time to
        time. AREELIVE may pause, modify, or end the Program at any time, with or without notice, to the
        extent permitted by law.
      </p>

      <h2>6. Taxes, fees &amp; local compliance</h2>
      <p>
        Depending on your country of residence, taxes, fees, or other local compliance requirements may
        apply to any bonus you receive. You are responsible for reporting and paying any taxes required by
        law. AREELIVE may withhold amounts or request tax documentation where required.
      </p>

      <h2>7. Data &amp; consent</h2>
      <p>
        When you submit a referral, we process personal data about you and the invited broadcaster as
        described in our <Link to="/privacy" className="underline">Privacy Policy</Link>. You must only
        submit another person's information if you have their permission.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about the Program? Email{" "}
        <a href="mailto:referrals@areelive.app">referrals@areelive.app</a>.
      </p>
    </LegalShell>
  );
}