import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Mail, 
  Send, 
  CheckCircle2, 
  FileCheck2, 
  BookOpen, 
  AlertTriangle, 
  MessageSquare,
  ShieldCheck,
  Server
} from 'lucide-react';
import { FAQS } from '../data/mockData';

export const HelpView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('algorithm');
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
    }, 500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900">Help & Support Center</h1>
        <p className="text-xs text-slate-500 mt-1">
          Everything you need to master document verification, understand forensic scores, and troubleshoot image issues.
        </p>
      </div>

      {/* Quick Guide Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-900 mb-3">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">1. Verifying Documents</h3>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Select category, upload a high-contrast scan or PDF (minimum 300 DPI recommended), and run AI verification.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-900 mb-3">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">2. Interpreting Verdicts</h3>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Scores &gt; 90% = Verified. 50-89% = Suspicious / Manual Review. &lt; 50% = Critical Forgery / Tampered.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 mb-3">
            <Server className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">3. System Status</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Heuristic Engines Operational</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Client Sandbox Latency: ~12ms</p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="h-5 w-5 text-cyan-700" />
          <h2 className="text-base font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left text-xs font-bold text-slate-900 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-700' : ''}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <MessageSquare className="h-5 w-5 text-blue-900" />
          <h2 className="text-base font-bold text-slate-900">Contact Forensic Support & Technical Services</h2>
        </div>

        {ticketSent ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center text-xs text-emerald-900">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
            <h4 className="font-bold text-sm">Support Ticket Registered!</h4>
            <p className="mt-1 text-slate-600">
              Ticket ID: <span className="font-mono font-bold">#DOC-TICKET-{Math.floor(1000 + Math.random() * 9000)}</span>. Our forensic team responds within 2 hours.
            </p>
            <button
              onClick={() => setTicketSent(false)}
              className="mt-3 rounded-lg bg-emerald-700 text-white font-bold px-4 py-1.5"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none"
                >
                  <option value="algorithm">Tamper Detection / ELA Anomaly Query</option>
                  <option value="template">Request New Document Template Support</option>
                  <option value="institution">Institutional Campus Deployment Inquiry</option>
                  <option value="api">DigiLocker & API Integration Setup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Query regarding Aadhaar QR checksum validation"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your question or provide document error details..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-blue-950 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-900 transition"
              >
                <Send className="h-4 w-4 text-cyan-300" />
                <span>Submit Support Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
