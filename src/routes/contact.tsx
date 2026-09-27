import { createFileRoute } from "@tanstack/react-router";
import { useId, useState, type FormEvent } from "react";
import { z } from "zod";
import { LegalShell } from "@/components/legal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Instagram, Twitter, Youtube, Facebook, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact AREELIVE — Get in Touch" },
      { name: "description", content: "Contact the AREELIVE team for partnerships, agency onboarding, broadcaster support, press, and general inquiries." },
      { property: "og:title", content: "Contact AREELIVE" },
      { property: "og:description", content: "Reach the AREELIVE team for support, partnerships, and inquiries." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://areelive.com/contact" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://areelive.com/contact" }],
  }),
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(1, "Please enter a subject").max(150),
  message: z.string().trim().min(1, "Please enter a message").max(2000),
});

function ContactPage() {
  return (
    <LegalShell title="Contact AREELIVE" updated="July 5, 2026">
      <p>
        We'd love to hear from you. Whether you're a creator, agency, recruiter, or fan, the
        <strong> AREELIVE</strong> team is here to help. Email us directly at{" "}
        <a href="mailto:support@areelive.com">support@areelive.com</a> or send us a message below.
      </p>

      <h2>Get in touch</h2>
      <ul>
        <li><strong>Brand:</strong> AREELIVE</li>
        <li><strong>Email:</strong> <a href="mailto:support@areelive.com">support@areelive.com</a></li>
        <li><strong>Apply to join:</strong> <a href="/join">areelive.com/join</a></li>
        <li><strong>Invite a broadcaster:</strong> <a href="/invite-broadcaster">areelive.com/invite-broadcaster</a></li>
      </ul>

      <h2>Send us a message</h2>
      <ContactForm />

      <h2>Follow AREELIVE</h2>
      <p>Our social channels are launching soon — follow along:</p>
      <div className="mt-3 flex flex-wrap gap-3 not-prose">
        {[
          { label: "Instagram", icon: Instagram, href: "#" },
          { label: "Twitter / X", icon: Twitter, href: "#" },
          { label: "YouTube", icon: Youtube, href: "#" },
          { label: "Facebook", icon: Facebook, href: "#" },
          { label: "Email", icon: Mail, href: "mailto:support@areelive.com" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm hover:bg-card transition"
          >
            <s.icon className="w-4 h-4" />
            {s.label}
          </a>
        ))}
      </div>
    </LegalShell>
  );
}

function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const msgId = useId();
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your entries");
      return;
    }
    setError(null);
    const { name, email, subject, message } = parsed.data;
    const body = `From: ${name} <${email}>\n\n${message}`;
    window.location.href = `mailto:support@areelive.com?subject=${encodeURIComponent(
      `[Contact] ${subject}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="not-prose mt-4 space-y-4 rounded-2xl border border-border/60 bg-card/40 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={nameId}>Name</Label>
          <Input id={nameId} value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} maxLength={100} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={emailId}>Email</Label>
          <Input id={emailId} type="email" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} maxLength={255} required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={subjectId}>Subject</Label>
        <Input id={subjectId} value={values.subject} onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))} maxLength={150} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={msgId}>Message</Label>
        <Textarea id={msgId} rows={6} value={values.message} onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))} maxLength={2000} required />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {sent ? (
        <p className="text-sm text-muted-foreground">Your email client should have opened. If not, email us at <a className="text-primary underline" href="mailto:support@areelive.com">support@areelive.com</a>.</p>
      ) : null}
      <Button type="submit" className="gradient-primary text-white border-0 shadow-glow rounded-full font-semibold">
        Send message
      </Button>
    </form>
  );
}