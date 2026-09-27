import { Link } from "@tanstack/react-router";
import { useRef, useState, useId, cloneElement, isValidElement, type FormEvent, type ReactElement } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Loader2 } from "lucide-react";

export type RoleKey =
  | "agency" | "recruiter" | "host" | "admin" | "agency_manager"
  | "creator" | "merchant";

export const ROLE_META: Record<RoleKey, { label: string }> = {
  agency: { label: "Agency" },
  recruiter: { label: "Creator Recruiter / Talent Scout" },
  host: { label: "Host / Creator" },
  admin: { label: "Admin" },
  agency_manager: { label: "Agency Manager" },
  creator: { label: "Creator" },
  merchant: { label: "Merchant" },
};

const schema = z.object({
  full_name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Invalid email").max(254),
  phone: z.string().trim().min(4, "Required").max(40),
  country_city: z.string().trim().min(1, "Required").max(120),
  applying_for: z.enum(["agency","recruiter","host","admin","agency_manager","creator","merchant"]),
  has_experience: z.boolean(),
  capacity_estimate: z.string().trim().max(120).optional().or(z.literal("")),
  portfolio_link: z
    .string()
    .trim()
    .max(500)
    .refine((v) => !v || /^https?:\/\//i.test(v), {
      message: "Must be a valid http(s) URL",
    })
    .optional()
    .or(z.literal("")),
  agency_name: z.string().trim().max(200).optional().or(z.literal("")),
  preferred_language: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "You must agree to the Privacy Policy, Terms & Conditions, and Referral Policy" }) }),
});

export function ApplicationForm({
  initialRole,
  lockRole = false,
  idPrefix = "app",
}: {
  initialRole: RoleKey;
  lockRole?: boolean;
  idPrefix?: string;
}) {
  const [selectedRole, setSelectedRole] = useState<RoleKey>(initialRole);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const consentRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", country_city: "",
    has_experience: "no" as "yes" | "no",
    capacity_estimate: "", portfolio_link: "", agency_name: "",
    preferred_language: "", message: "", consent: false,
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse({
      ...form,
      applying_for: selectedRole,
      has_experience: form.has_experience === "yes",
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] = issue.message;
      setErrors(fieldErrors);
      if (fieldErrors.consent) consentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        country_city: parsed.data.country_city,
        applying_for: parsed.data.applying_for,
        has_experience: parsed.data.has_experience,
        capacity_estimate: parsed.data.capacity_estimate || null,
        portfolio_link: parsed.data.portfolio_link || null,
        agency_name: parsed.data.agency_name || null,
        preferred_language: parsed.data.preferred_language || null,
        message: parsed.data.message || null,
        consent: parsed.data.consent,
        consent_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("applications").insert(payload);
      if (error) throw error;
      setSuccess(true);
      setForm({
        full_name: "", email: "", phone: "", country_city: "",
        has_experience: "no", capacity_estimate: "", portfolio_link: "",
        agency_name: "", preferred_language: "", message: "", consent: false,
      });
    } catch (err) {
      setErrors({ _form: err instanceof Error ? err.message : "Could not submit application" });
    } finally {
      setSubmitting(false);
    }
  };

  const consentId = `${idPrefix}-consent`;
  const consentErrId = `${idPrefix}-consent-error`;
  const consentDescId = `${idPrefix}-consent-desc`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application form</CardTitle>
        <CardDescription>
          Applying for: <span className="font-medium text-foreground">{ROLE_META[selectedRole].label}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-6 text-center">
            <Check className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">Application received</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for applying to AREELIVE. Our team will review your application and contact you soon.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button variant="outline" onClick={() => setSuccess(false)}>Submit another</Button>
              <Button asChild><Link to="/">Back to home</Link></Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" error={errors.full_name}>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required maxLength={120} />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={254} />
              </Field>
              <Field label="WhatsApp / phone" error={errors.phone}>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required maxLength={40} />
              </Field>
              <Field label="Country / city" error={errors.country_city}>
                <Input value={form.country_city} onChange={(e) => setForm({ ...form, country_city: e.target.value })} required maxLength={120} />
              </Field>
              <Field label="Applying for">
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as RoleKey)} disabled={lockRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ROLE_META) as RoleKey[]).map((k) => (
                      <SelectItem key={k} value={k}>{ROLE_META[k].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Do you have experience?">
                <RadioGroup
                  value={form.has_experience}
                  onValueChange={(v) => setForm({ ...form, has_experience: v as "yes" | "no" })}
                  className="flex gap-4 pt-2"
                >
                  <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="yes" />Yes</label>
                  <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="no" />No</label>
                </RadioGroup>
              </Field>
              <Field label="How many hosts or users can you bring?" error={errors.capacity_estimate}>
                <Input value={form.capacity_estimate} onChange={(e) => setForm({ ...form, capacity_estimate: e.target.value })} placeholder="e.g. 20+ per month" maxLength={120} />
              </Field>
              <Field label="Social / portfolio link" error={errors.portfolio_link}>
                <Input value={form.portfolio_link} onChange={(e) => setForm({ ...form, portfolio_link: e.target.value })} placeholder="https://" maxLength={500} />
              </Field>
              <Field label="Agency / business name (if applicable)" error={errors.agency_name}>
                <Input value={form.agency_name} onChange={(e) => setForm({ ...form, agency_name: e.target.value })} maxLength={200} />
              </Field>
              <Field label="Preferred language" error={errors.preferred_language}>
                <Input value={form.preferred_language} onChange={(e) => setForm({ ...form, preferred_language: e.target.value })} placeholder="e.g. English, Arabic" maxLength={80} />
              </Field>
            </div>
            <Field label="Short message / introduction" error={errors.message}>
              <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={2000} />
            </Field>
            <div
              ref={consentRef}
              className={`rounded-lg border p-3 transition-colors ${
                errors.consent ? "border-destructive bg-destructive/5" : "border-border"
              }`}
            >
              <div className="flex items-start gap-2 text-sm">
                <Checkbox
                  id={consentId}
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
                  aria-describedby={`${consentDescId} ${consentErrId}`}
                  aria-label="I agree to the Privacy Policy, Terms and Conditions, and Referral Policy"
                  className="mt-0.5"
                />
                <Label htmlFor={consentId} id={consentDescId} className="text-sm font-normal leading-relaxed cursor-pointer">
                  <strong>I agree.</strong> I confirm the information above is accurate, I agree to be contacted by
                  AREELIVE about my application, and I have read and accept the{" "}
                  <Link to="/privacy" className="underline underline-offset-2 rounded-sm text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Privacy Policy</Link>,{" "}
                  <Link to="/terms" className="underline underline-offset-2 rounded-sm text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Terms &amp; Conditions</Link>, and{" "}
                  <Link to="/referral-policy" className="underline underline-offset-2 rounded-sm text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Referral Policy</Link>.
                </Label>
              </div>
              {errors.consent && (
                <p id={consentErrId} role="alert" className="mt-2 text-sm font-medium text-destructive">
                  {errors.consent}
                </p>
              )}
            </div>
            {errors._form && <p className="text-sm text-destructive">{errors._form}</p>}
            <Button type="submit" disabled={submitting} className="w-full md:w-auto">
              {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</>) : "Submit application"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
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
