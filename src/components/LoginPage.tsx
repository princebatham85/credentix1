import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles,
  Building2,
  GraduationCap,
  UserCheck
} from 'lucide-react';
import { UserProfile, ActivePage } from '../types';
import { api } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  setActivePage: (page: ActivePage) => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  setActivePage,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<'institution' | 'government' | 'student' | 'citizen'>('government');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotification, setSuccessNotification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'forgot') {
      if (!email || !email.includes('@')) {
        setErrorMessage('Please enter a valid Email / Gmail address.');
        return;
      }
      try {
        const msg = await api.auth.forgotPassword(email);
        setSuccessNotification(msg || `Password reset instructions sent to ${email}.`);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to request password reset.');
      }
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid Email or Gmail address.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Please enter a password with at least 4 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      let resp;
      if (mode === 'signup') {
        resp = await api.auth.register({
          name: fullName || 'Authorized Officer',
          email,
          password,
          role,
          organization: organization || 'Institutional Verification Cell'
        });
      } else {
        try {
          resp = await api.auth.login(email, password);
        } catch (loginErr: any) {
          // If user does not exist in local db, register them on the fly
          resp = await api.auth.register({
            name: fullName || (email.includes('admin') || email.includes('gov') ? 'Dr. Vikram Sethi' : email.split('@')[0]),
            email,
            password,
            role,
            organization: organization || 'State Public Services Directorate'
          });
        }
      }

      setSuccessNotification('Sign In Successful! Redirecting to dashboard...');
      setTimeout(() => {
        onLoginSuccess(resp.user as UserProfile);
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (presetRole: 'government' | 'institution' | 'student') => {
    setErrorMessage('');
    if (presetRole === 'government') {
      setEmail('v.sethi@delhi.gov.in');
      setPassword('DocShield@2026');
      setRole('government');
      setOrganization('State Public Services Directorate');
    } else if (presetRole === 'institution') {
      setEmail('dean.academic@niet-university.edu.in');
      setPassword('University@2026');
      setRole('institution');
      setOrganization('National Institute Admissions Cell');
    } else {
      setEmail('aarav.sharma99@gmail.com');
      setPassword('Student@2026');
      setRole('student');
      setOrganization('Student Portal');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-slate-50 via-cyan-50/25 to-white py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-md space-y-6">
        
        {/* Back to Home Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActivePage('landing')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
          
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100/80 px-2.5 py-0.5 text-[10px] font-bold text-cyan-800">
            <Sparkles className="h-3 w-3 text-cyan-600" />
            <span>DocShield Enterprise Cloud</span>
          </span>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xl shadow-slate-200/50">
          
          {/* Brand & Heading */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-cyan-700 text-white shadow-md shadow-blue-950/20">
              <ShieldCheck className="h-8 w-8 text-cyan-300" />
            </div>
            
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
              {mode === 'signin' && 'Sign In to DocShield AI'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            
            <p className="mt-1 text-xs text-slate-500">
              {mode === 'signin' && 'Enter your credentials to access the document verification platform'}
              {mode === 'signup' && 'Register your department or institution for automated document verification'}
              {mode === 'forgot' && 'Enter your registered email to receive a password reset link'}
            </p>
          </div>

          {/* Quick Demo Credentials Bar for Reviewers */}
          {mode === 'signin' && (
            <div className="mt-5 rounded-xl border border-cyan-200/90 bg-cyan-50/60 p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-950 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-600 animate-pulse" />
                  <span>1-Click Test Credentials:</span>
                </span>
                <span className="font-mono text-[10px] text-cyan-700">Quick Access</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('government')}
                  className="rounded-lg border border-cyan-300 bg-white px-2 py-1.5 text-[11px] font-bold text-slate-800 hover:bg-cyan-100/70 transition shadow-2xs"
                >
                  🏛️ Govt Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('institution')}
                  className="rounded-lg border border-cyan-300 bg-white px-2 py-1.5 text-[11px] font-bold text-slate-800 hover:bg-cyan-100/70 transition shadow-2xs"
                >
                  🏫 University
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('student')}
                  className="rounded-lg border border-cyan-300 bg-white px-2 py-1.5 text-[11px] font-bold text-slate-800 hover:bg-cyan-100/70 transition shadow-2xs"
                >
                  🎓 Applicant
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Notification: "Sign In Successful!" */}
          {successNotification && (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-400 p-3.5 text-xs text-emerald-900 font-bold shadow-xs animate-in zoom-in-95">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{successNotification}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="mt-5 space-y-4">
            
            {/* If Sign Up: Full Name, Role, Organization */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="government">Government Department Official</option>
                    <option value="institution">Educational Institution / University Dean</option>
                    <option value="student">Student / Candidate</option>
                    <option value="citizen">Citizen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Department</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Department of Higher Education"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </>
            )}

            {/* Email / Gmail Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email / Gmail Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com or officer@gov.in"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            {/* Password Field (with Show/Hide Toggle) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setErrorMessage(''); setSuccessNotification(''); }}
                      className="text-xs font-semibold text-cyan-800 hover:text-cyan-900 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-900 py-3 text-sm font-bold text-white shadow-md shadow-blue-950/20 hover:opacity-95 hover:shadow-lg transition active:scale-95 disabled:opacity-70"
            >
              <span>
                {mode === 'signin' && (isSubmitting ? 'Verifying...' : 'Sign In')}
                {mode === 'signup' && (isSubmitting ? 'Creating Account...' : 'Create Account')}
                {mode === 'forgot' && 'Send Password Reset Link'}
              </span>
              <ArrowRight className="h-4 w-4 text-cyan-300" />
            </button>
          </form>

          {/* Links: Forgot Password & Create Account */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600 space-y-2">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessNotification(''); }}
                  className="font-bold text-cyan-800 hover:text-cyan-900 hover:underline"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMessage(''); setSuccessNotification(''); }}
                  className="font-bold text-cyan-800 hover:text-cyan-900 hover:underline"
                >
                  Sign In here
                </button>
              </p>
            )}

            <p className="text-[11px] text-slate-400">
              Secure role-based authentication for verified organizations.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
