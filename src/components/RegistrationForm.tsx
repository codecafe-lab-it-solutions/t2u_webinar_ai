"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, ShieldCheck, Users } from "lucide-react";
import { WEBINAR_CONFIG } from "@/lib/config";
import { validateEmail, validateMobile, submitRegistration, RegistrationError } from "@/lib/registration";
import { captureReferralCode, captureUtmParams, trackEvent } from "@/lib/analytics";
import type { LearningGoal, Profession, RegistrationPayload } from "@/lib/types";
import Reveal from "./Reveal";

const PROFESSIONS: Profession[] = [
  "Student",
  "Working Professional",
  "Business Owner",
  "Freelancer",
  "Trainer/Coach",
  "Digital Marketer",
  "Other",
];

const LEARNING_GOALS: LearningGoal[] = [
  "Business Automation",
  "Career Growth",
  "Freelancing",
  "Content Creation",
  "Online Income",
  "Personal Productivity",
];

type FormState = {
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  whatsappSameAsMobile: boolean;
  email: string;
  city: string;
  profession: Profession | "";
  learningGoal: LearningGoal | "";
  consent: boolean;
  // Honeypot. Deliberately NOT named/labeled anything that resembles a real
  // profile field ("website", "url", "company", etc.) — identity-autofill
  // tools (Dashlane and others) actively scan the DOM for inputs matching
  // known field categories and silently fill them, autocomplete="off" or
  // not. A recognizable name here means real users with those tools active
  // get silently dropped on every submit, with no visible error — exactly
  // the "leads aren't saving" symptom this is fixing.
  hpField: string;
};

const INITIAL_STATE: FormState = {
  fullName: "",
  mobileNumber: "",
  whatsappNumber: "",
  whatsappSameAsMobile: true,
  email: "",
  city: "",
  profession: "",
  learningGoal: "",
  consent: false,
  hpField: "",
};

export default function RegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isPaid = WEBINAR_CONFIG.WEBINAR_MODE === "PAID";

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    if (!started) {
      setStarted(true);
      trackEvent("form_start");
    }
    if (submitError) setSubmitError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "नाम आवश्यक है";
    if (!validateMobile(form.mobileNumber)) next.mobileNumber = "10-digit valid mobile number डालें";
    if (!form.whatsappSameAsMobile && !validateMobile(form.whatsappNumber)) {
      next.whatsappNumber = "10-digit valid WhatsApp number डालें";
    }
    if (!validateEmail(form.email)) next.email = "सही email address डालें";
    if (!form.city.trim()) next.city = "City आवश्यक है";
    if (!form.profession) next.profession = "Profession चुनें";
    if (!form.consent) next.consent = "जारी रखने के लिए सहमति आवश्यक है";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.hpField) return; // honeypot tripped — silently drop
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);
    const utm = captureUtmParams();
    const payload: RegistrationPayload = {
      fullName: form.fullName.trim(),
      mobileNumber: form.mobileNumber.trim(),
      whatsappNumber: form.whatsappSameAsMobile ? form.mobileNumber.trim() : form.whatsappNumber.trim(),
      whatsappSameAsMobile: form.whatsappSameAsMobile,
      email: form.email.trim(),
      city: form.city.trim(),
      profession: form.profession,
      learningGoal: form.learningGoal,
      consent: form.consent,
      webinarName: WEBINAR_CONFIG.WEBINAR_NAME,
      webinarMode: WEBINAR_CONFIG.WEBINAR_MODE,
      utmSource: utm.source,
      utmMedium: utm.medium,
      utmCampaign: utm.campaign,
      referredBy: captureReferralCode(),
      consentTimestamp: new Date().toISOString(),
    };

    try {
      const result = await submitRegistration(payload);
      trackEvent("form_submit", { webinarMode: WEBINAR_CONFIG.WEBINAR_MODE });

      // Fire-and-forget: the CRM lead (source of truth) is already saved at
      // this point, so a slow/failed email send shouldn't block the user's
      // redirect to the thank-you page.
      fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          userName: payload.fullName,
          registrationId: result.registrationId,
        }),
      }).catch((err) => {
        console.error("Confirmation email request failed", err);
      });

      sessionStorage.setItem("t2u_registration", JSON.stringify(result));
      router.push("/thank-you");
    } catch (err) {
      const message =
        err instanceof RegistrationError
          ? err.message
          : "कुछ गलत हो गया। कृपया दोबारा कोशिश करें।";
      setSubmitError(message);
      setSubmitting(false);
    }
  };

  const registrationClosed = WEBINAR_CONFIG.REGISTRATION_STATUS === "CLOSED";

  return (
    <section id="register" className="section relative overflow-hidden">
      <div className="bg-blob left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 bg-brand-primary opacity-15" />
      <div className="container relative mx-auto max-w-[1180px] px-5">
        <div className="section-head">
          <span className="kicker">Reserve Your Seat</span>
          <h2>अपनी Seat Reserve करें</h2>
        </div>

        <Reveal>
          <div className="mx-auto max-w-[640px] rounded-xl border border-border-strong bg-card p-7 shadow-[0_24px_60px_-30px_rgba(124,58,237,0.4)] sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                <Users size={14} strokeWidth={2} className="text-brand-accent" />
                Limited to {WEBINAR_CONFIG.SEATS_LIMIT} seats
              </span>
              <span className="font-mono text-lg font-extrabold text-gradient-end">
                {isPaid ? `₹${WEBINAR_CONFIG.WEBINAR_PRICE}` : "FREE"}
              </span>
            </div>

            {registrationClosed ? (
              <p className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-center text-sm text-warning">
                Registration फ़िलहाल बंद है — कृपया बाद में दोबारा देखें।
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/*
                  Honeypot — hidden from real users, bots tend to fill every
                  field. Name/id/label are deliberately non-descriptive
                  (not "website"/"url"/"company") so identity-autofill tools
                  like Dashlane don't recognize and silently fill it.
                */}
                <div className="absolute -left-[9999px] h-0 opacity-0" aria-hidden="true">
                  <label htmlFor="hp-token-2847">Leave this field blank</label>
                  <input
                    id="hp-token-2847"
                    name="hp-token-2847"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.hpField}
                    onChange={(e) => update("hpField", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      className={`w-full rounded-md border bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 ${
                        errors.fullName ? "border-error" : "border-border-strong"
                      }`}
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-error">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="mobileNumber">
                      Mobile Number
                    </label>
                    <div className="flex">
                      <span className="flex items-center rounded-l-md border border-r-0 border-border-strong bg-surface px-3 font-mono text-sm text-text-muted">
                        +91
                      </span>
                      <input
                        id="mobileNumber"
                        inputMode="numeric"
                        maxLength={10}
                        className={`w-full rounded-r-md border bg-surface px-3.5 py-3 text-[15px] font-mono outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 ${
                          errors.mobileNumber ? "border-error" : "border-border-strong"
                        }`}
                        value={form.mobileNumber}
                        onChange={(e) => update("mobileNumber", e.target.value.replace(/\D/g, ""))}
                      />
                    </div>
                    {errors.mobileNumber && (
                      <p className="mt-1 text-xs text-error">{errors.mobileNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`w-full rounded-md border bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 ${
                        errors.email ? "border-error" : "border-border-strong"
                      }`}
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                    {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-start gap-2.5">
                      <input
                        id="whatsappSame"
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-brand-primary"
                        checked={form.whatsappSameAsMobile}
                        onChange={(e) => update("whatsappSameAsMobile", e.target.checked)}
                      />
                      <label htmlFor="whatsappSame" className="text-[13px] text-text-muted">
                        WhatsApp number is same as mobile number
                      </label>
                    </div>
                    {!form.whatsappSameAsMobile && (
                      <div className="mt-3">
                        <label className="field-label" htmlFor="whatsappNumber">
                          WhatsApp Number
                        </label>
                        <div className="flex">
                          <span className="flex items-center rounded-l-md border border-r-0 border-border-strong bg-surface px-3 font-mono text-sm text-text-muted">
                            +91
                          </span>
                          <input
                            id="whatsappNumber"
                            inputMode="numeric"
                            maxLength={10}
                            className={`w-full rounded-r-md border bg-surface px-3.5 py-3 text-[15px] font-mono outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 ${
                              errors.whatsappNumber ? "border-error" : "border-border-strong"
                            }`}
                            value={form.whatsappNumber}
                            onChange={(e) =>
                              update("whatsappNumber", e.target.value.replace(/\D/g, ""))
                            }
                          />
                        </div>
                        {errors.whatsappNumber && (
                          <p className="mt-1 text-xs text-error">{errors.whatsappNumber}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="city">
                      City
                    </label>
                    <input
                      id="city"
                      className={`w-full rounded-md border bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 ${
                        errors.city ? "border-error" : "border-border-strong"
                      }`}
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                    {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="profession">
                      Profession
                    </label>
                    <select
                      id="profession"
                      className={`w-full rounded-md border bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 ${
                        errors.profession ? "border-error" : "border-border-strong"
                      }`}
                      value={form.profession}
                      onChange={(e) => update("profession", e.target.value as Profession)}
                    >
                      <option value="">चुनें</option>
                      {PROFESSIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {errors.profession && (
                      <p className="mt-1 text-xs text-error">{errors.profession}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor="learningGoal">
                      आप AI Automation क्यों सीखना चाहते हैं? (optional)
                    </label>
                    <select
                      id="learningGoal"
                      className="w-full rounded-md border border-border-strong bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25"
                      value={form.learningGoal}
                      onChange={(e) => update("learningGoal", e.target.value as LearningGoal)}
                    >
                      <option value="">चुनें</option>
                      {LEARNING_GOALS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-2.5">
                  <input
                    id="consent"
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-brand-primary"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                  />
                  <label htmlFor="consent" className="text-[13px] text-text-muted">
                    मैं {WEBINAR_CONFIG.BRAND_NAME} से webinar confirmation, reminders और संबंधित
                    updates WhatsApp, call या email पर प्राप्त करने के लिए सहमत हूँ।
                  </label>
                </div>
                {errors.consent && <p className="mt-1 text-xs text-error">{errors.consent}</p>}

                {submitError && (
                  <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error">
                    <AlertCircle size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
                    <p>{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 text-base font-bold disabled:opacity-60"
                >
                  {submitting
                    ? "Processing..."
                    : isPaid
                      ? `Pay ₹${WEBINAR_CONFIG.WEBINAR_PRICE} & Reserve My Seat`
                      : "🚀 Reserve My Seat Now"}
                </button>

                {isPaid && (
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-text-faint">
                    <ShieldCheck size={14} strokeWidth={2} />
                    100% Secure Payment Powered by Razorpay
                  </p>
                )}

                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-text-faint">
                  <Lock size={13} strokeWidth={2} />
                  आपकी जानकारी सुरक्षित है और केवल webinar communication के लिए इस्तेमाल होगी।
                </p>
                <p className="mt-3 text-center text-xs text-text-faint">
                  <a href="/privacy-policy" className="underline">
                    Privacy Policy
                  </a>{" "}
                  ·{" "}
                  <a href="/terms" className="underline">
                    Terms
                  </a>
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
