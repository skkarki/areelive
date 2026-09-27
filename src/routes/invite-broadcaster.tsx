import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useId, cloneElement, isValidElement, type FormEvent, type ReactElement } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Gift, Loader2, ShieldAlert, Sparkles, UserPlus } from "lucide-react";

const schema = z.object({
  referrer_areelive_id: z.string().trim().min(1).max(80),
  referrer_name: z.string().trim().min(1).max(120),
  referrer_phone: z.string().trim().min(4).max(40),
  friend_name: z.string().trim().min(1).max(120),
  friend_phone: z.string().trim().min(4).max(40),
  friend_country_city: z.string().trim().min(1).max(120),
  friend_social_link: z
    .string()
    .trim()
    .max(500)
    .refine((v) => !v || /^https?:\/\//i.test(v), {
      message: "Must be a valid http(s) URL",
    })
    .optional()
    .or(z.literal("")),
  friend_prior_experience: z.boolean(),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "You must agree to the Privacy Policy, Terms & Conditions, and Referral Policy" }) }),
});

export const Route = createFileRoute("/invite-broadcaster")({
  component: InvitePage,
  head: () => ({
    meta: [
      { title: "Invite Broadcaster Friends & Earn — AREELIVE" },
      { name: "description", content: "Already a broadcaster on AREELIVE? Invite your broadcaster friends and earn a one-time referral bonus for every approved invite." },
      { property: "og:title", content: "Invite Broadcaster Friends & Earn Bonus" },
      { property: "og:description", content: "Invite your broadcaster friends to AREELIVE and earn a one-time bonus for every approved broadcaster you bring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Invite Broadcaster Friends & Earn" },
      { name: "twitter:description", content: "Earn a one-time bonus for every approved broadcaster you invite to AREELIVE." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => <div className="p-8 text-center">Not found</div>,
});

function InvitePage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement | null>(null);
  const consentRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState({
    referrer_areelive_id: "",
    referrer_name: "",
    referrer_phone: "",
    friend_name: "",
    friend_phone: "",
    friend_country_city: "",
    friend_social_link: "",
    friend_prior_experience: "no" as "yes" | "no",
    note: "",
    consent: false,
  });

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse({
      ...form,
      friend_prior_experience: form.friend_prior_experience === "yes",
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] = issue.message;
      setErrors(fieldErrors);
      if (fieldErrors.consent) {
        consentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        referrer_areelive_id: parsed.data.referrer_areelive_id,
        referrer_name: parsed.data.referrer_name,
        referrer_phone: parsed.data.referrer_phone,
        friend_name: parsed.data.friend_name,
        friend_phone: parsed.data.friend_phone,
        friend_country_city: parsed.data.friend_country_city,
        friend_social_link: parsed.data.friend_social_link || null,
        friend_prior_experience: parsed.data.friend_prior_experience,
        note: parsed.data.note || null,
        consent: parsed.data.consent,
        consent_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("broadcaster_referrals").insert(payload);
      if (error) throw error;
      setSuccess(true);
      setForm({
        referrer_areelive_id: "", referrer_name: "", referrer_phone: "",
        friend_name: "", friend_phone: "", friend_country_city: "",
        friend_social_link: "", friend_prior_experience: "no", note: "", consent: false,
      });
    } catch (err) {
      setErrors({ _form: err instanceof Error ? err.message : "Could not submit referral" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="mx-auto max-w-3xl px-4 py-16 md:py-24 text-center">
          <Badge variant="secondary" className="mb-4"><Gift className="mr-1 h-3.5 w-3.5" />Broadcaster referrals</Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Invite Broadcaster Friends & Earn Bonus</h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            Already a broadcaster on AREELIVE and have friends who also want to go live? Invite them to join AREELIVE and earn a
            one-time referral bonus for every approved broadcaster you bring. Conditions apply.
          </p>
          <Button size="lg" className="mt-6" onClick={scrollToForm}><UserPlus className="mr-2 h-4 w-4" />Invite a Broadcaster</Button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {[
            "No need to become an agency",
            "Invite your broadcaster friends directly",
            "Earn a one-time bonus for every successful invite",
            "Bonus applies only after the invited broadcaster is approved and meets platform requirements",
            "More successful invites may unlock extra privileges or priority support",
            "Referral rewards are subject to AREELIVE review and approval",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2 rounded-lg border bg-card p-3 text-sm">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{line}
            </li>
          ))}
        </ul>
      </section>

      <section ref={formRef} className="mx-auto max-w-3xl px-4 pb-12">
        <Card>
          <CardHeader>
            <CardTitle>Referral form</CardTitle>
            <CardDescription>Tell us about the broadcaster you're inviting.</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="rounded-lg border border-primary/40 bg-primary/5 p-6 text-center">
                <Check className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-3 text-lg font-semibold">Referral received</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you for inviting a broadcaster to AREELIVE. Our team will review the referral and contact you if the invite
                  is eligible for a bonus.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setSuccess(false)}>Invite another</Button>
                  <Button asChild><Link to="/">Back to home</Link></Button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About you</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Your AREELIVE ID / username" error={errors.referrer_areelive_id}>
                    <Input value={form.referrer_areelive_id} onChange={(e) => setForm({ ...form, referrer_areelive_id: e.target.value })} maxLength={80} required />
                  </Field>
                  <Field label="Your full name" error={errors.referrer_name}>
                    <Input value={form.referrer_name} onChange={(e) => setForm({ ...form, referrer_name: e.target.value })} maxLength={120} required />
                  </Field>
                  <Field label="Your WhatsApp / phone" error={errors.referrer_phone}>
                    <Input value={form.referrer_phone} onChange={(e) => setForm({ ...form, referrer_phone: e.target.value })} maxLength={40} required />
                  </Field>
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground pt-2">About your friend</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Friend's full name" error={errors.friend_name}>
                    <Input value={form.friend_name} onChange={(e) => setForm({ ...form, friend_name: e.target.value })} maxLength={120} required />
                  </Field>
                  <Field label="Friend's WhatsApp / phone" error={errors.friend_phone}>
                    <Input value={form.friend_phone} onChange={(e) => setForm({ ...form, friend_phone: e.target.value })} maxLength={40} required />
                  </Field>
                  <Field label="Friend's country / city" error={errors.friend_country_city}>
                    <Input value={form.friend_country_city} onChange={(e) => setForm({ ...form, friend_country_city: e.target.value })} maxLength={120} required />
                  </Field>
                  <Field label="Friend's social media link" error={errors.friend_social_link}>
                    <Input value={form.friend_social_link} onChange={(e) => setForm({ ...form, friend_social_link: e.target.value })} placeholder="https://" maxLength={500} />
                  </Field>
                  <Field label="Has your friend worked as a broadcaster before?">
                    <RadioGroup value={form.friend_prior_experience} onValueChange={(v) => setForm({ ...form, friend_prior_experience: v as "yes" | "no" })} className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="yes" />Yes</label>
                      <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="no" />No</label>
                    </RadioGroup>
                  </Field>
                </div>
                <Field label="Short note about the invited broadcaster" error={errors.note}>
                  <Textarea rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} maxLength={2000} />
                </Field>
                <div
                  ref={consentRef}
                  className={`rounded-lg border p-3 transition-colors ${
                    errors.consent ? "border-destructive bg-destructive/5" : "border-border"
                  }`}
                >
                <div className="flex items-start gap-2 text-sm">
                  <Checkbox
                    id="invite-consent"
                    checked={form.consent}
                    onCheckedChange={(v) => {
                      setForm({ ...form, consent: v === true });
                      if (v === true && errors.consent) {
                        setErrors((prev) => {
                          const { consent, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    aria-invalid={!!errors.consent}
                    aria-describedby="invite-consent-desc invite-consent-error"
                    aria-label="I agree to the Privacy Policy, Terms and Conditions, and Referral Policy"
                    className="mt-0.5"
                  />
                  <Label htmlFor="invite-consent" id="invite-consent-desc" className="text-sm font-normal leading-relaxed cursor-pointer">
                    <strong>I agree.</strong> I confirm the information above is accurate, the invited broadcaster
                    has agreed to be contacted by AREELIVE, and I have read and accept the{" "}
                    <Link to="/privacy" className="underline underline-offset-2 rounded-sm text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Privacy Policy</Link>,{" "}
                    <Link to="/terms" className="underline underline-offset-2 rounded-sm text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Terms &amp; Conditions</Link>, and{" "}
                    <Link to="/referral-policy" className="underline underline-offset-2 rounded-sm text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Referral Policy</Link>.
                  </Label>
                </div>
                {errors.consent && (
                  <p id="invite-consent-error" role="alert" className="mt-2 text-sm font-medium text-destructive">
                    {errors.consent}
                  </p>
                )}
                </div>
                {errors._form && <p className="text-sm text-destructive">{errors._form}</p>}
                <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                  {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</>) : "Submit referral"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-xl border bg-muted/30 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold"><ShieldAlert className="h-4 w-4 text-primary" />Referral conditions</div>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li>• Bonus is one-time per approved broadcaster.</li>
            <li>• Invited broadcaster must be new to AREELIVE.</li>
            <li>• Invited broadcaster must complete verification / KYC if required.</li>
            <li>• Invited broadcaster must meet minimum activity or performance requirements before bonus is released.</li>
            <li>• Fake, duplicate, inactive, or self-referrals are not eligible.</li>
            <li>• AREELIVE has the right to approve, reject, or hold any referral bonus in case of suspicious activity.</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Full rules: see the{" "}
            <Link to="/referral-policy" className="underline">Broadcaster Invite &amp; Earn Policy</Link>,{" "}
            <Link to="/terms" className="underline">Terms &amp; Conditions</Link>, and{" "}
            <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = useId();
  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>, {
        id: (children as ReactElement<{ id?: string }>).props.id ?? id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${id}-error` : undefined,
      })
    : children;
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {child}
      {error && <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>}
    </div>
  );
}