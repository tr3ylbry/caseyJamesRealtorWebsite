"use client";

import { useState } from "react";

type FormStatus = "idle" | "submitted";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("submitted");
      }}
    >
      <div className="form-row">
        <label>
          <span>First name</span>
          <input name="firstName" autoComplete="given-name" required />
        </label>
        <label>
          <span>Last name</span>
          <input name="lastName" autoComplete="family-name" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>Email address</span>
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label>
          <span>Phone number</span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" />
        </label>
      </div>
      <label>
        <span>Property address</span>
        <input name="address" autoComplete="street-address" placeholder="Address or neighborhood" />
      </label>
      <label>
        <span>How can Casey help?</span>
        <textarea name="message" rows={4} placeholder="Tell me a little about your home and timeline." required />
      </label>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>I agree to be contacted about my real estate inquiry. Message and data rates may apply.</span>
      </label>
      <button className="button button--gold" type="submit">Request my consultation</button>
      <p className="form-note" role="status" aria-live="polite">
        {status === "submitted"
          ? "Thanks — the form is ready for delivery integration before launch."
          : "No pressure. Just a practical conversation about your goals."}
      </p>
    </form>
  );
}
