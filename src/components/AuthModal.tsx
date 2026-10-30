import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AuthMode, UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<'student' | 'citizen' | 'institution' | 'government'>('institution');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'forgot') {
      if (!email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      setSuccessMessage('Password reset link sent to ' + email + ' (Demo simulation).');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Success simulation
    const user: UserProfile = {
      name: mode === 'signup' && fullName ? fullName : 'Dr. Vikram Sethi',
      email: email || 'v.sethi@delhi.gov.in',
      role: role,
      organization: organization || 'Delhi State Admissions & Verification Directorate',
      accountType: role === 'government' ? 'Enterprise Verifier' : role === 'institution' ? 'Institutional Portal' : 'Citizen Portal'
    };

    onLoginSuccess(user);
    onClose();
  };

  const handleQuickDemoLogin = (selectedRole: 'institution' | 'government' | 'student') => {
    const presets = {
      institution: {
        name: 'Prof. Arvind Deshmukh',
        email: 'dean.academic@niet-university.edu.in',
        role: 'institution' as const,
        organization: 'National Institute of Engineering Admissions Cell',
        accountType: 'Institutional Portal' as const
      },
      government: {
        name: 'Dr. Vikram Sethi',
        email: 'v.sethi@revenue-dept.gov.in',
        role: 'government' as const,
        organization: 'State Public Services & e-District Directorate',
        accountType: 'Enterprise Verifier' as const
      },
      student: {
        name: 'Aarav Dev Sharma',
        email: 'aarav.sharma99@gmail.com',
        role: 'student' as const,
        organization: 'Candidate / Citizen Portal',
        accountType: 'Citizen Portal' as const
      }
    };

    const user = presets[selectedRole];
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 text-white">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">DocShield AI</span>
              <span className="text-[10px] text-slate-500 block leading-none">Access Portal</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="text-center mb-5">
            <h3 className="text-xl font-bold text-slate-900">
              {mode === 'signin' && 'Sign In to DocShield AI'}
              {mode === 'signup' && 'Create Your Verifier Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {mode === 'signin' && 'Access document verification, audit history, and reports.'}
              {mode === 'signup' && 'Register your institution or department for instant verification.'}
              {mode === 'forgot' && 'Enter your registered email to receive a password reset link.'}
            </p>
          </div>

          {/* Quick Demo Login Preset Buttons for easy reviewing */}
          {mode === 'signin' && (
            <div className="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/50 p-3">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-900 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
                  Quick Access Test Accounts:
                </span>
                <span className="font-mono text-[10px] text-cyan-700">Enterprise Roles</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('institution')}
                  className="rounded-lg bg-white border border-cyan-300 px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-cyan-100/50 transition text-left"
                >
                  🏫 University Dean
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('government')}
                  className="rounded-lg bg-white border border-cyan-300 px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-cyan-100/50 transition text-left"
                >
                  🏛️ Govt Officer
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Ramesh Gupta"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">User Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="institution">Educational Institution / University</option>
                    <option value="government">Government Department / Verifier</option>
                    <option value="student">Student / Applicant</option>
                    <option value="citizen">Citizen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Department</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Delhi Technological University"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.gov.in"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setErrorMessage(''); }}
                      className="text-xs text-cyan-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-900 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-95 transition"
            >
              <span>
                {mode === 'signin' && 'Sign In to Dashboard'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Navigation between Auth Modes */}
          <div className="mt-5 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
                  className="font-bold text-cyan-700 hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => { setMode('signin'); setErrorMessage(''); setSuccessMessage(''); }}
                  className="font-bold text-cyan-700 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          <div className="mt-3 text-center">
            <span className="text-[10px] text-slate-400">
              Secure role-based access control for verified organizations.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
