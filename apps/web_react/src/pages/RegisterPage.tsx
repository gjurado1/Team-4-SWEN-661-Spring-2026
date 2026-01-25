import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Input } from '../components/ui/Input';
import { ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

type Step = 'role' | 'personal' | 'contact' | 'preferences' | 'review';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<'caregiver' | 'patient' | ''>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const steps: Step[] = ['role', 'personal', 'contact', 'preferences', 'review'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    } else {
      // Complete registration
      navigate('/login');
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    } else {
      navigate('/login');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center bg-[var(--bg-primary)]"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 50px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-6 w-full flex flex-col items-center">
          <Logo size="lg" showTagline={true} />
          <h1 className="mt-4">Create Your CareConnect Account</h1>
        </div>

        <div className="bg-[var(--bg-surface)] rounded-xl border-2 border-[var(--border)] p-6 shadow-lg">
          <ProgressBar 
            progress={Math.round(progress)} 
            label={`Step ${currentStepIndex + 1} of ${steps.length}`}
            className="mb-6"
          />

          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <div className="space-y-4 fade-in">
              <div className="flex items-center gap-2 text-[var(--button-primary)] mb-4">
                <UserCheck size={24} />
                <h2>Account Role</h2>
              </div>
              
              <h3>Who is this account for?</h3>
              <p className="text-[var(--text-secondary)]">
                Choose the role that best describes your relationship to healthcare management
              </p>

              <div className="space-y-3 mt-6">
                <Card
                  onClick={() => setRole('caregiver')}
                  className={`cursor-pointer p-6 ${
                    role === 'caregiver' 
                      ? 'border-[var(--button-primary)] ring-4 ring-[var(--button-primary)]/20' 
                      : ''
                  }`}
                >
                  <h3 className="mb-2">👨‍⚕️ Caregiver</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    I provide care and monitor health for patients
                  </p>
                </Card>

                <Card
                  onClick={() => setRole('patient')}
                  className={`cursor-pointer p-6 ${
                    role === 'patient' 
                      ? 'border-[var(--button-primary)] ring-4 ring-[var(--button-primary)]/20' 
                      : ''
                  }`}
                >
                  <h3 className="mb-2">👤 Care Recipient (Patient)</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    I receive care and track my own health
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 'personal' && (
            <div className="space-y-4 fade-in">
              <h2 className="mb-4">Personal Information</h2>
              
              <Input
                label="First Name *"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                required
              />

              <Input
                label="Last Name *"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                required
              />

              <Input
                label="Date of Birth *"
                type="date"
                placeholder="mm / dd / yyyy"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                required
              />
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 'contact' && (
            <div className="space-y-4 fade-in">
              <h2 className="mb-4">Contact Information</h2>
              
              <Input
                label="Phone Number *"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                required
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />

              <Input
                label="Street Address *"
                type="text"
                placeholder="123 Main Street"
                value={formData.streetAddress}
                onChange={(e) => updateFormData('streetAddress', e.target.value)}
                required
              />

              <Input
                label="City *"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                required
              />
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 'preferences' && (
            <div className="space-y-4 fade-in">
              <h2 className="mb-4">Account Setup Complete!</h2>
              <p className="text-[var(--text-secondary)]">
                You can customize your accessibility preferences after creating your account.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            <Button
              variant="secondary"
              onClick={handleBack}
              icon={<ArrowLeft size={20} />}
              className="flex-1"
            >
              {currentStepIndex === 0 ? 'Back to Login' : 'Back'}
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={step === 'role' && !role}
              icon={<ArrowRight size={20} />}
              className="flex-1"
            >
              {currentStepIndex === steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>

          {/* Demo Mode Notice */}
          <div className="mt-6 p-4 bg-[var(--alert-info-bg)] border-2 border-[var(--alert-info-border)] rounded-lg">
            <p className="text-sm text-center font-medium">Demo Mode</p>
            <p className="text-xs text-center text-[var(--text-secondary)] mt-1">
              This is a demonstration of CareConnect's interface. No real data is stored or transmitted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};