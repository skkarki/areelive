import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — AREELIVE" },
      { name: "description", content: "How AREELIVE collects, uses, and protects personal information from users, applicants, and broadcaster referrals." },
      { property: "og:title", content: "AREELIVE Privacy Policy" },
      { property: "og:description", content: "How AREELIVE handles personal information for applications, recruitment, and referrals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="July 5, 2026">
      <p>
        This Privacy Policy explains how AREELIVE ("we", "us", "our") collects, uses, shares, and protects
        personal information when you use the AREELIVE app, website, and related services (the "Services"),
        including when you apply to join AREELIVE or invite another broadcaster.
      </p>

      <h2>1. Information we collect</h2>
      <p>Depending on how you interact with AREELIVE, we may collect:</p>
      <ul>
        <li>Account information (username, AREELIVE ID, profile details)</li>
        <li>Contact details (email, WhatsApp / phone number)</li>
        <li>Location details (country, city)</li>
        <li>Content you post, stream, or share on the platform</li>
        <li>Device, log, and usage data</li>
      </ul>

      <h2>2. Applications, Recruitment &amp; Referral Data</h2>
      <p>
        AREELIVE collects personal information when users apply as an <strong>Agency, Creator Recruiter /
        Talent Scout, Host / Creator, Admin,</strong> or <strong>Agency Manager</strong>, and when existing
        broadcasters invite other broadcasters through our referral program.
      </p>
      <p>Depending on the application or referral, we may collect:</p>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>WhatsApp / phone number</li>
        <li>Country and city</li>
        <li>AREELIVE ID / username</li>
        <li>Agency name (if applicable)</li>
        <li>Social media or portfolio links</li>
        <li>Experience details and background</li>
        <li>Estimated number of hosts or users the applicant can bring</li>
        <li>Referral relationship between the inviter and the invited broadcaster</li>
        <li>KYC or verification details, where required</li>
        <li>Internal review notes prepared by our team</li>
        <li>Application status and referral status</li>
        <li>Bonus eligibility and payment status, where applicable</li>
      </ul>

      <h3>2.1 How we use this information</h3>
      <ul>
        <li>To review applications submitted to AREELIVE</li>
        <li>To verify applicants and invited broadcasters</li>
        <li>To contact applicants about their submission</li>
        <li>To manage agency, recruiter, host, admin, and agency manager onboarding</li>
        <li>To track referrals and determine bonus eligibility</li>
        <li>To prevent fraud, duplicate applications, fake referrals, and abuse</li>
        <li>To comply with legal, tax, safety, and platform obligations</li>
      </ul>

      <h3>2.2 Third-party information &amp; consent</h3>
      <p>
        If you submit an application or referral that includes another person's information (for example,
        when inviting a broadcaster friend), you must only submit that information if you have their
        permission to share it with AREELIVE for the purposes described in this Policy.
      </p>

      <h2>3. How we share information</h2>
      <p>
        AREELIVE does not sell your personal information. We may share limited application or referral data
        with:
      </p>
      <ul>
        <li>Authorized internal AREELIVE teams (review, operations, moderation, payments)</li>
        <li>Identity and KYC verification providers, where verification is required</li>
        <li>Payment providers, where bonus payment or payouts are involved</li>
        <li>Legal, tax, and compliance advisors</li>
        <li>Service providers that help us operate the platform (hosting, communications, analytics)</li>
        <li>Authorities, when required by law or to protect the safety of users</li>
      </ul>
      <p>We share only what is necessary for the stated purpose.</p>

      <h2>4. Data retention</h2>
      <p>
        We keep application, referral, and bonus records for as long as needed to operate the program,
        prevent abuse, and comply with our legal and tax obligations. When information is no longer needed,
        we delete or anonymize it.
      </p>

      <h2>5. Your rights</h2>
      <p>Subject to local law, you may:</p>
      <ul>
        <li>Request access to the personal data we hold about you</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your data, where legally allowed</li>
        <li>Withdraw consent, where processing is based on consent</li>
        <li>Contact AREELIVE privacy support with questions or complaints</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at <a href="mailto:privacy@areelive.app">privacy@areelive.app</a>.
      </p>

      <h2>6. Security</h2>
      <p>
        We use technical and organizational measures to protect personal information. No system is 100%
        secure, but we work to keep your data safe and to notify you of material incidents where required.
      </p>

      <h2>7. Children</h2>
      <p>
        AREELIVE is not directed to children under the age required by local law to use social live
        streaming services. We do not knowingly collect personal information from underage users.
      </p>

      <h2>8. Changes to this Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will update the "Last updated"
        date above and, where appropriate, provide additional notice.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about this Policy? Email <a href="mailto:privacy@areelive.app">privacy@areelive.app</a>.
      </p>

      <p className="text-sm text-muted-foreground">
        See also our <Link to="/terms" className="underline">Terms &amp; Conditions</Link>,{" "}
        <Link to="/referral-policy" className="underline">Referral / Invite Bonus Policy</Link>, and{" "}
        <Link to="/cookies" className="underline">Cookie Policy</Link>.
      </p>
    </LegalShell>
  );
}
