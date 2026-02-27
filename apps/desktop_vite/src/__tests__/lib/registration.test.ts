import { describe, it, expect } from 'vitest';
import {
  removeControlCharacters,
  sanitizeTextInput,
  sanitizeEmailInput,
  onlyDigits,
  formatPhoneNumber,
  validateRegisterForm,
  INITIAL_REGISTER_DATA,
  STATE_OPTIONS,
  type RegisterFormData,
} from '../../app/lib/registration';

describe('registration business logic', () => {
  describe('removeControlCharacters', () => {
    it('removes null and other control characters', () => {
      expect(removeControlCharacters('a\u0000b\u001Fc')).toBe('abc');
    });
    it('removes DEL (0x7F)', () => {
      expect(removeControlCharacters('x\u007Fy')).toBe('xy');
    });
    it('leaves printable characters unchanged', () => {
      expect(removeControlCharacters('hello')).toBe('hello');
      expect(removeControlCharacters('space here')).toBe('space here');
    });
  });

  describe('sanitizeTextInput', () => {
    it('collapses multiple spaces to one', () => {
      expect(sanitizeTextInput('a    b')).toBe('a b');
    });
    it('removes control characters before collapsing spaces', () => {
      expect(sanitizeTextInput('a\u0000  b')).toBe('a b');
    });
  });

  describe('sanitizeEmailInput', () => {
    it('trims and lowercases email', () => {
      expect(sanitizeEmailInput('  User@Example.COM  ')).toBe('user@example.com');
    });
    it('removes control characters', () => {
      expect(sanitizeEmailInput('a\u0000@b.com')).toBe('a@b.com');
    });
  });

  describe('onlyDigits', () => {
    it('returns only digit characters', () => {
      expect(onlyDigits('(555) 123-4567')).toBe('5551234567');
    });
    it('returns empty string when no digits', () => {
      expect(onlyDigits('abc')).toBe('');
    });
    it('handles mixed input', () => {
      expect(onlyDigits('1a2b3')).toBe('123');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats 3 or fewer digits as raw digits', () => {
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('12')).toBe('12');
    });
    it('formats 4–6 digits as (XXX) XXX', () => {
      expect(formatPhoneNumber('1234')).toBe('(123) 4');
      expect(formatPhoneNumber('123456')).toBe('(123) 456');
    });
    it('formats 7–10 digits as (XXX) XXX-XXXX', () => {
      expect(formatPhoneNumber('1234567')).toBe('(123) 456-7');
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
    });
    it('strips non-digits and caps at 10', () => {
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('5551234567899')).toBe('(555) 123-4567');
    });
  });

  describe('validateRegisterForm', () => {
    const validData: RegisterFormData = {
      ...INITIAL_REGISTER_DATA,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '(555) 123-4567',
      address1: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      registrationRole: 'caregiver',
      password: 'SecurePass1!',
      confirmPassword: 'SecurePass1!',
    };

    it('returns no errors for valid data', () => {
      expect(validateRegisterForm(validData)).toEqual({});
    });

    it('rejects first name that is too short or invalid', () => {
      expect(validateRegisterForm({ ...validData, firstName: 'J' }).firstName).toContain(
        '2-50 characters'
      );
      expect(validateRegisterForm({ ...validData, firstName: 'Jane1' }).firstName).toBeDefined();
      expect(validateRegisterForm({ ...validData, firstName: 'Jane' }).firstName).toBeUndefined();
    });

    it('rejects last name that is too short or invalid', () => {
      expect(validateRegisterForm({ ...validData, lastName: 'D' }).lastName).toContain(
        '2-50 characters'
      );
      expect(validateRegisterForm({ ...validData, lastName: 'Doe' }).lastName).toBeUndefined();
    });

    it('rejects invalid email', () => {
      expect(validateRegisterForm({ ...validData, email: 'bad' }).email).toContain(
        'valid email'
      );
      expect(validateRegisterForm({ ...validData, email: 'a@b.co' }).email).toBeUndefined();
    });

    it('rejects phone that does not have 10 digits', () => {
      expect(validateRegisterForm({ ...validData, phone: '123' }).phone).toContain('10 digits');
      expect(validateRegisterForm({ ...validData, phone: '(555) 123-4567' }).phone).toBeUndefined();
    });

    it('rejects address too short or too long', () => {
      expect(validateRegisterForm({ ...validData, address1: '123' }).address1).toContain(
        '5 and 100'
      );
      expect(
        validateRegisterForm({ ...validData, address1: 'a'.repeat(101) }).address1
      ).toBeDefined();
    });

    it('rejects invalid city', () => {
      expect(validateRegisterForm({ ...validData, city: 'X' }).city).toContain('valid city');
    });

    it('rejects invalid state', () => {
      expect(validateRegisterForm({ ...validData, state: 'XX' }).state).toContain(
        'valid state or territory'
      );
      expect(validateRegisterForm({ ...validData, state: 'IL' }).state).toBeUndefined();
    });

    it('rejects invalid ZIP', () => {
      expect(validateRegisterForm({ ...validData, postalCode: '1234' }).postalCode).toContain(
        'ZIP code'
      );
      expect(validateRegisterForm({ ...validData, postalCode: '12345' }).postalCode).toBeUndefined();
      expect(
        validateRegisterForm({ ...validData, postalCode: '12345-6789' }).postalCode
      ).toBeUndefined();
    });

    it('rejects missing registration role', () => {
      expect(
        validateRegisterForm({ ...validData, registrationRole: '' }).registrationRole
      ).toContain('Select an account role');
    });

    it('rejects weak password', () => {
      expect(validateRegisterForm({ ...validData, password: 'short' }).password).toContain(
        '12+ chars'
      );
      expect(
        validateRegisterForm({ ...validData, password: 'nouppercase1!' }).password
      ).toBeDefined();
      expect(
        validateRegisterForm({ ...validData, password: 'NOLOWERCASE1!' }).password
      ).toBeDefined();
      expect(
        validateRegisterForm({ ...validData, password: 'NoNumber!' }).password
      ).toBeDefined();
      expect(
        validateRegisterForm({ ...validData, password: 'NoSymbol123' }).password
      ).toBeDefined();
    });

    it('rejects when confirm password does not match', () => {
      expect(
        validateRegisterForm({
          ...validData,
          password: 'SecurePass1!',
          confirmPassword: 'OtherPass1!',
        }).confirmPassword
      ).toContain('do not match');
    });
  });

  describe('STATE_OPTIONS', () => {
    it('includes expected US state/territory codes', () => {
      const codes = STATE_OPTIONS.map((o) => o.code);
      expect(codes).toContain('CA');
      expect(codes).toContain('NY');
      expect(codes).toContain('IL');
      expect(codes).toContain('DC');
      expect(codes).toContain('PR');
      expect(codes.length).toBeGreaterThan(50);
    });
  });

  describe('INITIAL_REGISTER_DATA', () => {
    it('has all required fields as empty strings except state', () => {
      expect(INITIAL_REGISTER_DATA.firstName).toBe('');
      expect(INITIAL_REGISTER_DATA.registrationRole).toBe('');
    });
  });
});
