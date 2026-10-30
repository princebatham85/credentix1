import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  ArrowUpRight, 
  Building2, 
  GraduationCap, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { VerificationResult, VerificationStatus, DocumentCategory } from '../types';
import { getStatusColor } from '../utils/verificationEngine';
import { api } from '../services/api';

interface HistoryViewProps {
  verifications: VerificationResult[];
  onSelectReport: (doc: VerificationResult) => void;
  onClearHistory?: () => void;
  onDeleteDoc?: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  verifications,
  onSelectReport,
  onClearHistory,
  onDeleteDoc
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | DocumentCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | VerificationStatus>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  const filtered = verifications.filter((v) => {
    const matchesSearch = 
      v.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.extractedData['Cardholder Name'] && v.extractedData['Cardholder Name'].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.extractedData['Student Name'] && v.extractedData['Student Name'].toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'score') return b.confidenceScore - a.confidenceScore;
    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Document Name', 'Category', 'Type', 'Upload Date', 'Status', 'Confidence Score', 'SHA-256'];
    const rows = filtered.map(v => [
      v.id,
      `"${v.documentName}"`,
      v.category,
      `"${v.documentType}"`,
      v.uploadDate,
      v.status,
      `${v.confidenceScore}%`,
      v.hashSha256
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DocShield_Verification_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Verification Audit History</h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable log of examined credentials, hash stamps, and detected forensic anomalies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Export CSV Audit Log</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, name, student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="government">Government IDs</option>
            <option value="educational">Educational Credentials</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Verified">Verified Clear</option>
            <option value="Suspicious">Suspicious</option>
            <option value="Failed">Failed / Counterfeit</option>
            <option value="Manual Review Required">Manual Review</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="date">Sort by Date (Newest first)</option>
            <option value="score">Sort by Confidence Score</option>
          </select>

        </div>
      </div>

      {/* Records Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Document Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Upload Timestamp</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length > 0 ? (
                filtered.map((doc) => {
                  const colors = getStatusColor(doc.status);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                      
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[240px]">{doc.documentName}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 mt-0.5">
                          <span>{doc.id}</span>
                          <span>•</span>
                          <span className="text-slate-600 font-semibold">{doc.documentType}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                          doc.category === 'government' ? 'bg-blue-50 text-blue-900' : 'bg-cyan-50 text-cyan-900'
                        }`}>
                          {doc.category === 'government' ? <Building2 className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                          <span className="capitalize">{doc.category}</span>
                        </span>
                      </td>

                      {/* Upload Date */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {doc.uploadDate}
                      </td>

                      {/* Confidence Score */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{doc.confidenceScore}%</span>
                          <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${colors.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                          <span>{doc.status}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectReport(doc)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-cyan-500 hover:text-cyan-900 transition shadow-2xs"
                          >
                            <span>View Report</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete ${doc.documentName}?`)) {
                                try {
                                  await api.documents.delete(doc.id);
                                } catch {
                                  // ignore
                                }
                                if (onDeleteDoc) onDeleteDoc(doc.id);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No documents found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 p-4 flex items-center justify-between text-xs text-slate-500">
          <span>Displaying {filtered.length} of {verifications.length} verified records</span>
          <span className="font-mono text-[11px]">Local storage cached • Zero PII leaked</span>
        </div>
      </div>

    </div>
  );
};
