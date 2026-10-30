import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { SUPPORTED_DOCUMENTS_INFO } from '../data/mockData';
import { DocumentCategory, DocumentType } from '../types';

interface SupportedDocsViewProps {
  onSelectDocTypeForVerification: (category: DocumentCategory, docType: DocumentType) => void;
}

export const SupportedDocsView: React.FC<SupportedDocsViewProps> = ({
  onSelectDocTypeForVerification
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'government' | 'educational'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const govGroup = SUPPORTED_DOCUMENTS_INFO.find(g => g.category.includes('Government'));
  const eduGroup = SUPPORTED_DOCUMENTS_INFO.find(g => g.category.includes('Educational'));

  const filterDocs = (docs: any[] | undefined) => {
    if (!docs) return [];
    if (!searchQuery) return docs;
    return docs.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.compliance.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-900 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-700" />
              <span>10 Standard Indian Document Schemas</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Supported Document Specifications</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              DocShield AI is trained on statutory design templates, holographic security features, and checksum schemas across central & state authorities.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search document type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'all' ? 'bg-blue-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All 10 Documents
          </button>
          <button
            onClick={() => setActiveTab('government')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'government' ? 'bg-blue-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Government (5)</span>
          </button>
          <button
            onClick={() => setActiveTab('educational')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'educational' ? 'bg-cyan-800 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Educational (5)</span>
          </button>
        </div>
      </div>

      {/* 1. Government Section */}
      {(activeTab === 'all' || activeTab === 'government') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Government & Citizen Identity Credentials</h2>
              <p className="text-xs text-slate-500">Citizen IDs, revenue proofs, and welfare eligibility documents</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filterDocs(govGroup?.items).map((doc, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-900 border border-blue-200">
                      Government ID
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-700 font-semibold">
                      <Clock className="h-3 w-3" />
                      <span>{doc.turnaround}</span>
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-base font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Authority: {doc.issuingAuthority}</p>

                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Forensic Inspection Checklist:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {doc.checks.map((check: string, cIdx: number) => (
                        <li key={cIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
                    {doc.compliance}
                  </span>
                  <button
                    onClick={() => onSelectDocTypeForVerification('government', doc.name as DocumentType)}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-800 hover:text-cyan-900"
                  >
                    <span>Test This Doc</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Educational Section */}
      {(activeTab === 'all' || activeTab === 'educational') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-900">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Educational & Academic Credentials</h2>
              <p className="text-xs text-slate-500">Board marksheets, university degree certificates, and school records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filterDocs(eduGroup?.items).map((doc, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-cyan-400 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-900 border border-cyan-200">
                      Academic Credential
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-700 font-semibold">
                      <Clock className="h-3 w-3" />
                      <span>{doc.turnaround}</span>
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-base font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Authority: {doc.issuingAuthority}</p>

                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Forensic Inspection Checklist:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {doc.checks.map((check: string, cIdx: number) => (
                        <li key={cIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
                    {doc.compliance}
                  </span>
                  <button
                    onClick={() => onSelectDocTypeForVerification('educational', doc.name as DocumentType)}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-800 hover:text-cyan-900"
                  >
                    <span>Test This Doc</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
