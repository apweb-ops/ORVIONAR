import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

const phoneRegex = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

const schema = z.object({
  name: z.string().trim().min(2, "Please enter at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .refine((v) => phoneRegex.test(v.replace(/[\s-]/g, "")), "Enter a valid Indian mobile number."),
  subject: z.string().trim().min(2, "Please enter a subject."),
  message: z.string().trim().min(10, "Please write at least 10 characters."),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const { data, error } = await supabase.rpc("submit_lead", {
      payload: { ...values, source: "contact_form" },
    });
    const result = data as { ok?: boolean; message?: string } | null;
    if (error || !result?.ok) {
      toast.error(result?.message ?? "We couldn't send your message. Please try again.");
      return;
    }
    track("contact_submitted");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto size-9 text-primary" aria-hidden="true" />
        <p className="mt-3 text-lg font-bold text-navy">Thank you. Our team will get back to you.</p>
        <Button variant="outline" className="mt-5" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-5 rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message} htmlFor="c-name">
          <Input id="c-name" autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message} htmlFor="c-email">
          <Input id="c-email" type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message} htmlFor="c-phone">
          <Input id="c-phone" inputMode="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label="Subject" error={errors.subject?.message} htmlFor="c-subject">
          <Input id="c-subject" {...register("subject")} />
        </Field>
      </div>
      <Field label="Message" error={errors.message?.message} htmlFor="c-message">
        <Textarea id="c-message" rows={5} {...register("message")} />
      </Field>
      <div>
        <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Send Message
        </Button>
      </div>
    </form>
  );
}

export function Field({
  label,
  error,
  htmlFor,
  children,
  required,
}: {
  label: string;
  error?: string | undefined;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean | undefined;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
