import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Modal } from '../components/ui/Modal';
import { Logo } from '../components/ui/Logo';
import { ArrowLeft, Send, X } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/login', { state: { resetSent: true } });
      }, 2000);
    }
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
        <div className="text-center mb-6 w-full flex justify-center">
          <Logo size="lg" className="opacity-50" />
        </div>

        <div className="bg-[var(--bg-surface)] rounded-xl border-2 border-[var(--border)] p-6 shadow-lg">
          <h1 className="text-center mb-2">Reset your password</h1>
          <p className="text-center text-[var(--text-secondary)] mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <Button
            variant="secondary"
            onClick={() => setShowModal(true)}
            className="w-full"
          >
            Reset Password
          </Button>

          <div className="mt-6 text-center">
            <Button
              variant="secondary"
              onClick={() => navigate('/login')}
              icon={<ArrowLeft size={20} />}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !sent && setShowModal(false)}
        title="Reset your password"
      >
        <p className="text-[var(--text-secondary)] mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {sent && (
            <Alert type="info" className="mb-4">
              Reset link sent! Check your email for instructions.
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={sent}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!email || sent}
              icon={<Send size={20} />}
              className="flex-1"
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};