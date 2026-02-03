import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface AuthScreenProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (email: string, password: string) => void;
}

export function AuthScreen({ onLogin, onSignUp }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      onSignUp(email, password);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F7FAF9' }}>
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#0F766E' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L8 9V16C8 22 16 28 16 28C16 28 24 22 24 16V9L16 4Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M12 16L14.5 18.5L20 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <ellipse cx="16" cy="16" rx="3" ry="5" fill="white" opacity="0.9"/>
              <rect x="14" y="14" width="4" height="8" rx="2" fill="#0F766E"/>
            </svg>
          </div>
          <h1 className="mb-2" style={{ fontSize: '28px' }}>Welcome to MediTrack</h1>
          <p style={{ color: '#475569', textAlign: 'center', lineHeight: '1.6' }}>
            {mode === 'login' 
              ? 'Sign in to access your medication data'
              : 'Create an account to track medications'}
          </p>
        </div>

        {/* Auth Form */}
        <div 
          className="rounded-[18px] p-8"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0px 8px 24px rgba(2, 6, 23, 0.08)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#475569' }} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 pl-10"
                  style={{ backgroundColor: 'white' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#475569' }} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Minimum 8 characters' : 'Enter your password'}
                  className="h-11 pl-10 pr-10"
                  style={{ backgroundColor: 'white' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" style={{ color: '#475569' }} />
                  ) : (
                    <Eye className="w-5 h-5" style={{ color: '#475569' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#475569' }} />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="h-11 pl-10"
                    style={{ backgroundColor: 'white' }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: '#FEE2E2', border: '1px solid #9F4A54' }}
              >
                <p style={{ fontSize: '14px', color: '#9F4A54' }}>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11"
              style={{ backgroundColor: '#0F766E' }}
            >
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </Button>

            {/* Forgot Password (Login only) */}
            {mode === 'login' && (
              <button
                type="button"
                className="w-full text-center"
                style={{ color: '#0F766E', fontSize: '14px' }}
              >
                Forgot password?
              </button>
            )}
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: '#E6EAF0' }}>
            <p style={{ color: '#475569', fontSize: '14px' }}>
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              {' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                  setConfirmPassword('');
                }}
                style={{ color: '#0F766E', fontWeight: 600 }}
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>

          {/* Security Message */}
          <div 
            className="mt-6 p-4 rounded-lg flex items-start gap-3"
            style={{ backgroundColor: '#F7FAF9' }}
          >
            <Shield className="w-5 h-5 flex-shrink-0" style={{ color: '#4D7C6F' }} />
            <div>
              <p style={{ fontSize: '12px', color: '#0F172A', fontWeight: 600, marginBottom: '4px' }}>
                Your data is private and encrypted
              </p>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                Securely stored and only accessible by you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}