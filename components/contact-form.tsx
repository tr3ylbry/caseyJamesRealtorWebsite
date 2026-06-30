"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { formatPhone, hasContactErrors, validateContact, type ContactErrors, type ContactValues } from "@/lib/contact-validation";
import { siteConfig } from "@/lib/site";

type FormStatus = "idle" | "submitting" | "success" | "error";
type ContactValueField = keyof ContactValues;
type TouchedFields = Partial<Record<ContactValueField, boolean>>;

const initialValues: ContactValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  message: "",
  consent: false,
};

function errorId(field: string) {
  return `contact-${field}-error`;
}

function visibleErrorsFor(validationErrors: ContactErrors, touched: TouchedFields, hasSubmitted: boolean) {
  const visibleErrors: ContactErrors = {};
  const fields: ContactValueField[] = ["firstName", "lastName", "email", "phone", "address", "message", "consent"];

  for (const field of fields) {
    if (validationErrors[field] && (hasSubmitted || touched[field])) {
      visibleErrors[field] = validationErrors[field];
    }
  }

  if (validationErrors.contactMethod && (hasSubmitted || (touched.email && touched.phone))) {
    visibleErrors.contactMethod = validationErrors.contactMethod;
  }

  return visibleErrors;
}

function fieldStatusMessage(status: number) {
  if (status === 400) {
    return "Please complete the required fields and provide a valid way for Casey to follow up.";
  }

  if (status === 429) {
    return "Please wait a moment before submitting another inquiry.";
  }

  if (status === 500 || status === 503) {
    return `We’re having trouble receiving inquiries right now. Please try again shortly, or contact Casey directly at ${siteConfig.fallbackContactEmail}.`;
  }

  return "Something went wrong while sending your inquiry. Please try again.";
}

type ContactApiResponse = {
  ok: boolean;
  errors?: ContactErrors;
};

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [phoneInputError, setPhoneInputError] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("Required fields are marked. No pressure — just a practical conversation about your goals.");
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success" || status === "error") {
      statusRef.current?.focus();
    }
  }, [status]);

  function updateField(field: ContactValueField, value: string | boolean) {
    const next = { ...values, [field]: value };
    const nextValidation = validateContact(next);

    setValues(next);
    setErrors(visibleErrorsFor(nextValidation, touched, hasSubmitted));

    if (status === "error") {
      setStatus("idle");
      setStatusMessage("Required fields are marked. No pressure — just a practical conversation about your goals.");
    }
  }

  function handleTextChange(field: ContactValueField) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateField(field, event.target.value);
    };
  }

  function handleBlur(field: ContactValueField) {
    return () => {
      const nextTouched = { ...touched, [field]: true };

      setTouched(nextTouched);
      setErrors(visibleErrorsFor(validateContact(values), nextTouched, hasSubmitted));
    };
  }

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;
    const digitsOnly = rawValue.replace(/\D/g, "");

    if (rawValue && rawValue.replace(/[-\s()]/g, "").match(/\D/)) {
      setPhoneInputError("Please enter numbers only.");
    } else if (digitsOnly) {
      setPhoneInputError("");
    }

    updateField("phone", formatPhone(digitsOnly));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    const nextErrors = validateContact(values);

    if (hasContactErrors(nextErrors)) {
      setHasSubmitted(true);
      setErrors(visibleErrorsFor(nextErrors, touched, true));
      setStatus("error");
      setStatusMessage("Please complete the highlighted fields before submitting.");
      return;
    }

    setErrors({});
    setPhoneInputError("");
    setStatus("submitting");
    setStatusMessage("Sending your inquiry...");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
        headers: { accept: "application/json" },
      });

      const data = (await response.json().catch(() => ({ ok: false }))) as ContactApiResponse;

      if (!response.ok || !data.ok) {
        setHasSubmitted(true);
        setErrors(data.errors ?? {});
        setStatus("error");
        setStatusMessage(fieldStatusMessage(response.status));
        return;
      }

      setValues(initialValues);
      setTouched({});
      setHasSubmitted(false);
      setStatus("success");
      setStatusMessage("Thanks — your inquiry has been received. Casey will follow up directly.");
    } catch {
      setStatus("error");
      setStatusMessage(fieldStatusMessage(503));
    }
  }

  const emailDescribedBy = [
    errors.email ? errorId("email") : "",
    errors.contactMethod ? errorId("contactMethod") : "",
  ].filter(Boolean).join(" ") || undefined;

  const phoneDescribedBy = [
    errors.phone ? errorId("phone") : "",
    errors.contactMethod ? errorId("contactMethod") : "",
    phoneInputError ? errorId("phoneInput") : "",
  ].filter(Boolean).join(" ") || undefined;

  return (
    <form
      action="/api/contact"
      method="post"
      className="contact-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <input className="honeypot-field" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="form-row">
        <label>
          <span>First name <em aria-hidden="true">Required</em></span>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            value={values.firstName}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? errorId("firstName") : undefined}
            onChange={handleTextChange("firstName")}
            onBlur={handleBlur("firstName")}
          />
          {errors.firstName ? <small className="field-error" id={errorId("firstName")}>{errors.firstName}</small> : null}
        </label>
        <label>
          <span>Last name <em aria-hidden="true">Required</em></span>
          <input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            value={values.lastName}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? errorId("lastName") : undefined}
            onChange={handleTextChange("lastName")}
            onBlur={handleBlur("lastName")}
          />
          {errors.lastName ? <small className="field-error" id={errorId("lastName")}>{errors.lastName}</small> : null}
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>Email address</span>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={Boolean(errors.email || errors.contactMethod)}
            aria-describedby={emailDescribedBy}
            onChange={handleTextChange("email")}
            onBlur={handleBlur("email")}
          />
          {errors.email ? <small className="field-error" id={errorId("email")}>{errors.email}</small> : null}
        </label>
        <label>
          <span>Phone number</span>
          <input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="numeric"
            value={values.phone}
            aria-invalid={Boolean(errors.phone || errors.contactMethod || phoneInputError)}
            aria-describedby={phoneDescribedBy}
            onChange={handlePhoneChange}
            onBlur={handleBlur("phone")}
          />
          {phoneInputError ? <small className="field-error" id={errorId("phoneInput")}>{phoneInputError}</small> : null}
          {errors.phone ? <small className="field-error" id={errorId("phone")}>{errors.phone}</small> : null}
        </label>
      </div>
      {errors.contactMethod ? <small className="field-error field-error--row" id={errorId("contactMethod")}>{errors.contactMethod}</small> : null}
      <label>
        <span>Property address or neighborhood</span>
        <input
          id="address"
          name="address"
          autoComplete="street-address"
          placeholder="Address or neighborhood"
          value={values.address}
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? errorId("address") : undefined}
          onChange={handleTextChange("address")}
          onBlur={handleBlur("address")}
        />
        {errors.address ? <small className="field-error" id={errorId("address")}>{errors.address}</small> : null}
      </label>
      <label>
        <span>How can Casey help? <em aria-hidden="true">Required</em></span>
        <textarea
          id="message"
          name="message"
          rows={4}
          minLength={10}
          placeholder="Tell me a little about your home and timeline."
          value={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errorId("message") : undefined}
          onChange={handleTextChange("message")}
          onBlur={handleBlur("message")}
        />
        {errors.message ? <small className="field-error" id={errorId("message")}>{errors.message}</small> : null}
      </label>
      <label className="consent">
        <input
          id="consent"
          type="checkbox"
          name="consent"
          checked={values.consent}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? errorId("consent") : undefined}
          onChange={(event) => updateField("consent", event.target.checked)}
          onBlur={handleBlur("consent")}
        />
        <span className="consent-copy">
          <span>I agree to be contacted about my inquiry. Message and data rates may apply.</span>
          {errors.consent ? <small className="field-error" id={errorId("consent")}>{errors.consent}</small> : null}
        </span>
      </label>
      <button className="button button--gold" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Requesting..." : "Request my consultation"}
      </button>
      <div
        ref={statusRef}
        className={`form-status form-status--${status}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        {statusMessage}
      </div>
      <p className="form-note">
        Email and phone are optional individually; Casey just needs one valid way to follow up.
      </p>
    </form>
  );
}
