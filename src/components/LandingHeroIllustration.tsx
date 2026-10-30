import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Cpu, QrCode, FileText, Search, Sparkles } from 'lucide-react';

export const LandingHeroIllustration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verified' | 'tampered'>('verified');

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Background Decorative Glow */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600/15 via-cyan-500/20 to-teal-400/10 blur-2xl transition duration-1000" />

      {/* Main Document Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-blue-950/10">
        
        {/* Top Window Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/70 bg-slate-900 px-4 py-2.5 text-white">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 font-mono text-xs text-slate-300">docshield-ai // deep-scan-engine.v2</span>
          </div>

          {/* Toggle Interactive View */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-800 p-0.5 text-[11px] font-medium">
            <button
              onClick={() => setActiveTab('verified')}
              className={`rounded-md px-2 py-0.5 transition ${activeTab === 'verified' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Pass Scan
            </button>
            <button
              onClick={() => setActiveTab('tampered')}
              className={`rounded-md px-2 py-0.5 transition ${activeTab === 'tampered' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Tamper Scan
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-b from-slate-50/60 to-white">
          
          {/* Animated Laser Scanning Beam */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] animate-scan z-20" />

          {/* Document Header Mockup */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white shadow-inner">
                <FileText className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {activeTab === 'verified' ? 'e-Aadhaar Digital Identity Card' : 'Income Tax Department PAN Card'}
                  </h4>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
                    {activeTab === 'verified' ? 'GOV-IND-01' : 'GOV-PAN-02'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Government of India Standard Security Template</p>
              </div>
            </div>

            {/* Status Badge */}
            {activeTab === 'verified' ? (
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Verified 99.2%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 shadow-xs animate-pulse">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Tampering Flagged</span>
              </div>
            )}
          </div>

          {/* Document Fields Grid with Bounding Boxes */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            
            {/* Field 1 */}
            <div className="relative rounded-lg border border-cyan-300/80 bg-cyan-50/40 p-2.5 transition">
              <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-900">
                <span>OCR: Full Name</span>
                <span className="rounded bg-white/80 px-1 font-mono text-[9px] text-cyan-800">Conf: 99.8%</span>
              </div>
              <p className="mt-1 font-mono text-xs font-bold text-slate-900">
                {activeTab === 'verified' ? 'RAJESH KUMAR SHARMA' : 'AMIT RAMESH VERMA'}
              </p>
              <div className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-600 text-white text-[8px] font-bold">✓</div>
            </div>

            {/* Field 2 - Dynamic depending on tab */}
            {activeTab === 'verified' ? (
              <div className="relative rounded-lg border border-emerald-300/80 bg-emerald-50/40 p-2.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-900">
                  <span>Identifier Syntax</span>
                  <span className="rounded bg-white/80 px-1 font-mono text-[9px] text-emerald-800">Verhoeff: Valid</span>
                </div>
                <p className="mt-1 font-mono text-xs font-bold text-slate-900">XXXX-XXXX-4891</p>
                <div className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-white text-[8px] font-bold">✓</div>
              </div>
            ) : (
              <div className="relative rounded-lg border-2 border-rose-500 bg-rose-50/70 p-2.5 shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-bold text-rose-800">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-rose-600" />
                    ELA Anomaly Detected
                  </span>
                  <span className="rounded bg-rose-600 px-1 font-mono text-[9px] text-white">Pixel Variance 74%</span>
                </div>
                <p className="mt-1 font-mono text-xs font-extrabold text-rose-950 line-through">
                  05/11/1995 <span className="text-[10px] text-rose-700 font-sans font-normal">(Font cloned)</span>
                </p>
                <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-black animate-bounce">!</div>
              </div>
            )}

            {/* Field 3 */}
            <div className="relative rounded-lg border border-slate-200 bg-white p-2.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Security Watermark</span>
                <span className="font-mono text-[9px] text-slate-400">Micro-contour</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyan-600" />
                <span>Ashoka Pillar Emblem Intact</span>
              </p>
            </div>

            {/* Field 4 */}
            <div className="relative rounded-lg border border-slate-200 bg-white p-2.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>QR Payload Cryptography</span>
                <span className="font-mono text-[9px] text-slate-400">SHA-256</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-slate-700" />
                <span>{activeTab === 'verified' ? '2048-bit Signature Valid' : 'Checksum Unmatched'}</span>
              </p>
            </div>
          </div>

          {/* AI Inspection Live Telemetry Bar */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-900 p-3 text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-xs font-mono font-medium text-slate-200">Neural Verification Stream</span>
              </div>
              <span className="font-mono text-[11px] text-cyan-400">Latency: 2.1s</span>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-slate-800/80 p-1.5">
                <p className="text-[10px] text-slate-400">Noise Uniformity</p>
                <p className="font-mono text-xs font-bold text-white">
                  {activeTab === 'verified' ? '98.9%' : '42.1% (Split)'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800/80 p-1.5">
                <p className="text-[10px] text-slate-400">Font Glyph Match</p>
                <p className="font-mono text-xs font-bold text-white">
                  {activeTab === 'verified' ? '100% Exact' : 'Mismatch'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-800/80 p-1.5">
                <p className="text-[10px] text-slate-400">Regulatory Check</p>
                <p className="font-mono text-xs font-bold text-emerald-400">
                  {activeTab === 'verified' ? 'UIDAI 2024' : 'CBDT Sec 139A'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Highlights */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 bg-slate-50/90 px-4 py-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-cyan-600" />
            <span>Anti-Fraud Cross-Inspection</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
            <span>HASH: 7f83...d906</span>
            <span className="text-emerald-600 font-semibold">• Zero-PII Stored</span>
          </div>
        </div>

      </div>

      {/* Floating Badges */}
      <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl transition-transform hover:-translate-y-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-800">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-slate-900">Instant Verification</p>
          <p className="text-[10px] text-slate-500">&lt; 3.2s Average Response</p>
        </div>
      </div>

      <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl transition-transform hover:-translate-y-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-slate-900">10+ Templates</p>
          <p className="text-[10px] text-slate-500">Govt & Educational</p>
        </div>
      </div>

    </div>
  );
};
