import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  FileText,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { VerificationResult, UserProfile, ActivePage, VerificationStatus } from '../types';
import { DEMO_PRESETS } from '../data/mockData';
import { getStatusColor } from '../utils/verificationEngine';
import { SystemStatus } from './SystemStatus';

interface DashboardViewProps {
  verifications: VerificationResult[];
  currentUser: UserProfile;
  setActivePage: (page: ActivePage) => void;
  onSelectReport: (doc: VerificationResult) => void;
  onLaunchPreset: (presetId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  verifications,
  currentUser,
  setActivePage,
  onSelectReport,
  onLaunchPreset
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Compute live metrics
  const totalChecked = verifications.length;
  const verifiedCount = verifications.filter(v => v.status === 'Verified').length;
  const suspiciousCount = verifications.filter(v => v.status === 'Suspicious' || v.status === 'Failed').length;
  const pendingCount = verifications.filter(v => v.status === 'Manual Review Required').length;

  const filteredDocs = verifications.filter(v => {
    const matchesSearch = 
      v.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* 0. Dashboard Header Bar with System Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 sm:px-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-1.5 rounded-full bg-cyan-600 hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Dashboard</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-semibold text-cyan-800">Verification Console</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Operational Overview
            </h1>
          </div>
        </div>

        {/* Real-time System Status Indicator Component */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SystemStatus />
        </div>
      </div>

      {/* 1. Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-400/30">
                {currentUser.accountType}
              </span>
              <span className="text-xs text-slate-300 font-mono">ID: SEC-REG-2026</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Welcome, {currentUser.name}
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              {currentUser.organization} • Ready for intelligent AI document authentication and compliance inspection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActivePage('verify')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow hover:opacity-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Verify New Document</span>
            </button>
            <button
              onClick={() => setActivePage('supported-docs')}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              Document Guide
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Documents */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Checked</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 font-mono">{totalChecked}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Active verification records loaded</span>
          </div>
        </div>

        {/* Verified Documents */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Clear</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-emerald-700 font-mono">{verifiedCount}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Pass rate: {totalChecked ? Math.round((verifiedCount / totalChecked) * 100) : 0}%</span>
          </div>
        </div>

        {/* Suspicious / Failed Documents */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Suspicious / Failed</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-rose-700 font-mono">{suspiciousCount}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Tamper & Forgery detections</span>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Reviews</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-800">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-sky-800 font-mono">{pendingCount}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Requires Tier-2 human visual sign-off</span>
          </div>
        </div>

      </div>

      {/* 3. Quick Test Presets Panel */}
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Sample Document Verification Presets</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Select a standard document test template to inspect verification accuracy</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_PRESETS.slice(0, 3).map((preset) => (
            <div
              key={preset.id}
              onClick={() => onLaunchPreset(preset.id)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-cyan-400 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${preset.badgeColor}`}>
                  {preset.status}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Score: {preset.expectedScore}%</span>
              </div>
              <h4 className="mt-1.5 text-xs font-bold text-slate-900 truncate">{preset.title}</h4>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recent Verification Activity Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="border-b border-slate-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Verification Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time log of examined government and educational credentials</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, name or doc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Failed">Failed</option>
              <option value="Manual Review Required">Manual Review</option>
            </select>

            <button
              onClick={() => setActivePage('verify')}
              className="flex items-center gap-1.5 rounded-xl bg-blue-950 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-900 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Verify New</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Doc ID & Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Upload Timestamp</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => {
                  const colors = getStatusColor(doc.status);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                      
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[220px]">{doc.documentName}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{doc.id} • {doc.documentType}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 capitalize">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                          doc.category === 'government' ? 'bg-blue-50 text-blue-800' : 'bg-cyan-50 text-cyan-800'
                        }`}>
                          {doc.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {doc.uploadDate}
                      </td>

                      {/* Confidence Score */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{doc.confidenceScore}%</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                doc.status === 'Verified' ? 'bg-emerald-500' :
                                doc.status === 'Suspicious' ? 'bg-amber-500' :
                                doc.status === 'Failed' ? 'bg-rose-500' : 'bg-sky-500'
                              }`}
                              style={{ width: `${doc.confidenceScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${colors.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                          <span>{doc.status}</span>
                        </span>
                      </td>

                      {/* View Report Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectReport(doc)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-cyan-400 hover:text-cyan-800 transition shadow-2xs"
                        >
                          <span>View Report</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No documents found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredDocs.length} of {verifications.length} documents</span>
          <button
            onClick={() => setActivePage('history')}
            className="font-bold text-cyan-800 hover:underline flex items-center gap-1"
          >
            <span>View Full Verification History</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
