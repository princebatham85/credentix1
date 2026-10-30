import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Mail, 
  ShieldCheck, 
  Sliders, 
  Bell, 
  Lock, 
  CheckCircle2, 
  Save, 
  RefreshCw,
  Cpu,
  Key
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onUpdateUser
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [organization, setOrganization] = useState(currentUser.organization);
  const [role, setRole] = useState(currentUser.role);
  
  // Engine thresholds
  const [strictnessLevel, setStrictnessLevel] = useState<number>(85);
  const [autoRejectSuspicious, setAutoRejectSuspicious] = useState<boolean>(false);
  const [notifyOnTamper, setNotifyOnTamper] = useState<boolean>(true);
  const [enableVerhoeffChecksum, setEnableVerhoeffChecksum] = useState<boolean>(true);
  const [enable2FA, setEnable2FA] = useState<boolean>(true);

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      email,
      organization,
      role
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      
      {/* Title */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900">Platform Settings & Engine Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize your inspector profile, verification strictness tolerance, and alert preferences.
        </p>

        {savedMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Preferences saved successfully to local browser session.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Profile Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="h-5 w-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">Officer Profile Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Department</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="institution">Educational Institution Verifier</option>
                <option value="government">Government Department Official</option>
                <option value="student">Student / Applicant</option>
                <option value="citizen">Citizen</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. AI Engine Strictness & Verification Parameters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="h-5 w-5 text-cyan-700" />
            <h2 className="text-base font-bold text-slate-900">AI Forensic Engine Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1.5">
                <span>Tamper Sensitivity Threshold (ELA Quantization)</span>
                <span className="font-mono text-cyan-800 font-bold">{strictnessLevel}% Strict</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={strictnessLevel}
                onChange={(e) => setStrictnessLevel(Number(e.target.value))}
                className="w-full accent-cyan-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Higher sensitivity catches minor scan compression noise; recommended benchmark: 85%.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100/70">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Enforce Algorithmic Checksums</span>
                  <span className="text-[11px] text-slate-500">Run Verhoeff math on Aadhaar & alphanumeric regex syntax on PAN.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableVerhoeffChecksum}
                  onChange={(e) => setEnableVerhoeffChecksum(e.target.checked)}
                  className="h-4 w-4 rounded text-cyan-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100/70">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Automatic Rejection of Forgeries</span>
                  <span className="text-[11px] text-slate-500">Auto-reject documents with composite confidence score &lt; 40%.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoRejectSuspicious}
                  onChange={(e) => setAutoRejectSuspicious(e.target.checked)}
                  className="h-4 w-4 rounded text-cyan-600"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 3. Security & Notifications */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="h-5 w-5 text-indigo-700" />
            <h2 className="text-base font-bold text-slate-900">Security & Alerts</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100/70">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Real-time Fraud Email Notifications</span>
                <span className="text-[11px] text-slate-500">Receive alert when suspicious document tampering is flagged.</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnTamper}
                onChange={(e) => setNotifyOnTamper(e.target.checked)}
                className="h-4 w-4 rounded text-cyan-600"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100/70">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-slate-500">Require OTP simulation for officer approvals on manual review docs.</span>
              </div>
              <input
                type="checkbox"
                checked={enable2FA}
                onChange={(e) => setEnable2FA(e.target.checked)}
                className="h-4 w-4 rounded text-cyan-600"
              />
            </label>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-950 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-900 transition"
          >
            <Save className="h-4 w-4 text-cyan-300" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>

    </div>
  );
};
