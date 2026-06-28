"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { formatPhone, hasContactErrors, validateContact, type ContactErrors, type ContactValues } from "@/lib/contact-validation";
import { siteConfig } from "@/lib/site";

type FormStatus = "idle" | "submitting" | "success" | "error";

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
  const [phoneInputError, setPhoneInputError] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("Required fields are marked. No pressure — just a practical conversation about your goals.");
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success" || status === "error") {
      statusRef.current?.focus();
    }
  }, [status]);

  function updateField(field: keyof ContactValues, value: string | boolean) {
    const next = { ...values, [field]: value };
    const nextValidation = validateContact(next);

    setValues(next);
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      if (field in nextErrors && !nextValidation[field as keyof ContactErrors]) {
        delete nextErrors[field as keyof ContactErrors];
      }

      if ((field === "email" || field === "phone") && !nextValidation.contactMethod) {
        delete nextErrors.contactMethod;
      }

      if (field === "email" && next.email.trim() && nextValidation.email) {
        nextErrors.email = nextValidation.email;
      }

      if (field === "phone" && next.phone.trim() && nextValidation.phone) {
        nextErrors.phone = nextValidation.phone;
      }

      return nextErrors;
    });

    if (status === "error") {
      setStatus("idle");
      setStatusMessage("Required fields are marked. No pressure —just a practical conversation about your goals.");
    }
  }

  function handleTextChange(field: keyof ContactValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateField(field, event.target.value);
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
      setErrors(nextErrors);
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
        setErrors(data.errors ?? {});
        setStatus("error");
        setStatusMessage(fieldStatusMessage(response.status));
        return;
      }

      setValues(initialValues);
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

      <div
        ref={statusRef}
        className={`form-status form-status--${status}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        {statusMessage}
      </div>

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
          onChange={handleTextChange("address")}
        />
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
        />
        <span className="consent-copy">
          <span>I agree to be contacted about my inquiry. Message and data rates may apply.</span>
          {errors.consent ? <small className="field-error" id={errorId("consent")}>{errors.consent}</small> : null}
        </span>
      </label>
      <button className="button button--gold" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Requesting..." : "Request my consultation"}
      </button>
      <p className="form-note">
        Email and phone are optional individually; Casey just needs one valid way to follow up.
      </p>
    </form>
  );
}
