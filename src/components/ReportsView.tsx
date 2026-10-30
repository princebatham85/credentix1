import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Award,
  QrCode,
  ArrowLeft,
  Building2,
  Calendar,
  Layers,
  Copy,
  Check,
  Share2
} from 'lucide-react';
import { VerificationResult } from '../types';
import { getStatusColor } from '../utils/verificationEngine';

interface ReportsViewProps {
  verifications: VerificationResult[];
  selectedReport: VerificationResult | null;
  onSelectReport: (doc: VerificationResult | null) => void;
  onVerifyNew: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  verifications,
  selectedReport,
  onSelectReport,
  onVerifyNew
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const activeDoc = selectedReport || verifications[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!activeDoc) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeDoc, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DocShield_Audit_Report_${activeDoc.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const colors = activeDoc ? getStatusColor(activeDoc.status) : null;

  return (
    <div className="space-y-6">
      
      {/* Top Selector / Controls (Hidden in Print) */}
      <div className="no-print rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Official Forensic Audit Report</h1>
            <p className="text-xs text-slate-500">Cryptographically verifiable certificate of inspection</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Report Switcher */}
            <select
              value={activeDoc?.id}
              onChange={(e) => {
                const found = verifications.find(v => v.id === e.target.value);
                if (found) onSelectReport(found);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              {verifications.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.documentType} – {v.status} ({v.id})
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 rounded-xl bg-blue-950 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-900"
            >
              <Download className="h-4 w-4 text-cyan-300" />
              <span>Download JSON Audit</span>
            </button>
          </div>
        </div>
      </div>

      {activeDoc ? (
        /* Printable Audit Certificate Document */
        <div className="mx-auto max-w-4xl rounded-2xl border-2 border-slate-300 bg-white p-8 sm:p-12 shadow-lg relative print:shadow-none print:border-none print:p-0">
          
          {/* Watermark in background */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
            <ShieldCheck className="h-96 w-96 text-slate-900" />
          </div>

          {/* Certificate Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-950 text-cyan-300 shadow-md">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">DocShield AI</h2>
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-cyan-300 uppercase">
                    Forensic Engine
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  Intelligent Document Verification & Regulatory Compliance Authority
                </p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Standard Electronic Records Specification • Section 4 IT Act 2000
                </p>
              </div>
            </div>

            {/* QR Stamp */}
            <div className="text-right">
              <div className="inline-flex flex-col items-center p-2 rounded-xl border border-slate-200 bg-slate-50">
                <QrCode className="h-12 w-12 text-slate-800" />
                <span className="text-[9px] font-mono text-slate-500 mt-1">SCAN TO AUDIT</span>
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="my-6 text-center">
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
              Official Electronic Verification Certificate
            </span>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              AUDIT CERTIFICATE FOR: {activeDoc.documentType.toUpperCase()}
            </h3>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-xs">
              <span className="text-slate-500">Report ID:</span>
              <span className="font-mono font-bold text-slate-900">{activeDoc.id}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Date:</span>
              <span className="font-mono font-bold text-slate-900">{activeDoc.uploadDate}</span>
            </div>
          </div>

          {/* Status Verdict Banner */}
          <div className={`rounded-xl border-2 p-5 text-center my-6 ${
            activeDoc.status === 'Verified' ? 'bg-emerald-50 border-emerald-400 text-emerald-950' :
            activeDoc.status === 'Suspicious' ? 'bg-amber-50 border-amber-400 text-amber-950' :
            activeDoc.status === 'Failed' ? 'bg-rose-50 border-rose-400 text-rose-950' : 'bg-sky-50 border-sky-400 text-sky-950'
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider block">Verification Verdict</span>
            <span className="text-2xl font-black tracking-tight mt-0.5 inline-block">
              {activeDoc.status.toUpperCase()} (CONFIDENCE: {activeDoc.confidenceScore}%)
            </span>
            <p className="text-xs mt-1 max-w-xl mx-auto opacity-90">
              {activeDoc.status === 'Verified' && 'The document has passed all optical, algorithmic, cryptographic, and regulatory checks without discrepancy.'}
              {activeDoc.status === 'Suspicious' && 'The document exhibits localized pixel recompression anomalies and/or glyph baseline shifts. Physical verification mandated.'}
              {activeDoc.status === 'Failed' && 'Critical forgery indicators identified. Registry checksum failure and non-compliant security features detected.'}
              {activeDoc.status === 'Manual Review Required' && 'Machine readability degraded due to scan glare or physical crease. Requires secondary human officer sign-off.'}
            </p>
          </div>

          {/* Section 1: Document & Extraction Matrix */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
              1. Document Metadata & Extracted Identity Parameters
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Original File Name:</span>
                <span className="font-bold text-slate-900 font-mono">{activeDoc.documentName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Classification Domain:</span>
                <span className="font-bold text-slate-900 capitalize">{activeDoc.category} Credential</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Tesseract OCR Extraction Fidelity:</span>
                <span className="font-bold text-emerald-800 font-mono">{activeDoc.ocrConfidence || 95}% Mean Confidence</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Reference Database Match:</span>
                <span className={`font-bold font-mono ${
                  activeDoc.referenceComparison.status === 'Matched' ? 'text-emerald-700' :
                  activeDoc.referenceComparison.status === 'Partial Match' ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {activeDoc.referenceComparison.status} ({activeDoc.referenceComparison.matchScore}%)
                </span>
              </div>
            </div>

            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 text-left">Parsed Entity Field</th>
                  <th className="p-2.5 text-left">Extracted Value</th>
                  <th className="p-2.5 text-right">Extraction Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(activeDoc.extractedData).map(([key, val]) => (
                  <tr key={key}>
                    <td className="p-2.5 font-medium text-slate-600">{key}</td>
                    <td className="p-2.5 font-bold font-mono text-slate-900">{val}</td>
                    <td className="p-2.5 text-right text-emerald-700 font-semibold">Verified OCR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Forensic Matrix */}
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
              2. Forensic Inspection & Tampering Matrix
            </h4>

            <div className="space-y-2 text-xs">
              {activeDoc.tamperingIndicators.map((t, idx) => (
                <div key={idx} className="flex items-start justify-between p-2.5 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-bold text-slate-800">{t.name}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">{t.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    t.detected ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {t.detected ? 'ANOMALY DETECTED' : 'PASSED (CLEAN)'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Statutory Compliance */}
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
              3. Statutory & Standards Compliance Audit
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {activeDoc.complianceChecklist.map((c, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1 font-bold text-slate-900">
                    {c.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
                    <span>{c.passed ? 'Compliant' : 'Non-Compliant'}</span>
                  </div>
                  <p className="font-medium text-slate-800 text-[11px]">{c.rule}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{c.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SHA-256 Hash Block */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-900 text-cyan-300 p-4 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>CRYPTOGRAPHIC IMMUTABLE HASH (SHA-256)</span>
              <span>VERIFIED ON-CHAIN READY</span>
            </div>
            <p className="break-all font-bold text-white">{activeDoc.hashSha256}</p>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="mt-10 pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900">DocShield AI Automated Verification Engine</p>
              <p className="text-[11px] text-slate-500">System Signature: PKI-DIGI-DOCSHIELD-2026-X81</p>
              <p className="text-[10px] text-slate-400 mt-1">Generated in simulated demonstration sandbox.</p>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 pb-1 font-serif italic text-slate-800 text-sm">
                Dr. Vikram Sethi
              </div>
              <p className="font-bold text-slate-900 text-xs mt-1">Chief Verification Officer</p>
              <p className="text-[10px] text-slate-400">Public Services & Institutional Cell</p>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          No document selected. Please pick a record from the dropdown or verify a new document.
        </div>
      )}

    </div>
  );
};
