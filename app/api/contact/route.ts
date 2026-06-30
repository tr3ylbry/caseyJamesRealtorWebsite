import { NextRequest, NextResponse } from "next/server";
import { getPhoneDigits, hasContactErrors, validateContact, type ContactErrors, type ContactValues } from "@/lib/contact-validation";

type ContactResponse =
  | { ok: true }
  | { ok: false; errors?: ContactErrors; message: string };

const noStoreHeaders = { "Cache-Control": "no-store" };
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor || realIp || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  return false;
}

function valueFromForm(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function contactJson(body: ContactResponse, init?: ResponseInit) {
  return NextResponse.json<ContactResponse>(body, {
    ...init,
    headers: {
      ...noStoreHeaders,
      ...init?.headers,
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatOptionalValue(value: string) {
  return value.trim() || "Not provided";
}

function buildInquiryEmail(values: ContactValues) {
  const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
  const email = formatOptionalValue(values.email);
  const phoneDigits = getPhoneDigits(values.phone);
  const phone = phoneDigits || "Not provided";
  const address = formatOptionalValue(values.address);
  const message = values.message.trim();
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Phoenix",
  });

  const text = [
    "New Casey James realtor website inquiry",
    "",
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Property address/neighborhood: ${address}`,
    `Submitted: ${submittedAt} Arizona time`,
    "",
    "Message:",
    message,
  ].join("\n");

  const rows = [
    ["Name", fullName],
    ["Email", email],
    ["Phone", phone],
    ["Property address/neighborhood", address],
    ["Submitted", `${submittedAt} Arizona time`],
  ];

  const htmlRows = rows.map(([label, value]) => `
    <tr>
      <th style="padding: 10px 12px; text-align: left; vertical-align: top; border-bottom: 1px solid #e8e2d7; color: #5f594f; font-family: Arial, sans-serif; font-size: 13px;">${escapeHtml(label)}</th>
      <td style="padding: 10px 12px; vertical-align: top; border-bottom: 1px solid #e8e2d7; color: #17130d; font-family: Arial, sans-serif; font-size: 14px;">${escapeHtml(value)}</td>
    </tr>
  `).join("");

  const html = `
    <div style="margin: 0; padding: 28px; background: #f7f2e8;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2d7c4;">
        <div style="padding: 24px 28px; background: #090908;">
          <p style="margin: 0 0 8px; color: #d6a64f; font-family: Arial, sans-serif; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;">Casey James Realtor Website</p>
          <h1 style="margin: 0; color: #fff8ec; font-family: Georgia, serif; font-size: 28px; font-weight: 500;">New seller inquiry</h1>
        </div>
        <div style="padding: 24px 28px;">
          <table style="width: 100%; border-collapse: collapse;">${htmlRows}</table>
          <div style="margin-top: 24px;">
            <h2 style="margin: 0 0 10px; color: #17130d; font-family: Georgia, serif; font-size: 22px; font-weight: 500;">Message</h2>
            <p style="margin: 0; white-space: pre-line; color: #3f3930; font-family: Arial, sans-serif; font-size: 15px; line-height: 1.65;">${escapeHtml(message)}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  return { fullName, html, text };
}

async function deliverInquiry(values: ContactValues) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    return process.env.NODE_ENV !== "production";
  }

  const email = buildInquiryEmail(values);
  const replyTo = values.email.trim();

  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${resendApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `New seller inquiry from ${email.fullName}`,
      html: email.html,
      text: email.text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  return response.ok;
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return contactJson(
      { ok: false, message: "Too many requests." },
      { status: 429 },
    );
  }

  const formData = await request.formData();
  const honeypot = valueFromForm(formData, "company");

  if (honeypot) {
    return contactJson({ ok: true });
  }

  const values: ContactValues = {
    firstName: valueFromForm(formData, "firstName"),
    lastName: valueFromForm(formData, "lastName"),
    email: valueFromForm(formData, "email"),
    phone: valueFromForm(formData, "phone"),
    address: valueFromForm(formData, "address"),
    message: valueFromForm(formData, "message"),
    consent: formData.get("consent") === "on",
  };

  const errors = validateContact(values);

  if (hasContactErrors(errors)) {
    return contactJson(
      {
        ok: false,
        errors,
        message: "Please complete the required fields and provide a valid way for Casey to follow up.",
      },
      { status: 400 },
    );
  }

  try {
    const delivered = await deliverInquiry(values);

    if (!delivered) {
      return contactJson(
        { ok: false, message: "Inquiry delivery is not configured." },
        { status: 503 },
      );
    }

    return contactJson({ ok: true });
  } catch {
    return contactJson(
      { ok: false, message: "Unable to receive inquiry." },
      { status: 500 },
    );
  }
}
