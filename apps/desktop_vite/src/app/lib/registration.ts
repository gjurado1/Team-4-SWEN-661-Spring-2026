import type { UserRole } from '../contexts/UserContext';

export type RegistrationRole = UserRole | 'both';

export type RegisterField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'address1'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'registrationRole'
  | 'password'
  | 'confirmPassword';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  registrationRole: RegistrationRole | '';
  password: string;
  confirmPassword: string;
}

export interface StoredRegistration {
  firstName: string;
  lastName: string;
  email: string;
  allowedRoles: UserRole[];
}

export const REGISTRATION_STORAGE_KEY = 'careconnect-registered-users';

export const STATE_OPTIONS: ReadonlyArray<{ code: string; name: string }> = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'GU', name: 'Guam' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'VI', name: 'U.S. Virgin Islands' },
  { code: 'AA', name: 'Armed Forces Americas' },
  { code: 'AE', name: 'Armed Forces Europe' },
  { code: 'AP', name: 'Armed Forces Pacific' },
];

export const INITIAL_REGISTER_DATA: RegisterFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  city: '',
  state: '',
  postalCode: '',
  registrationRole: '',
  password: '',
  confirmPassword: '',
};

/** Strip control characters (ASCII 0–31 and 127) from a string. */
export function removeControlCharacters(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, '');
}

/** Normalize text: remove control chars and collapse multiple spaces. */
export function sanitizeTextInput(value: string): string {
  return removeControlCharacters(value).replace(/\s{2,}/g, ' ');
}

/** Normalize email: trim, lowercase, remove control chars. */
export function sanitizeEmailInput(value: string): string {
  return removeControlCharacters(value).trim().toLowerCase();
}

/** Return only digit characters from a string. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Format up to 10 digits as (XXX) XXX-XXXX. */
export function formatPhoneNumber(value: string): string {
  const digits = onlyDigits(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Validate registration form; returns an object of field errors (empty if valid). */
export function validateRegisterForm(
  data: RegisterFormData
): Partial<Record<RegisterField, string>> {
  const errors: Partial<Record<RegisterField, string>> = {};

  if (!/^[A-Za-z][A-Za-z' -]{1,49}$/.test(data.firstName.trim())) {
    errors.firstName = 'First name must be 2-50 characters and contain letters only.';
  }

  if (!/^[A-Za-z][A-Za-z' -]{1,49}$/.test(data.lastName.trim())) {
    errors.lastName = 'Last name must be 2-50 characters and contain letters only.';
  }

  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (onlyDigits(data.phone).length !== 10) {
    errors.phone = 'Phone number must be 10 digits.';
  }

  if (data.address1.trim().length < 5 || data.address1.trim().length > 100) {
    errors.address1 = 'Address must be between 5 and 100 characters.';
  }

  if (!/^[A-Za-z][A-Za-z' -]{1,49}$/.test(data.city.trim())) {
    errors.city = 'Enter a valid city name.';
  }

  if (!STATE_OPTIONS.some((option) => option.code === data.state)) {
    errors.state = 'Please select a valid state or territory.';
  }

  if (!/^\d{5}(-\d{4})?$/.test(data.postalCode.trim())) {
    errors.postalCode = 'Enter a valid ZIP code (12345 or 12345-6789).';
  }

  if (!data.registrationRole) {
    errors.registrationRole = 'Select an account role.';
  }

  const passwordRules =
    data.password.length >= 12 &&
    /[a-z]/.test(data.password) &&
    /[A-Z]/.test(data.password) &&
    /\d/.test(data.password) &&
    /[^A-Za-z0-9]/.test(data.password);

  if (!passwordRules) {
    errors.password = 'Password needs 12+ chars with upper, lower, number, and symbol.';
  }

  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}
