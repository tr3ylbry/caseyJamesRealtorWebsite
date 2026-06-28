import { NextRequest, NextResponse } from "next/server";
import { getPhoneDigits, hasContactErrors, validateContact, type ContactErrors, type ContactValues } from "@/lib/contact-validation";

type ContactResponse =
  | { ok: true }
  | { ok: false; errors?: ContactErrors; message: string };

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;
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

async function deliverInquiry(values: ContactValues) {
  const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL;

  if (!webhookUrl) {
    return process.env.NODE_ENV !== "production";
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      source: "Casey James realtor website",
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: getPhoneDigits(values.phone),
      address: values.address.trim(),
      message: values.message.trim(),
      submittedAt: new Date().toISOString(),
    }),
  });

  return response.ok;
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return NextResponse.json<ContactResponse>(
      { ok: false, message: "Too many requests." },
      { status: 429 },
    );
  }

  const formData = await request.formData();
  const honeypot = valueFromForm(formData, "company");

  if (honeypot) {
    return NextResponse.json<ContactResponse>({ ok: true });
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
    return NextResponse.json<ContactResponse>(
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
      return NextResponse.json<ContactResponse>(
        { ok: false, message: "Inquiry delivery is not configured." },
        { status: 503 },
      );
    }

    return NextResponse.json<ContactResponse>({ ok: true });
  } catch {
    return NextResponse.json<ContactResponse>(
      { ok: false, message: "Unable to receive inquiry." },
      { status: 500 },
    );
  }
}
