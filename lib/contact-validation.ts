export const contactFieldMessages = {
  firstName: "Please enter your first name.",
  lastName: "Please enter your last name.",
  email: "Please enter a valid email address.",
  phone: "Please enter a valid 10-digit phone number.",
  contactMethod: "Please provide an email address or phone number so Casey can follow up.",
  message: "Please enter at least 10 characters about your home or selling goals.",
  consent: "Please confirm Casey may contact you about your inquiry.",
} as const;

export type ContactField = keyof typeof contactFieldMessages;

export type ContactValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  consent: boolean;
};

export type ContactErrors = Partial<Record<ContactField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getPhoneDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function formatPhone(value: string) {
  const digits = getPhoneDigits(value);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidEmail(value: string) {
  return emailPattern.test(value.trim());
}

export function isValidPhone(value: string) {
  return getPhoneDigits(value).length === 10;
}

export function validateContact(values: ContactValues) {
  const errors: ContactErrors = {};
  const email = values.email.trim();
  const phone = values.phone.trim();

  if (!values.firstName.trim()) {
    errors.firstName = contactFieldMessages.firstName;
  }

  if (!values.lastName.trim()) {
    errors.lastName = contactFieldMessages.lastName;
  }

  if (values.message.trim().length < 10) {
    errors.message = contactFieldMessages.message;
  }

  if (!email && !phone) {
    errors.contactMethod = contactFieldMessages.contactMethod;
  }

  if (email && !isValidEmail(email)) {
    errors.email = contactFieldMessages.email;
  }

  if (phone && !isValidPhone(phone)) {
    errors.phone = contactFieldMessages.phone;
  }

  if (!values.consent) {
    errors.consent = contactFieldMessages.consent;
  }

  return errors;
}

export function hasContactErrors(errors: ContactErrors) {
  return Object.keys(errors).length > 0;
}
