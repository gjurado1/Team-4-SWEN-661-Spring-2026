import { useMemo, useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, MapPin, Home } from 'lucide-react';
import { UserRole } from '../contexts/UserContext';
import {
  REGISTRATION_STORAGE_KEY,
  STATE_OPTIONS,
  INITIAL_REGISTER_DATA,
  sanitizeEmailInput,
  sanitizeTextInput,
  removeControlCharacters,
  formatPhoneNumber,
  validateRegisterForm,
  type RegisterFormData,
  type RegisterField,
  type StoredRegistration,
} from '../lib/registration';

interface LoginScreenProps {
  onBack: () => void;
  onLogin: (allowedRoles: UserRole[]) => void;
}

type AuthMode = 'sign-in' | 'register';

export function LoginScreen({ onBack, onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerData, setRegisterData] = useState<RegisterFormData>(INITIAL_REGISTER_DATA);
  const [registerErrors, setRegisterErrors] = useState<Partial<Record<RegisterField, string>>>({});
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState('');

  const registerFieldStyle = useMemo(
    () => ({
      backgroundColor: 'var(--input-bg)',
      border: '2px solid var(--input-border)',
      color: 'var(--input-text)',
      fontSize: 'var(--font-size-body)',
      transition: 'var(--transition-fast)',
    }),
    []
  );

  const getAllowedRolesForEmail = (emailAddress: string): UserRole[] => {
    const normalized = sanitizeEmailInput(emailAddress);
    try {
      const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY);
      if (!raw) return ['caregiver', 'patient'];
      const users = JSON.parse(raw) as Record<string, StoredRegistration>;
      const match = users[normalized];
      if (!match || !Array.isArray(match.allowedRoles) || match.allowedRoles.length === 0) {
        return ['caregiver', 'patient'];
      }
      return match.allowedRoles.filter((role): role is UserRole => role === 'caregiver' || role === 'patient');
    } catch {
      return ['caregiver', 'patient'];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(getAllowedRolesForEmail(email));
  };

  const handleRegisterChange = (field: RegisterField, value: string) => {
    setRegisterSuccessMessage('');
    setRegisterErrors((prev) => ({ ...prev, [field]: undefined }));

    setRegisterData((prev) => {
      if (field === 'phone') {
        return { ...prev, phone: formatPhoneNumber(value) };
      }
      if (field === 'email') {
        return { ...prev, email: sanitizeEmailInput(value).slice(0, 254) };
      }
      if (field === 'postalCode') {
        const next = removeControlCharacters(value).toUpperCase();
        return { ...prev, postalCode: next.slice(0, 10) };
      }
      if (field === 'registrationRole') {
        const nextRole = value === 'caregiver' || value === 'patient' || value === 'both' ? value : '';
        return { ...prev, registrationRole: nextRole };
      }
      if (field === 'password' || field === 'confirmPassword') {
        return { ...prev, [field]: removeControlCharacters(value).slice(0, 128) };
      }
      return { ...prev, [field]: sanitizeTextInput(value).slice(0, 100) };
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedData: RegisterFormData = {
      ...registerData,
      firstName: registerData.firstName.trim(),
      lastName: registerData.lastName.trim(),
      address1: registerData.address1.trim(),
      city: registerData.city.trim(),
      postalCode: registerData.postalCode.trim(),
    };

    const validationErrors = validateRegisterForm(normalizedData);
    setRegisterErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const allowedRoles: UserRole[] =
      normalizedData.registrationRole === 'both'
        ? ['caregiver', 'patient']
        : [normalizedData.registrationRole as UserRole];

    const record: StoredRegistration = {
      firstName: normalizedData.firstName,
      lastName: normalizedData.lastName,
      email: normalizedData.email,
      allowedRoles,
    };

    try {
      const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY);
      const users = raw ? (JSON.parse(raw) as Record<string, StoredRegistration>) : {};
      users[normalizedData.email] = record;
      localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(users));
    } catch {
      // Keep flow resilient if localStorage fails; user can still sign in as default roles.
    }

    setEmail(normalizedData.email);
    setPassword('');
    setRegisterData(INITIAL_REGISTER_DATA);
    setRegisterSuccessMessage('Registration details accepted. Sign in with your credentials.');
    setMode('sign-in');
  };

  const fieldErrorText = (field: RegisterField) =>
    registerErrors[field] ? (
      <p
        style={{
          marginTop: 'var(--space-2)',
          color: 'var(--color-error)',
          fontSize: 'var(--font-size-small)',
        }}
      >
        {registerErrors[field]}
      </p>
    ) : null;

  return (
    <div 
      className="w-full flex items-center justify-center px-[32px]"
      style={{
        marginTop: mode === 'register' ? '12px' : '-50px',
      }}
    >
      <div 
        className="max-w-md w-full rounded-lg shadow-xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-modal)',
          padding: 'var(--space-7)',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => {
            if (mode === 'register') {
              setMode('sign-in');
              setRegisterErrors({});
              return;
            }
            onBack();
          }}
          className="mb-6 inline-flex items-center gap-2 transition-colors outline-none"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-body)',
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = `var(--focus-ring-width) solid var(--focus-ring-color)`;
            e.currentTarget.style.outlineOffset = 'var(--focus-ring-offset)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
          aria-label="Go back to welcome screen"
        >
          <ArrowLeft size={16} />
          <span>{mode === 'register' ? 'Back to Sign In' : 'Back'}</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 
            className="mb-2"
            style={{
              fontSize: 'var(--font-size-section)',
              fontWeight: '600',
              color: 'var(--color-text)',
            }}
          >
            {mode === 'register' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p 
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-muted)',
            }}
          >
            {mode === 'register'
              ? 'Complete your profile to request secure account access'
              : 'Sign in to access your care dashboard'}
          </p>
        </div>

        {mode === 'sign-in' && (
          <>
            {registerSuccessMessage && (
              <div
                className="mb-5 rounded-md"
                style={{
                  backgroundColor: 'var(--color-panel)',
                  border: '1px solid var(--color-success)',
                  color: 'var(--color-text)',
                  padding: 'var(--space-3)',
                  fontSize: 'var(--font-size-body)',
                }}
              >
                {registerSuccessMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-5">
            <label 
              htmlFor="email"
              className="block mb-2"
              style={{
                fontSize: 'var(--font-size-label)',
                fontWeight: '500',
                color: 'var(--color-text)',
              }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-muted)' }}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: '2px solid var(--input-border)',
                  color: 'var(--input-text)',
                  fontSize: 'var(--font-size-body)',
                  transition: 'var(--transition-fast)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--input-border-focus)';
                  e.currentTarget.style.outline = `var(--focus-ring-width) solid var(--focus-ring-color)`;
                  e.currentTarget.style.outlineOffset = 'var(--focus-ring-offset)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--input-border)';
                  e.currentTarget.style.outline = 'none';
                }}
                required
                aria-required="true"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label 
              htmlFor="password"
              className="block mb-2"
              style={{
                fontSize: 'var(--font-size-label)',
                fontWeight: '500',
                color: 'var(--color-text)',
              }}
            >
              Password
            </label>
            <div className="relative">
              <Lock 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-muted)' }}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-2.5 rounded outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: '2px solid var(--input-border)',
                  color: 'var(--input-text)',
                  fontSize: 'var(--font-size-body)',
                  transition: 'var(--transition-fast)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--input-border-focus)';
                  e.currentTarget.style.outline = `var(--focus-ring-width) solid var(--focus-ring-color)`;
                  e.currentTarget.style.outlineOffset = 'var(--focus-ring-offset)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--input-border)';
                  e.currentTarget.style.outline = 'none';
                }}
                required
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors outline-none"
                style={{
                  color: 'var(--color-text-muted)',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = `var(--focus-ring-width) solid var(--focus-ring-color)`;
                  e.currentTarget.style.outlineOffset = 'var(--focus-ring-offset)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="mb-6 text-right">
            <button
              type="button"
              className="transition-colors outline-none"
              style={{
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-focus)',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = `var(--focus-ring-width) solid var(--focus-ring-color)`;
                e.currentTarget.style.outlineOffset = 'var(--focus-ring-offset)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg transition-all outline-none"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-fg)',
              fontSize: 'var(--font-size-body)',
              fontWeight: '500',
              transition: 'var(--transition-medium)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--btn-primary-hover-bg)';
              e.currentTarget.style.color = 'var(--btn-primary-hover-fg)';
              e.currentTarget.style.boxShadow = 'var(--shadow-panel)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--btn-primary-bg)';
              e.currentTarget.style.color = 'var(--btn-primary-fg)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `var(--focus-ring-width) solid var(--focus-ring-color)`;
              e.currentTarget.style.outlineOffset = 'var(--focus-ring-offset)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            Sign In
          </button>
            </form>

            {/* Footer Help Text */}
            <div
              className="mt-6 text-center"
              style={{
                fontSize: 'var(--font-size-small)',
                color: 'var(--color-text-muted)',
              }}
            >
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="transition-colors outline-none"
                style={{
                  color: 'var(--color-focus)',
                  transition: 'var(--transition-fast)',
                }}
                onClick={() => {
                  setRegisterSuccessMessage('');
                  setMode('register');
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = `var(--focus-ring-width) solid var(--focus-ring-color)`;
                  e.currentTarget.style.outlineOffset = 'var(--focus-ring-offset)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                Register
              </button>
            </div>
          </>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-2"
                  style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
                >
                  First Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                  <input
                    id="firstName"
                    autoComplete="given-name"
                    maxLength={50}
                    value={registerData.firstName}
                    onChange={(e) => handleRegisterChange('firstName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded outline-none"
                    style={registerFieldStyle}
                    required
                  />
                </div>
                {fieldErrorText('firstName')}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-2"
                  style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
                >
                  Last Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                  <input
                    id="lastName"
                    autoComplete="family-name"
                    maxLength={50}
                    value={registerData.lastName}
                    onChange={(e) => handleRegisterChange('lastName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded outline-none"
                    style={registerFieldStyle}
                    required
                  />
                </div>
                {fieldErrorText('lastName')}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="registerEmail"
                className="block mb-2"
                style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  id="registerEmail"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={registerData.email}
                  onChange={(e) => handleRegisterChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded outline-none"
                  style={registerFieldStyle}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              {fieldErrorText('email')}
            </div>

            <div className="mt-4">
              <label
                htmlFor="registerPhone"
                className="block mb-2"
                style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  id="registerPhone"
                  type="tel"
                  autoComplete="tel-national"
                  inputMode="tel"
                  value={registerData.phone}
                  onChange={(e) => handleRegisterChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded outline-none"
                  style={registerFieldStyle}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              {fieldErrorText('phone')}
            </div>

            <div className="mt-4">
              <label
                htmlFor="address1"
                className="block mb-2"
                style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
              >
                Street Address
              </label>
              <div className="relative">
                <Home size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  id="address1"
                  autoComplete="address-line1"
                  maxLength={100}
                  value={registerData.address1}
                  onChange={(e) => handleRegisterChange('address1', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded outline-none"
                  style={registerFieldStyle}
                  required
                />
              </div>
              {fieldErrorText('address1')}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block mb-2"
                  style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
                >
                  City
                </label>
                <input
                  id="city"
                  autoComplete="address-level2"
                  maxLength={50}
                  value={registerData.city}
                  onChange={(e) => handleRegisterChange('city', e.target.value)}
                  className="w-full px-3 py-2.5 rounded outline-none"
                  style={registerFieldStyle}
                  required
                />
                {fieldErrorText('city')}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block mb-2"
                  style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
                >
                  State / Territory
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
                  <select
                    id="state"
                    autoComplete="address-level1"
                    value={registerData.state}
                    onChange={(e) => handleRegisterChange('state', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded outline-none appearance-none"
                    style={registerFieldStyle}
                    required
                  >
                    <option value="">Select...</option>
                    {STATE_OPTIONS.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrorText('state')}
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block mb-2"
                  style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
                >
                  ZIP Code
                </label>
                <input
                  id="postalCode"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={10}
                  value={registerData.postalCode}
                  onChange={(e) => handleRegisterChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2.5 rounded outline-none"
                  style={registerFieldStyle}
                  placeholder="12345"
                  required
                />
                {fieldErrorText('postalCode')}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="registrationRole"
                className="block mb-2"
                style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
              >
                Register As
              </label>
              <select
                id="registrationRole"
                value={registerData.registrationRole}
                onChange={(e) => handleRegisterChange('registrationRole', e.target.value)}
                className="w-full px-3 py-2.5 rounded outline-none appearance-none"
                style={registerFieldStyle}
                required
              >
                <option value="">Select role access...</option>
                <option value="caregiver">Caregiver Only</option>
                <option value="patient">Patient Only</option>
                <option value="both">Both Caregiver and Patient</option>
              </select>
              {fieldErrorText('registrationRole')}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="registerPassword"
                  className="block mb-2"
                  style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                  <input
                    id="registerPassword"
                    type={showRegisterPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    maxLength={128}
                    value={registerData.password}
                    onChange={(e) => handleRegisterChange('password', e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 rounded outline-none"
                    style={registerFieldStyle}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded outline-none"
                    style={{ color: 'var(--color-text-muted)' }}
                    aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrorText('password')}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2"
                  style={{ fontSize: 'var(--font-size-label)', fontWeight: '500', color: 'var(--color-text)' }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                  <input
                    id="confirmPassword"
                    type={showRegisterConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    maxLength={128}
                    value={registerData.confirmPassword}
                    onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 rounded outline-none"
                    style={registerFieldStyle}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded outline-none"
                    style={{ color: 'var(--color-text-muted)' }}
                    aria-label={showRegisterConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrorText('confirmPassword')}
              </div>
            </div>

            <p
              className="mt-4"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-small)',
              }}
            >
              Use a unique password and never share credentials. Registration requests are validated before approval.
            </p>

            <button
              type="submit"
              className="w-full mt-6 py-3 rounded-lg transition-all outline-none"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-fg)',
                fontSize: 'var(--font-size-body)',
                fontWeight: '500',
                transition: 'var(--transition-medium)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              Submit Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
