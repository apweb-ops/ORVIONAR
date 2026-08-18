import { useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, Loader2, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/ContactForm";
import { supabase } from "@/integrations/supabase/client";
import { programsQuery, joiningMonthsQuery } from "@/lib/queries";
import { CURRENT_YEARS, MODES, SESSIONS, SOURCES, whatsappLink } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const phoneRegex = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const phone = (label: string) =>
  z
    .string()
    .trim()
    .refine((v) => phoneRegex.test(v.replace(/[\s-]/g, "")), `Enter a valid ${label}.`);

const schema = z
  .object({
    full_name: z.string().trim().min(2, "Please enter your full name."),
    email: z.string().trim().email("Enter a valid email address."),
    phone: phone("mobile number"),
    whatsapp: z.string().trim().optional(),
    date_of_birth: z.string().optional(),
    college: z.string().trim().min(2, "Please enter your college or university."),
    degree: z.string().trim().optional(),
    department: z.string().trim().optional(),
    current_year: z.string().min(1, "Select your current year."),
    graduation_year: z.string().trim().optional(),
    domain: z.string().min(1, "Select a career domain."),
    custom_domain: z.string().trim().optional(),
    preferred_mode: z.string().min(1, "Select a preferred mode."),
    joining_month: z.string().min(1, "Select a joining month."),
    preferred_session: z.string().min(1, "Select a preferred session."),
    source: z.string().min(1, "Let us know how you heard about us."),
    consent: z.literal(true, { message: "Please accept to continue." }),
  })
  .refine((v) => v.domain !== "Other" || (v.custom_domain ?? "").trim().length > 1, {
    path: ["custom_domain"],
    message: "Tell us which domain you're interested in.",
  })
  .refine((v) => !v.whatsapp || phoneRegex.test(v.whatsapp.replace(/[\s-]/g, "")), {
    path: ["whatsapp"],
    message: "Enter a valid WhatsApp number.",
  });

type FormValues = z.infer<typeof schema>;

const STEPS = [
  { title: "Personal Details", fields: ["full_name", "email", "phone", "whatsapp", "date_of_birth"] },
  {
    title: "Education Details",
    fields: ["college", "degree", "department", "current_year", "graduation_year"],
  },
  { title: "Career Domain", fields: ["domain", "custom_domain"] },
  {
    title: "Program Preferences",
    fields: ["preferred_mode", "joining_month", "preferred_session"],
  },
  { title: "Confirm & Submit", fields: ["source", "consent"] },
] as const satisfies ReadonlyArray<{ title: string; fields: readonly (keyof FormValues)[] }>;

export function AdmissionWizard({ presetDomain }: { presetDomain?: string }) {
  const [step, setStep] = useState(0);
  const [appId, setAppId] = useState<string | null>(null);
  const { data: programs } = useQuery(programsQuery);
  const { data: months } = useQuery(joiningMonthsQuery);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    mode: "onTouched",
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      whatsapp: "",
      date_of_birth: "",
      college: "",
      degree: "",
      department: "",
      current_year: "",
      graduation_year: "",
      domain: presetDomain ?? "",
      custom_domain: "",
      preferred_mode: "",
      joining_month: "",
      preferred_session: "",
      source: "",
    } as Partial<FormValues> as FormValues,
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const next = async () => {
    const ok = await trigger(STEPS[step]!.fields as unknown as (keyof FormValues)[]);
    if (!ok) return;
    track("admission_form_started", `step_${step + 1}`);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (values: FormValues) => {
    const { consent: _consent, ...payload } = values;
    const { data, error } = await supabase.rpc("submit_admission", { payload });
    const result = data as { ok?: boolean; message?: string; application_id?: string } | null;
    if (error || !result?.ok) {
      toast.error(result?.message ?? "Something went wrong. Please try again.");
      return;
    }
    track("application_submitted", values.domain);
    setAppId(result.application_id ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (appId) return <SuccessScreen appId={appId} />;

  const activeMonths = (months ?? []).filter((m) => m.active);
  const domain = watch("domain");

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="flex flex-wrap items-center gap-2" aria-label="Application progress">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex items-center gap-2">
            <span
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                i < step
                  ? "bg-primary/15 text-primary"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <CheckCircle2 className="size-4" aria-hidden="true" /> : i + 1}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-4 bg-border sm:w-8" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <p className="mt-6 text-sm font-semibold text-primary">
        Step {step + 1} of {STEPS.length}
      </p>
      <h2 className="mt-1 text-2xl font-extrabold text-navy">{STEPS[step]!.title}</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
      >
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" required htmlFor="full_name" error={errors.full_name?.message}>
              <Input id="full_name" autoComplete="name" {...register("full_name")} />
            </Field>
            <Field label="Email" required htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
            </Field>
            <Field label="Mobile number" required htmlFor="phone" error={errors.phone?.message}>
              <Input id="phone" inputMode="tel" autoComplete="tel" {...register("phone")} />
            </Field>
            <Field label="WhatsApp number" htmlFor="whatsapp" error={errors.whatsapp?.message}>
              <Input id="whatsapp" inputMode="tel" {...register("whatsapp")} />
            </Field>
            <Field label="Date of birth" htmlFor="dob" error={errors.date_of_birth?.message}>
              <Input id="dob" type="date" {...register("date_of_birth")} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="College / University" required htmlFor="college" error={errors.college?.message}>
              <Input id="college" {...register("college")} />
            </Field>
            <Field label="Degree" htmlFor="degree" error={errors.degree?.message}>
              <Input id="degree" placeholder="B.E / B.Tech / MBA" {...register("degree")} />
            </Field>
            <Field label="Department" htmlFor="department" error={errors.department?.message}>
              <Input id="department" {...register("department")} />
            </Field>
            <SelectField
              control={control}
              name="current_year"
              label="Current year"
              required
              options={CURRENT_YEARS}
              error={errors.current_year?.message}
            />
            <Field label="Year of graduation" htmlFor="grad" error={errors.graduation_year?.message}>
              <Input id="grad" inputMode="numeric" placeholder="2026" {...register("graduation_year")} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5">
            <SelectField
              control={control}
              name="domain"
              label="Career domain"
              required
              options={[...(programs ?? []).map((p) => p.name), "Other"]}
              error={errors.domain?.message}
            />
            {domain === "Other" && (
              <Field
                label="Which domain are you interested in?"
                required
                htmlFor="custom_domain"
                error={errors.custom_domain?.message}
              >
                <Input id="custom_domain" {...register("custom_domain")} />
              </Field>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              control={control}
              name="preferred_mode"
              label="Preferred mode"
              required
              options={MODES}
              error={errors.preferred_mode?.message}
            />
            <SelectField
              control={control}
              name="joining_month"
              label="Joining month"
              required
              options={activeMonths.map((m) => m.month)}
              error={errors.joining_month?.message}
              emptyText="Batch months will be announced soon."
            />
            <SelectField
              control={control}
              name="preferred_session"
              label="Preferred session"
              required
              options={SESSIONS}
              error={errors.preferred_session?.message}
            />
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-5">
            <SelectField
              control={control}
              name="source"
              label="How did you hear about ORVIONAR?"
              required
              options={SOURCES}
              error={errors.source?.message}
            />
            <dl className="grid gap-2 rounded-xl bg-surface p-5 text-sm sm:grid-cols-2">
              {[
                ["Name", watch("full_name")],
                ["Email", watch("email")],
                ["Phone", watch("phone")],
                ["College", watch("college")],
                ["Domain", domain === "Other" ? watch("custom_domain") : domain],
                ["Mode", watch("preferred_mode")],
                ["Joining month", watch("joining_month")],
                ["Session", watch("preferred_session")],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-navy">{v || "—"}</dd>
                </div>
              ))}
            </dl>
            <Controller
              control={control}
              name="consent"
              render={({ field }) => (
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={!!field.value}
                    onCheckedChange={(c) => field.onChange(c === true)}
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground">
                    I confirm the details are correct and agree to be contacted by ORVIONAR
                    regarding my application, as described in the{" "}
                    <Link to="/privacy" className="font-medium text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
              )}
            />
            {errors.consent?.message && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.consent.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Submitting this form creates an application. Admission is confirmed only after the
              ORVIONAR admissions team completes the process.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || isSubmitting}
          >
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" variant="hero" size="lg" onClick={next}>
              Continue
            </Button>
          ) : (
            <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Submit Application
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function SelectField({
  control,
  name,
  label,
  options,
  error,
  required,
  emptyText,
}: {
  control: ReturnType<typeof useForm<FormValues>>["control"];
  name: keyof FormValues;
  label: string;
  options: readonly string[];
  error?: string | undefined;
  required?: boolean | undefined;
  emptyText?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field label={label} htmlFor={name} error={error} required={!!required}>
          {options.length === 0 ? (
            <p className="rounded-md border border-dashed px-3 py-2.5 text-sm text-muted-foreground">
              {emptyText ?? "No options available yet."}
            </p>
          ) : (
            <Select value={(field.value as string) || ""} onValueChange={field.onChange}>
              <SelectTrigger id={name} className="w-full">
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      )}
    />
  );
}

function SuccessScreen({ appId }: { appId: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-8 text-center shadow-[var(--shadow-card)] sm:p-12">
      <PartyPopper className="mx-auto size-10 text-primary" aria-hidden="true" />
      <h2 className="mt-4 text-3xl font-extrabold text-navy">Application Submitted</h2>
      <p className="mt-3 text-muted-foreground">
        Thank you for applying to the ORVIONAR 3-Month Program. Our admissions team will contact you
        with the next steps.
      </p>
      <div className="mt-6 rounded-2xl bg-surface p-6">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">Your Application ID</p>
        <p className="mt-1 text-2xl font-extrabold tracking-wider text-navy">{appId}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => {
            navigator.clipboard?.writeText(appId);
            toast.success("Application ID copied.");
          }}
        >
          <Copy className="size-4" aria-hidden="true" /> Copy ID
        </Button>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="hero" size="lg">
          <a
            href={whatsappLink(`Hi ORVIONAR, I submitted my application (${appId}).`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
