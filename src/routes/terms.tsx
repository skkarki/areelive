import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms & Conditions — AREELIVE" },
      { name: "description", content: "Terms and conditions for using AREELIVE, including rules for agency, recruiter, host, admin, and agency manager applications." },
      { property: "og:title", content: "AREELIVE Terms & Conditions" },
      { property: "og:description", content: "Rules for using AREELIVE and for applying as an agency, recruiter, host, admin, or agency manager." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function TermsPage() {
  return (
    <LegalShell title="Terms & Conditions" updated="July 5, 2026">
      <p>
        These Terms &amp; Conditions ("Terms") govern your use of the AREELIVE app, website, and related
        services (the "Services"). By using the Services or submitting an application, you agree to these Terms.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must meet the minimum age required by local law to use social live streaming services and comply
        with all applicable laws in your country of residence.
      </p>

      <h2>2. Your account</h2>
      <p>
        You are responsible for your account, your credentials, and any activity that happens under your
        account. You agree to provide accurate information and to keep it up to date.
      </p>

      <h2>3. Acceptable use</h2>
      <p>
        You agree not to use AREELIVE for illegal, abusive, deceptive, or harmful behavior. AREELIVE may
        remove content, restrict features, or terminate accounts that violate these Terms or our community
        guidelines.
      </p>

      <h2>4. Agency, Recruiter, Host, Admin &amp; Agency Manager Applications</h2>
      <p>
        AREELIVE offers application programs for agencies, creator recruiters / talent scouts, hosts /
        creators, admins, and agency managers. The following terms apply to every applicant:
      </p>
      <ul>
        <li>
          Submitting an application <strong>does not guarantee approval, employment, partnership, agency
          status, or payment</strong> of any kind.
        </li>
        <li>
          AREELIVE may approve, reject, suspend, or terminate any application at its sole discretion, with
          or without notice and with or without reason, to the extent permitted by law.
        </li>
        <li>
          Applicants must provide accurate, complete, and up-to-date information about themselves and, where
          applicable, about their agency, team, or contacts.
        </li>
        <li>
          Fake, misleading, duplicate, or fraudulent submissions are not allowed. Applications that contain
          false information may be rejected, and related accounts may be restricted or terminated.
        </li>
        <li>
          Approved applicants may be required to accept additional terms (for example, an agency agreement,
          host agreement, or code of conduct) before starting.
        </li>
        <li>
          Bonuses, commissions, incentives, or privileges tied to any role are subject to AREELIVE's rules,
          may change from time to time, and may require verification, KYC, tax documentation, or minimum
          activity thresholds.
        </li>
      </ul>

      <h2>5. Content &amp; intellectual property</h2>
      <p>
        You keep the rights to the content you post, but you grant AREELIVE a worldwide, non-exclusive
        license to host, display, distribute, and promote your content on and through the Services as
        described in our platform documentation.
      </p>

      <h2>6. Payments &amp; virtual items</h2>
      <p>
        Purchases of virtual gifts, coins, or other items are subject to the pricing, availability, and
        refund rules published in the app. Payouts to creators, agencies, or referrers are subject to
        verification, minimum thresholds, and applicable taxes.
      </p>

      <h2>7. Suspension &amp; termination</h2>
      <p>
        AREELIVE may suspend or terminate access to the Services, remove content, or revoke roles and
        privileges if we believe there has been a violation of these Terms, our community guidelines, or
        applicable law.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        The Services are provided "as is" and "as available" without warranties of any kind, to the maximum
        extent permitted by law. AREELIVE does not guarantee that the Services will be error-free or
        uninterrupted.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, AREELIVE will not be liable for indirect, incidental,
        special, consequential, or punitive damages arising from your use of the Services.
      </p>

      <h2>10. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. When we do, we will update the "Last updated" date and,
        where appropriate, provide additional notice.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these Terms? Email <a href="mailto:legal@areelive.app">legal@areelive.app</a>.
      </p>

      <p className="text-sm text-muted-foreground">
        See also our <Link to="/privacy" className="underline">Privacy Policy</Link>,{" "}
        <Link to="/referral-policy" className="underline">Referral / Invite Bonus Policy</Link>, and{" "}
        <Link to="/cookies" className="underline">Cookie Policy</Link>.
      </p>
    </LegalShell>
  );
}