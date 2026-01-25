import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Logo } from '../components/ui/Logo';
import { ArrowRight, Settings } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    // Demo login logic
    if (username.toLowerCase().includes('caregiver') || username === 'demo') {
      navigate('/caregiver/dashboard');
    } else if (username.toLowerCase().includes('patient')) {
      navigate('/patient/dashboard');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  const handleDemoLogin = (role: 'caregiver' | 'patient') => {
    if (role === 'caregiver') {
      navigate('/caregiver/dashboard');
    } else {
      navigate('/patient/dashboard');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center bg-[var(--bg-primary)]"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 50px)',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom))'
      }}
    >
      <div className="w-full max-w-md">{/* removed px-4 since safe area padding is now in parent */}

        {/* Logo and Header */}
        <div className="text-center mb-6 fade-in w-full flex justify-center">
          <Logo size="lg" showTagline={true} />
        </div>

        {/* Login Form */}
        <div className="bg-[var(--bg-surface)] rounded-xl border-2 border-[var(--border)] p-6 shadow-lg fade-in">
          <h1 className="text-center mb-2">Sign in to your account</h1>
          <p className="text-center text-[var(--text-secondary)] mb-6">
            Enter your credentials to access CareConnect
          </p>

          <form onSubmit={handleLogin}>
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
              autoComplete="current-password"
            />

            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[var(--button-primary)] hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <Alert type="error" className="mb-4">
                {error}
              </Alert>
            )}

            {showResetConfirm && (
              <Alert type="info" className="mb-4">
                Password reset link sent! A password reset link has been sent to test@test.com. 
                Please check your inbox and follow the instructions.
              </Alert>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mb-4"
              icon={<ArrowRight size={20} />}
            >
              Sign In
            </Button>
          </form>

          <div className="text-center">
            <p className="text-[var(--text-secondary)] mb-2">Don't have an account?</p>
            <Button
              variant="secondary"
              onClick={() => navigate('/register')}
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Demo Mode */}
        <div className="mt-6 bg-[var(--bg-surface)] rounded-xl border-2 border-[var(--border)] p-6">
          <h3 className="text-center mb-2 font-semibold">Demo Credentials</h3>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-4">
            Use these credentials to explore CareConnect
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => handleDemoLogin('patient')}
              className="w-full p-4 bg-[var(--bg-primary)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--button-primary)] transition-colors text-left"
            >
              <div className="font-semibold text-[var(--text-primary)]">👤 Patient Account</div>
              <div className="text-sm text-[var(--text-secondary)] mt-1">
                Username: testpatient
              </div>
            </button>
            
            <button
              onClick={() => handleDemoLogin('caregiver')}
              className="w-full p-4 bg-[var(--bg-primary)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--button-primary)] transition-colors text-left"
            >
              <div className="font-semibold text-[var(--text-primary)]">👨‍⚕️ Caregiver Account</div>
              <div className="text-sm text-[var(--text-secondary)] mt-1">
                Username: demo
              </div>
            </button>
          </div>
        </div>

        {/* Quick Access Settings */}
        <div className="mt-6 text-center">
          <Button
            variant="secondary"
            onClick={() => navigate('/settings')}
            icon={<Settings size={20} />}
          >
            Accessibility Settings
          </Button>
        </div>
      </div>
    </div>
  );
};