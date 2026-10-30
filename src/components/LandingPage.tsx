import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Upload, 
  Cpu, 
  FileCheck2, 
  AlertTriangle, 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ExternalLink,
  Layers,
  GraduationCap,
  Building2,
  Lock,
  Search,
  Zap,
  BarChart3,
  Award
} from 'lucide-react';
import { LandingHeroIllustration } from './LandingHeroIllustration';
import { FAQS } from '../data/mockData';
import { ActivePage } from '../types';

interface LandingPageProps {
  onStartVerification: () => void;
  onExploreFeatures: () => void;
  setActivePage: (page: ActivePage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartVerification,
  onExploreFeatures,
  setActivePage
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [docCategoryTab, setDocCategoryTab] = useState<'government' | 'educational'>('government');

  const stats = [
    { label: 'Tamper Detection Accuracy', value: '99.4%', detail: 'Validated across forensic Error Level Analysis (ELA) benchmarks' },
    { label: 'Standard Document Schemas', value: '10+', detail: '5 Government IDs & 5 Academic Certifications' },
    { label: 'Average Verification Latency', value: '< 3.2s', detail: 'Rapid multi-step parallel optical & heuristic checks' },
    { label: 'Privacy & Data Protection', value: '100%', detail: 'Strict zero-leak architecture with automatic PII redaction' },
  ];

  const features = [
    {
      icon: <Scan className="h-6 w-6 text-cyan-600" />,
      title: 'AI-Driven Tamper & ELA Detection',
      description: 'Scans image quantization and compression artifacts to detect photoshopped dates, names, marks, and copy-pasted seals.'
    },
    {
      icon: <Cpu className="h-6 w-6 text-blue-600" />,
      title: 'Field Consistency & OCR Cross-Check',
      description: 'Extracts critical identity fields and verifies algorithmic rules like Verhoeff checksums and chronological timeline validation.'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      title: 'Digital Watermark & Stamp Integrity',
      description: 'Evaluates institutional emblems, holographic micro-lines, and state insignia against verified structural schemas.'
    },
    {
      icon: <Layers className="h-6 w-6 text-indigo-600" />,
      title: 'Automated Compliance Engine',
      description: 'Audits certificates against NEP 2020 Academic Bank of Credits, IT Act 2000, and DigiLocker XML formatting standards.'
    },
    {
      icon: <Lock className="h-6 w-6 text-teal-600" />,
      title: 'Zero-PII Storage by Design',
      description: 'All inspection and verification simulation run directly inside your browser session. No raw identities or biometrics leaked.'
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-amber-600" />,
      title: 'Comprehensive Audit Trail & Reports',
      description: 'Generates professional cryptographic inspection certificates with SHA-256 fingerprinting for admissions & recruitment.'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      
      {/* 1. Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-cyan-50/20 to-white py-16 sm:py-24">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f01f_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f01f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="text-center lg:col-span-7 lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/80 bg-cyan-50/90 px-3.5 py-1.5 text-xs font-semibold text-cyan-900 shadow-xs mb-6">
                <Sparkles className="h-4 w-4 text-cyan-600 animate-pulse" />
                <span>AI-Powered Document Verification & Compliance Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Verify Documents.{' '}
                <span className="bg-gradient-to-r from-blue-900 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
                  Build Trust.
                </span>
              </h1>

              {/* Subheading */}
              <p className="mt-5 text-lg font-normal leading-relaxed text-slate-600 sm:text-xl max-w-2xl">
                AI-powered document authentication and compliance verification made simple, secure and reliable.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Engineered for students, citizens, educational institutions, and government departments to combat counterfeit certificates with instant forensic analysis.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  onClick={onStartVerification}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-900 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:opacity-95 hover:shadow-xl active:scale-95"
                >
                  <FileCheck2 className="h-5 w-5 text-cyan-300" />
                  <span>Start Verification</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={onExploreFeatures}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                >
                  <span>Explore Features</span>
                  <Zap className="h-4 w-4 text-amber-500" />
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Aadhaar & PAN Analysis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Degree & Marksheet Validation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Instant Downloadable Report</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Illustration */}
            <div className="lg:col-span-5">
              <LandingHeroIllustration />
            </div>

          </div>
        </div>
      </section>

      {/* 2. How DocShield AI Works (3 Simple Steps) */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Seamless Verification Pipeline</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How DocShield AI Works
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Three intelligent stages that transform raw, unverified paperwork into cryptographically audited credentials in seconds.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-7 transition hover:shadow-lg hover:border-cyan-300">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-white font-bold text-lg shadow-md">
                  1
                </div>
                <Upload className="h-6 w-6 text-blue-900" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">Upload & Classify</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Choose the document category (Government or Educational) and upload a PDF, JPG, or PNG. Drag-and-drop or select standard verification presets.
              </p>
              <div className="mt-4 rounded-lg bg-white p-2.5 text-xs font-mono text-slate-500 border border-slate-200">
                ✓ Auto-skew correction & DPI check
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-7 transition hover:shadow-lg hover:border-cyan-300">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-700 text-white font-bold text-lg shadow-md">
                  2
                </div>
                <Cpu className="h-6 w-6 text-cyan-700" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">AI Deep Inspection</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Parallel heuristic engines execute Error Level Analysis (ELA) for image splicing, font glyph consistency, Verhoeff mathematical checksums, and seal verification.
              </p>
              <div className="mt-4 rounded-lg bg-white p-2.5 text-xs font-mono text-slate-500 border border-slate-200">
                ✓ Pixel tampering & ELA scanning
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-7 transition hover:shadow-lg hover:border-cyan-300">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold text-lg shadow-md">
                  3
                </div>
                <FileCheck2 className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">Verdict & Audit Report</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Receive an immediate Trust Score, flagged issue coordinates, compliance checks against NEP 2020 / IT Act, and download an official verification certificate.
              </p>
              <div className="mt-4 rounded-lg bg-white p-2.5 text-xs font-mono text-slate-500 border border-slate-200">
                ✓ SHA-256 cryptographic report export
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onStartVerification}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 transition"
            >
              <span>Test the 3-Step Flow Now</span>
              <ArrowRight className="h-4 w-4 text-cyan-400" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. Key Features Section */}
      <section id="features" className="py-20 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Next-Generation Verification</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Uncompromising Accuracy
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Standard OCR is not enough. DocShield AI combines cryptographic checks, visual forensics, and regulatory rulebooks.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-slate-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-cyan-50">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Supported Documents Interactive Showcase */}
      <section id="supported-docs" className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Template Taxonomy</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Supported Document Types
              </h2>
              <p className="mt-2 text-slate-600">
                Comprehensive coverage for citizen identity verification, academic enrollment, and scholarship governance.
              </p>
            </div>

            {/* Category Toggle Tabs */}
            <div className="mt-6 flex items-center rounded-xl bg-slate-100 p-1.5 md:mt-0">
              <button
                onClick={() => setDocCategoryTab('government')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${docCategoryTab === 'government' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Building2 className="h-4 w-4 text-blue-900" />
                <span>Government (5)</span>
              </button>
              <button
                onClick={() => setDocCategoryTab('educational')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${docCategoryTab === 'educational' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <GraduationCap className="h-4 w-4 text-cyan-700" />
                <span>Educational (5)</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {docCategoryTab === 'government' ? (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">National ID</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 2.8s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">Aadhaar Card</h4>
                  <p className="mt-1 text-xs text-slate-500">UIDAI masked e-Aadhaar & printed cards</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ 12-digit Verhoeff Checksum</li>
                    <li className="flex items-center gap-1.5">✓ 8-digit PII Masking Audit</li>
                    <li className="flex items-center gap-1.5">✓ 2048-bit QR Payload Verification</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">Tax ID</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 2.4s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">PAN Card</h4>
                  <p className="mt-1 text-xs text-slate-500">Income Tax Dept / NSDL / UTIITSL</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ 10-char Alphanumeric Rule Engine</li>
                    <li className="flex items-center gap-1.5">✓ DOB & Father's Name ELA Inspection</li>
                    <li className="flex items-center gap-1.5">✓ Hologram & Guilloche Wave Test</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">Revenue Dept</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 3.1s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">Income Certificate</h4>
                  <p className="mt-1 text-xs text-slate-500">State Tehsildar & SDM Offices</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ Financial Year Validity Check</li>
                    <li className="flex items-center gap-1.5">✓ State e-District Digital Barcode</li>
                    <li className="flex items-center gap-1.5">✓ Magistrate Stamp & Officer Hash</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">Social Welfare</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 3.0s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">Caste Certificate</h4>
                  <p className="mt-1 text-xs text-slate-500">Central / State SC/ST/OBC/EWS</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ Non-Creamy Layer Validity Term</li>
                    <li className="flex items-center gap-1.5">✓ Central Gazette Schedule Matching</li>
                    <li className="flex items-center gap-1.5">✓ Government Watermark & Seal Audit</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">Citizenship</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 2.6s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">Domicile Certificate</h4>
                  <p className="mt-1 text-xs text-slate-500">State Residency Credentials</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ Continuous Residency Term Check</li>
                    <li className="flex items-center gap-1.5">✓ Tehsil Jurisdiction & Token Alignment</li>
                    <li className="flex items-center gap-1.5">✓ Photo & Wet Stamp Edge Continuity</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-cyan-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-900">Secondary / Higher</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 2.5s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">Marksheet (Class X & XII)</h4>
                  <p className="mt-1 text-xs text-slate-500">CBSE, ICSE, NIOS & State Boards</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ Subject Marks vs Aggregate Sum Math</li>
                    <li className="flex items-center gap-1.5">✓ Theory & Practical Breakdown Logic</li>
                    <li className="flex items-center gap-1.5">✓ Board Holographic Grid Authentication</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-cyan-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-900">Higher Education</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 3.4s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">Degree Certificate</h4>
                  <p className="mt-1 text-xs text-slate-500">UGC & AICTE Recognized Universities</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ Academic Depository (NAD) Token</li>
                    <li className="flex items-center gap-1.5">✓ Vice Chancellor Signature Geometry</li>
                    <li className="flex items-center gap-1.5">✓ Degree Duration vs Batch Timeline</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-cyan-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-900">Technical Education</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 2.9s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">Diploma Certificate</h4>
                  <p className="mt-1 text-xs text-slate-500">Polytechnic & Vocational Institutes</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ AICTE Institution Code Lookup</li>
                    <li className="flex items-center gap-1.5">✓ Branch Specialization & Credits</li>
                    <li className="flex items-center gap-1.5">✓ Anti-Scan Ghost Pattern Inspection</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-cyan-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-900">School Records</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 2.2s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">School Leaving Certificate</h4>
                  <p className="mt-1 text-xs text-slate-500">Transfer Certificate (TC / SLC)</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ General Register (GR) Serial Audit</li>
                    <li className="flex items-center gap-1.5">✓ Principal Wet Seal & Signature Shape</li>
                    <li className="flex items-center gap-1.5">✓ Date of Admission vs Leaving Bounds</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-cyan-400 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-900">Migration & Bonafide</span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">&lt; 2.7s</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-900">University Certificate</h4>
                  <p className="mt-1 text-xs text-slate-500">Registrar Migration & Character</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">✓ Dual-Enrollment Prevention Flag</li>
                    <li className="flex items-center gap-1.5">✓ Security Embossment Verification</li>
                    <li className="flex items-center gap-1.5">✓ Registrar Digital Public Key Cross-Check</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setActivePage('supported-docs')}
              className="text-sm font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1.5"
            >
              <span>View Full Document Specifications & Regulatory Standards</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. Why Choose DocShield AI? */}
      <section id="about" className="py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Institutional Trust Infrastructure</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Why Choose DocShield AI?
              </h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Counterfeit degrees, fabricated income proofs, and forged caste certificates deprive deserving candidates of government scholarships, university seats, and employment.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Eliminate Manual Backlogs</h4>
                    <p className="text-sm text-slate-300 mt-1">
                      Cut document scrutiny times from 15 days to under 4 seconds during large-scale admission and exam counseling cycles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Pixel-Level Forensic Detection</h4>
                    <p className="text-sm text-slate-300 mt-1">
                      Human eyes cannot see subtle JPEG recompression boundaries or 0.5pt font weight cloning. Our Error Level Analysis spots digital tampering instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Enterprise-Grade Scalable Architecture</h4>
                    <p className="text-sm text-slate-300 mt-1">
                      Designed to integrate with DigiLocker, Academic Bank of Credits (ABC), State e-District portals, and institutional ERPs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={onStartVerification}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
                >
                  Get Started with DocShield AI
                </button>
              </div>
            </div>

            {/* Right Comparison Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                <span>Traditional Verification vs. DocShield AI</span>
                <span className="rounded bg-cyan-900/60 px-2 py-0.5 text-xs text-cyan-300 font-mono">Benchmark</span>
              </h3>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/60">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Average Verification Time</span>
                    <span className="text-emerald-400 font-bold">99.7% Faster</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-rose-400 font-medium">Manual: 7-14 Days</span>
                    <span className="text-cyan-300 font-bold">DocShield: &lt; 3.2 Seconds</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/60">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Digital Splicing / Font Tampering Detection</span>
                    <span className="text-emerald-400 font-bold">AI Advantage</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-rose-400 font-medium">Manual: 18% Catch Rate</span>
                    <span className="text-cyan-300 font-bold">DocShield: 99.4% Catch Rate</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/60">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Cost per Document Scrutiny</span>
                    <span className="text-emerald-400 font-bold">90% Reduction</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-rose-400 font-medium">Manual: ₹80 - ₹250</span>
                    <span className="text-cyan-300 font-bold">DocShield: Scalable Automated</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/60">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Audit Trail Compliance</span>
                    <span className="text-emerald-400 font-bold">SHA-256</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-rose-400 font-medium">Manual: Paper Register</span>
                    <span className="text-cyan-300 font-bold">DocShield: Cryptographic PDF Cert</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Statistics Section with clearly marked illustrative demo figures */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <span className="rounded-full bg-slate-200/80 px-3 py-1 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              System Performance Metrics
            </span>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Audited Performance & Accuracy Benchmarks
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
              Audited performance across forensic test suites, document tampering datasets, and high-throughput enterprise processing pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs">
                <p className="text-4xl font-extrabold text-blue-950 font-mono tracking-tight">{s.value}</p>
                <p className="mt-2 text-sm font-bold text-slate-800">{s.label}</p>
                <p className="mt-1 text-xs text-slate-500">{s.detail}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      <section id="faq" className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Got Questions?</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Everything you need to know about DocShield AI, verification methodology, and privacy safeguards.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-slate-200 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-slate-900 hover:bg-slate-50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-cyan-600' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-5 text-sm leading-relaxed text-slate-700">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 py-16 text-white text-center">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 text-xs font-semibold text-cyan-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ready for Instant Testing</span>
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Experience Intelligent Document Verification
          </h2>
          <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Upload your document or test one of our pre-built synthetic templates to inspect tampering detection in action.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={onStartVerification}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-8 py-3.5 text-base font-bold text-slate-950 shadow-lg transition hover:opacity-95"
            >
              Start Free Verification
            </button>
            <button
              onClick={() => setActivePage('dashboard')}
              className="rounded-xl border border-slate-600 bg-slate-800/80 px-6 py-3.5 text-base font-semibold text-white hover:bg-slate-700 transition"
            >
              Open Officer Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* 9. Professional Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            
            {/* Col 1 */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 text-white">
                  <ShieldCheck className="h-5 w-5 text-cyan-300" />
                </div>
                <span className="font-bold text-slate-900 text-lg">DocShield AI</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Intelligent Document Verification & Compliance Platform. Built to restore trust in educational and government documentation.
              </p>
              <div className="text-[11px] font-mono text-slate-400">
                Enterprise Cloud Edition • v2.4
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-700">Home</button></li>
                <li><button onClick={() => { const el = document.getElementById('how-it-works'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-cyan-700">How It Works</button></li>
                <li><button onClick={() => { const el = document.getElementById('features'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-cyan-700">Key Features</button></li>
                <li><button onClick={() => setActivePage('supported-docs')} className="hover:text-cyan-700">Supported Documents</button></li>
                <li><button onClick={() => setActivePage('history')} className="hover:text-cyan-700">Audit History</button></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Document Modules</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li><span className="text-slate-500">Aadhaar E-KYC Verification</span></li>
                <li><span className="text-slate-500">PAN Card Integrity Engine</span></li>
                <li><span className="text-slate-500">Marksheet Aggregate Cross-Check</span></li>
                <li><span className="text-slate-500">Degree Depository (NAD) Token</span></li>
                <li><span className="text-slate-500">Income & Caste e-District Check</span></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Compliance & Regulatory Notice</h4>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                DocShield AI provides automated forensic document inspection, optical layer parsing, and statutory compliance checks. Verification against live external registries is subject to authorized organization credentials and API entitlements.
              </p>
              <p className="mt-2 text-xs text-slate-400">
                © {new Date().getFullYear()} DocShield AI. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
};
