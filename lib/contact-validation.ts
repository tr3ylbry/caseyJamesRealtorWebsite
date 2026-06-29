export const contactFieldMessages = {
  firstName: "Please enter your first name.",
  lastName: "Please enter your last name.",
  email: "Please enter a valid email address.",
  phone: "Please enter a valid 10-digit phone number.",
  contactMethod: "Please provide an email address or phone number so Casey can follow up.",
  address: "Please keep your property address or neighborhood under 200 characters.",
  message: "Please enter at least 10 characters about your home or selling goals.",
  consent: "Please confirm Casey may contact you about your inquiry.",
} as const;

export const contactFieldLimits = {
  firstName: 80,
  lastName: 80,
  email: 254,
  phoneFormatted: 20,
  phoneDigits: 10,
  address: 200,
  message: 3000,
} as const;

const contactLengthMessages = {
  firstName: "Please keep your first name under 80 characters.",
  lastName: "Please keep your last name under 80 characters.",
  email: "Please keep your email address under 254 characters.",
  message: "Please keep your message under 3000 characters.",
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
  return value.replace(/\D/g, "");
}

export function formatPhone(value: string) {
  const digits = getPhoneDigits(value).slice(0, contactFieldLimits.phoneDigits);

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
  return getPhoneDigits(value).length === contactFieldLimits.phoneDigits;
}

export function validateContact(values: ContactValues) {
  const errors: ContactErrors = {};
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const phoneDigits = getPhoneDigits(phone);
  const address = values.address.trim();
  const message = values.message.trim();

  if (!firstName) {
    errors.firstName = contactFieldMessages.firstName;
  } else if (firstName.length > contactFieldLimits.firstName) {
    errors.firstName = contactLengthMessages.firstName;
  }

  if (!lastName) {
    errors.lastName = contactFieldMessages.lastName;
  } else if (lastName.length > contactFieldLimits.lastName) {
    errors.lastName = contactLengthMessages.lastName;
  }

  if (message.length < 10) {
    errors.message = contactFieldMessages.message;
  } else if (message.length > contactFieldLimits.message) {
    errors.message = contactLengthMessages.message;
  }

  if (!email && !phone) {
    errors.contactMethod = contactFieldMessages.contactMethod;
  }

  if (email && email.length > contactFieldLimits.email) {
    errors.email = contactLengthMessages.email;
  } else if (email && !isValidEmail(email)) {
    errors.email = contactFieldMessages.email;
  }

  if (phone && (phone.length > contactFieldLimits.phoneFormatted || phoneDigits.length !== contactFieldLimits.phoneDigits)) {
    errors.phone = contactFieldMessages.phone;
  }

  if (address.length > contactFieldLimits.address) {
    errors.address = contactFieldMessages.address;
  }

  if (!values.consent) {
    errors.consent = contactFieldMessages.consent;
  }

  return errors;
}

export function hasContactErrors(errors: ContactErrors) {
  return Object.keys(errors).length > 0;
}
