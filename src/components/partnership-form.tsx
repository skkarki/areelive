import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Loader2, Mail } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const requiredText = (max: number) =>
  z.string().trim().min(1, "Please complete all required fields.").max(max);
const url = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => !value || /^https?:\/\//i.test(value),
    "Enter a website URL starting with https:// or http://.",
  );
const contactSchema = z.object({
  full_name: requiredText(120),
  company: requiredText(200),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  phone: z.string().trim().max(40),
  country: requiredText(120),
  website: url,
  consent: z.literal("on", {
    errorMap: () => ({ message: "Please confirm the information and consent to being contacted." }),
  }),
});
const agencySchema = contactSchema.extend({
  phone: requiredText(40).min(4),
  network: requiredText(600),
  capacity: z.enum(["1–10", "11–50", "51–100", "101–500", "500+"]),
  markets: requiredText(120),
  experience: requiredText(600),
  message: z.string().trim().max(400),
});
const enquiryTypes = [
  "Strategic Partnership",
  "Payment Partnership",
  "Marketing & Advertising",
  "Technology Partnership",
  "Talent / Agency Partnership",
  "Regional Cooperation",
  "Other Business Enquiry",
] as const;
const businessSchema = contactSchema.extend({
  enquiry: z.enum(enquiryTypes),
  proposal: requiredText(2000),
});
const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function PartnershipForm({ kind }: { kind: "agency" | "business" }) {
  const agency = kind === "agency";
  const id = useId();
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [emailHref, setEmailHref] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!agency) {
      const parsed = businessSchema.safeParse(values);
      if (!parsed.success) {
        setError(parsed.error.issues[0].message);
        return;
      }
      const data = parsed.data;
      const body = `Company: ${data.company}\nContact: ${data.full_name}\nEmail: ${data.email}\nPhone / WhatsApp: ${data.phone || "Not provided"}\nCountry / Region: ${data.country}\nWebsite: ${data.website || "Not provided"}\n\n${data.proposal}\n\nI confirm this information is accurate and consent to being contacted about this enquiry.`;
      const href = `mailto:support@areelive.com?subject=${encodeURIComponent(`[Business] ${data.enquiry} — ${data.company}`)}&body=${encodeURIComponent(body)}`;
      setEmailHref(href);
      window.location.href = href;
      setSuccess(true);
      return;
    }
    const parsed = agencySchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    const data = parsed.data;
    inFlight.current = true;
    setPending(true);
    try {
      const { error: submissionError } = await supabase.from("applications").insert({
        applying_for: "agency",
        full_name: data.full_name,
        agency_name: data.company,
        email: data.email,
        phone: data.phone,
        country_city: data.country,
        capacity_estimate: data.capacity,
        portfolio_link: data.website || null,
        has_experience: true,
        message: `Existing Creator / Host Network:\n${data.network}\n\nMarkets / Countries Operated In:\n${data.markets}\n\nRelevant Industry Experience:\n${data.experience}\n\nAdditional Information:\n${data.message || "None"}`,
        consent: true,
        consent_at: new Date().toISOString(),
      });
      if (submissionError) throw submissionError;
      setSuccess(true);
    } catch {
      setError(
        "We couldn’t submit your application. Your details are still here — please try again, or contact support@areelive.com.",
      );
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  if (success)
    return (
      <div
        role="status"
        className="mx-auto max-w-xl rounded-xl border border-primary/30 bg-card/60 p-8 text-center"
      >
        {agency ? (
          <Check className="mx-auto h-8 w-8 text-primary" />
        ) : (
          <Mail className="mx-auto h-8 w-8 text-primary" />
        )}
        <h3 className="mt-4 text-xl font-bold">
          {agency ? "Application received" : "Your email draft is ready"}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {agency
            ? "Thank you for applying. Our team will review your agency application and contact you."
            : "Your email app should open with your enquiry. Send the email there to complete your enquiry. If it didn’t open, use the link below or email support@areelive.com."}
        </p>
        {!agency && (
          <a href={emailHref} className="mt-4 inline-block text-sm text-primary underline">
            Open enquiry in email app
          </a>
        )}
        <div className="mt-6">
          <Button type="button" variant="outline" onClick={() => setSuccess(false)}>
            {agency ? "Submit another application" : "Back to enquiry form"}
          </Button>
        </div>
      </div>
    );

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-xl rounded-xl border border-border bg-card/60 p-6 md:p-8"
    >
      <fieldset disabled={pending} className="grid gap-5">
        <legend className="sr-only">{agency ? "Agency application" : "Business enquiry"}</legend>
        {!agency && (
          <FormField id={`${id}-enquiry`} label="Enquiry Type" required>
            <select
              id={`${id}-enquiry`}
              name="enquiry"
              required
              defaultValue=""
              className={selectClass}
            >
              <option value="" disabled>
                Select enquiry type
              </option>
              {enquiryTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </FormField>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id={`${id}-name`} label={agency ? "Full Name" : "Contact Name"} required>
            <Input
              id={`${id}-name`}
              name="full_name"
              placeholder="Your full name"
              autoComplete="name"
              required
              maxLength={120}
            />
          </FormField>
          <FormField
            id={`${id}-company`}
            label={agency ? "Agency / Company Name" : "Company / Organisation Name"}
            required
          >
            <Input
              id={`${id}-company`}
              name="company"
              placeholder={agency ? "Your agency or company name" : "Your company name"}
              autoComplete="organization"
              required
              maxLength={200}
            />
          </FormField>
          <FormField id={`${id}-country`} label="Country / Region" required>
            <Input
              id={`${id}-country`}
              name="country"
              placeholder="e.g. Nepal"
              autoComplete="country-name"
              required
              maxLength={120}
              list={`${id}-countries`}
            />
            <datalist id={`${id}-countries`}>
              {[
                "Nepal",
                "India",
                "Bangladesh",
                "Pakistan",
                "United States",
                "United Kingdom",
                "Philippines",
                "Indonesia",
                "United Arab Emirates",
                "Saudi Arabia",
                "Brazil",
                "Australia",
                "Canada",
                "Germany",
              ].map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </FormField>
          <FormField
            id={`${id}-email`}
            label={agency ? "Email Address" : "Business Email"}
            required
          >
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              placeholder={agency ? "you@email.com" : "you@company.com"}
              autoComplete="email"
              required
              maxLength={254}
            />
          </FormField>
        </div>
        <FormField id={`${id}-phone`} label="Phone / WhatsApp" required={agency}>
          <Input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            placeholder="+1 234 567 8900"
            autoComplete="tel"
            required={agency}
            minLength={agency ? 4 : undefined}
            maxLength={40}
          />
        </FormField>
        {agency && (
          <>
            <FormField id={`${id}-network`} label="Existing Creator / Host Network" required>
              <Textarea
                id={`${id}-network`}
                name="network"
                placeholder="Describe your existing creator or host network — platforms, niches, regions…"
                required
                rows={3}
                maxLength={600}
              />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id={`${id}-capacity`}
                label="Approximate Number of Creators / Hosts"
                required
              >
                <select
                  id={`${id}-capacity`}
                  name="capacity"
                  required
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select range
                  </option>
                  {["1–10", "11–50", "51–100", "101–500", "500+"].map((range) => (
                    <option key={range}>{range}</option>
                  ))}
                </select>
              </FormField>
              <FormField id={`${id}-markets`} label="Markets / Countries Operated In" required>
                <Input
                  id={`${id}-markets`}
                  name="markets"
                  placeholder="e.g. Southeast Asia, Middle East, Europe"
                  required
                  maxLength={120}
                />
              </FormField>
            </div>
            <FormField id={`${id}-experience`} label="Relevant Industry Experience" required>
              <Textarea
                id={`${id}-experience`}
                name="experience"
                placeholder="Describe your experience in talent management, live streaming, entertainment, or related industries…"
                required
                rows={3}
                maxLength={600}
              />
            </FormField>
          </>
        )}
        <FormField
          id={`${id}-website`}
          label={agency ? "Website / Social Media (optional)" : "Company Website (optional)"}
        >
          <Input
            id={`${id}-website`}
            name="website"
            type="url"
            placeholder="https://yourwebsite.com"
            autoComplete="url"
            maxLength={500}
          />
        </FormField>
        <FormField
          id={`${id}-message`}
          label={agency ? "Message / Additional Information" : "Your Enquiry / Proposal"}
          required={!agency}
        >
          <Textarea
            id={`${id}-message`}
            name={agency ? "message" : "proposal"}
            placeholder={
              agency
                ? "Anything else you’d like us to know about your agency or application…"
                : "Describe your partnership proposal, what you offer, and what you are looking for from AreeLive…"
            }
            required={!agency}
            rows={5}
            maxLength={agency ? 400 : 2000}
          />
        </FormField>
        <div className="flex items-start gap-2">
          <input
            id={`${id}-consent`}
            name="consent"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
          />
          <label
            htmlFor={`${id}-consent`}
            className="text-xs leading-relaxed text-muted-foreground"
          >
            I confirm the information provided is accurate and consent to being contacted about this{" "}
            {agency ? "application" : "enquiry"}. I have read the{" "}
            <Link to="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            {agency && (
              <>
                {" "}
                and agree to the{" "}
                <Link to="/terms" className="text-primary underline">
                  Terms &amp; Conditions
                </Link>
              </>
            )}
            .{" "}
            {agency
              ? "Submitting an application does not guarantee approval."
              : "Submitting this form does not constitute an agreement or commitment from AreeLive."}
          </label>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          {pending ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : agency ? (
            "Submit Application"
          ) : (
            "Send Enquiry by Email"
          )}
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          {agency
            ? "Applications are reviewed by our partnerships team. Approval is subject to review."
            : "Opens a draft in your email app. Send the email to complete your enquiry."}
        </p>
      </fieldset>
    </form>
  );
}

function FormField({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-medium">
        {label}
        {required && (
          <span className="ml-1 text-secondary" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
