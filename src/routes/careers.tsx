import { createFileRoute, Link } from "@tanstack/react-router";
import { useId, useRef, useState, type FormEvent } from "react";
import { BriefcaseBusiness, FileText, ShieldCheck, Check, Loader2 } from "lucide-react";
import { OpportunityLayout, OpportunityCard } from "@/components/opportunity-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  CAREER_BUCKET,
  CAREER_FILE_ACCEPT,
  careerSchema,
  validateCareerFile,
} from "@/lib/career-validation";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
  head: () => ({
    meta: [
      { title: "Careers — Join the AreeLive Team" },
      {
        name: "description",
        content:
          "Apply to join the AreeLive company team. Submit your CV and optional recommendation letter for review by our official team.",
      },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
});

function CareersPage() {
  return (
    <OpportunityLayout
      eyebrow="Careers at AreeLive"
      title="Build the Future of Live Entertainment With Us"
      description="Join the company team behind AreeLive. Tell us about the job or team you’re interested in, share your experience, and let our official team review your application."
    >
      <section
        aria-label="How to apply"
        className="mx-auto grid max-w-5xl gap-5 px-6 pb-16 md:grid-cols-3"
      >
        <OpportunityCard
          icon={BriefcaseBusiness}
          title="Choose Your Role"
          description="Apply for a role you’re interested in, or send an open application describing where you could contribute."
        />
        <OpportunityCard
          icon={FileText}
          title="Share Your Experience"
          description="Upload your CV and, if available, a recommendation letter. Tell us why you would like to join AreeLive."
        />
        <OpportunityCard
          icon={ShieldCheck}
          title="Official Team Review"
          description="Our official team reviews submitted applications and will contact shortlisted candidates about next steps."
        />
      </section>
      <section className="border-t border-border/30 bg-card/20 px-6 py-16">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="text-2xl font-bold">Apply to Join Our Team</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This application is for company jobs. For creator and agency programmes, visit{" "}
            <Link to="/join" className="text-primary underline">
              Join AreeLive
            </Link>
            .
          </p>
        </div>
        <CareerForm />
      </section>
    </OpportunityLayout>
  );
}

function CareerForm() {
  const id = useId();
  const inFlight = useRef(false);
  const draft = useRef<{ id: string; files: Map<string, { file: File; path: string }> } | null>(
    null,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError("");
    const data = new FormData(event.currentTarget);
    const parsed = careerSchema.safeParse(Object.fromEntries(data));
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    const cv = data.get("cv");
    const letter = data.get("recommendation");
    if (!(cv instanceof File) || !cv.size) {
      setError("Please attach your CV.");
      return;
    }
    const recommendation = letter instanceof File && letter.name ? letter : null;
    try {
      validateCareerFile(cv, "CV");
      if (recommendation) validateCareerFile(recommendation, "Recommendation letter");
    } catch (validationError) {
      setError(
        validationError instanceof Error ? validationError.message : "Please check your documents.",
      );
      return;
    }
    if (draft.current) {
      const chosen = { cv, recommendation };
      for (const [kind, uploaded] of draft.current.files) {
        const file = chosen[kind as keyof typeof chosen];
        if (
          !file ||
          file.name !== uploaded.file.name ||
          file.size !== uploaded.file.size ||
          file.lastModified !== uploaded.file.lastModified
        ) {
          draft.current = null;
          break;
        }
      }
    }
    if (!draft.current) draft.current = { id: crypto.randomUUID(), files: new Map() };
    const currentDraft = draft.current;
    inFlight.current = true;
    setPending(true);
    try {
      async function upload(file: File, kind: "cv" | "recommendation") {
        const previous = currentDraft.files.get(kind);
        // FormData creates new File instances; compare content before reusing an upload.
        const { extension, contentType } = validateCareerFile(
          file,
          kind === "cv" ? "CV" : "Recommendation letter",
        );
        if (
          previous &&
          previous.file.name === file.name &&
          previous.file.size === file.size &&
          previous.file.lastModified === file.lastModified
        )
          return previous.path;
        const path = `${currentDraft.id}/${kind}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from(CAREER_BUCKET)
          .upload(path, file, { contentType, upsert: false });
        if (uploadError) {
          draft.current = null;
          throw new Error(
            "Your document could not be uploaded. Please try again or contact support@areelive.com.",
          );
        }
        currentDraft.files.set(kind, { file, path });
        return path;
      }
      const cvPath = await upload(cv, "cv");
      const recommendationPath = recommendation
        ? await upload(recommendation, "recommendation")
        : null;
      const { error: insertError } = await supabase.from("career_applications").insert({
        id: currentDraft.id,
        ...parsed.data,
        consent: true,
        consent_at: new Date().toISOString(),
        cover_letter: parsed.data.cover_letter || null,
        cv_path: cvPath,
        cv_name: cv.name,
        recommendation_path: recommendationPath,
        recommendation_name: recommendation?.name ?? null,
      });
      if (insertError && insertError.code !== "23505")
        throw new Error(
          "We couldn’t save your application. Please try again. Your details are still in this form.",
        );
      setSuccess(true);
      draft.current = null;
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn’t submit your application. Please try again.",
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
        className="mx-auto max-w-2xl rounded-xl border border-primary/30 bg-card/60 p-8 text-center"
      >
        <Check className="mx-auto h-9 w-9 text-primary" />
        <h3 className="mt-4 text-xl font-bold">Application received</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your application and documents have been submitted for review by the official AreeLive
          team. We will contact you if you are shortlisted. Submitting an application does not
          guarantee employment.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/company">Back to Company</Link>
        </Button>
      </div>
    );
  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-2xl rounded-xl border border-border bg-card/60 p-6 md:p-8"
    >
      <fieldset disabled={pending} className="space-y-5">
        <legend className="sr-only">Job application</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { name: "full_name", label: "Full Name", type: "text", autoComplete: "name", max: 120 },
            {
              name: "email",
              label: "Email Address",
              type: "email",
              autoComplete: "email",
              max: 254,
            },
            { name: "phone", label: "Phone / WhatsApp", type: "tel", autoComplete: "tel", max: 40 },
            {
              name: "country_city",
              label: "Country / City",
              type: "text",
              autoComplete: "off",
              max: 120,
            },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label htmlFor={`${id}-${field.name}`} className="text-xs font-medium">
                {field.label}{" "}
                <span className="text-secondary" aria-hidden="true">
                  *
                </span>
              </label>
              <Input
                id={`${id}-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                required
                maxLength={field.max}
                minLength={field.name === "phone" ? 4 : undefined}
              />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <label htmlFor={`${id}-position`} className="text-xs font-medium">
            Job / Team You’re Applying For{" "}
            <span className="text-secondary" aria-hidden="true">
              *
            </span>
          </label>
          <Input
            id={`${id}-position`}
            name="position"
            placeholder="Job title, team, or open application"
            required
            maxLength={200}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${id}-cover`} className="text-xs font-medium">
            Tell Us About Yourself (optional)
          </label>
          <Textarea
            id={`${id}-cover`}
            name="cover_letter"
            placeholder="Your relevant experience and why you would like to join AreeLive…"
            rows={5}
            maxLength={3000}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { name: "cv", label: "CV / Résumé", required: true },
            { name: "recommendation", label: "Recommendation Letter (optional)", required: false },
          ].map((field) => (
            <div
              key={field.name}
              className="space-y-2 rounded-lg border border-border bg-background/30 p-4"
            >
              <label htmlFor={`${id}-${field.name}`} className="block text-xs font-medium">
                {field.label}{" "}
                {field.required && (
                  <span className="text-secondary" aria-hidden="true">
                    *
                  </span>
                )}
              </label>
              <Input
                id={`${id}-${field.name}`}
                name={field.name}
                type="file"
                accept={CAREER_FILE_ACCEPT}
                required={field.required}
                aria-describedby={`${id}-${field.name}-help`}
                className="h-auto min-w-0 py-2 text-xs"
              />
              <p id={`${id}-${field.name}-help`} className="text-xs text-muted-foreground">
                PDF, DOC, or DOCX · Maximum 10 MB
              </p>
            </div>
          ))}
        </div>
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
            I confirm that this information is accurate and consent to the official AreeLive team
            reviewing my application and documents and contacting me about job opportunities. I have
            read the{" "}
            <Link to="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" className="gradient-primary w-full text-white">
          {pending ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Submitting Application…
            </>
          ) : (
            "Submit Job Application"
          )}
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Documents are stored privately and are available only to authorised team reviewers.
          Applications are subject to review.
        </p>
      </fieldset>
    </form>
  );
}
