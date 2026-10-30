import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  RefreshCw, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Activity, 
  ChevronDown, 
  X,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { api, SystemHealthResponse, HealthStatusType } from '../services/api';

interface SystemStatusProps {
  className?: string;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ className = '' }) => {
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [simulationMode, setSimulationMode] = useState<'normal' | 'degraded' | 'downtime'>('normal');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch health data from server-side endpoint
  const fetchHealth = async (mode: 'normal' | 'degraded' | 'downtime' = simulationMode, showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const simulateParam = mode === 'normal' ? undefined : mode;
      const data = await api.system.getHealth(simulateParam);
      setHealth(data);
      setLastChecked(new Date());
      setSecondsAgo(0);
    } catch (err) {
      // In case of network error, express downtime
      setHealth({
        status: 'downtime',
        uptime: 0,
        timestamp: new Date().toISOString(),
        environment: 'production',
        version: '2.4.0',
        services: {
          apiServer: { status: 'downtime', latencyMs: 0, message: 'Server unreachable or network failure' },
          database: { status: 'downtime', message: 'Connection unavailable' },
          aiEngine: { status: 'downtime', message: 'Inference pipeline unreachable' },
          storage: { status: 'downtime', message: 'Storage partition inaccessible' }
        },
        overallLatencyMs: 0
      });
      setLastChecked(new Date());
      setSecondsAgo(0);
    } finally {
      setLoading(false);
      if (showRefreshing) {
        setTimeout(() => setRefreshing(false), 300);
      }
    }
  };

  // Initial fetch and 20s polling interval
  useEffect(() => {
    fetchHealth(simulationMode);

    const pollInterval = setInterval(() => {
      fetchHealth(simulationMode);
    }, 20000);

    const secondsInterval = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(secondsInterval);
    };
  }, [simulationMode]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentStatus: HealthStatusType = health?.status || (loading ? 'operational' : 'downtime');

  // Format uptime into human-readable string (e.g., 2d 5h 12m)
  const formatUptime = (seconds: number = 0) => {
    if (seconds <= 0) return '0m';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // Color & badge helpers
  const getStatusConfig = (status: HealthStatusType) => {
    switch (status) {
      case 'operational':
        return {
          dotBg: 'bg-emerald-500',
          dotRing: 'ring-4 ring-emerald-500/20 shadow-xs shadow-emerald-500/40',
          badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          label: 'Operational',
          bannerBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          subtext: 'All core systems operating normally'
        };
      case 'degraded':
        return {
          dotBg: 'bg-amber-500 animate-pulse',
          dotRing: 'ring-4 ring-amber-500/25 shadow-xs shadow-amber-500/40',
          badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
          label: 'Degraded',
          bannerBg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          subtext: 'High load or sub-service latency alert'
        };
      case 'downtime':
      default:
        return {
          dotBg: 'bg-rose-500 animate-ping',
          dotRing: 'ring-4 ring-rose-500/25 shadow-xs shadow-rose-500/40',
          badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
          label: 'Downtime',
          bannerBg: 'bg-rose-50 border-rose-200 text-rose-900',
          icon: AlertOctagon,
          iconColor: 'text-rose-600',
          subtext: 'Critical services experiencing disruption'
        };
    }
  };

  const statusConfig = getStatusConfig(currentStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      
      {/* Small Indicator Trigger Button in Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`group flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all shadow-2xs hover:shadow-sm ${
          isOpen ? 'ring-2 ring-cyan-500/40 border-cyan-300 bg-white' : 'border-slate-200 bg-white hover:bg-slate-50'
        }`}
        title={`DocShield Platform Status: ${statusConfig.label} (${health?.overallLatencyMs || 12}ms)`}
      >
        {/* Pulsing Status Dot */}
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          {currentStatus === 'operational' ? (
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping duration-1000"></span>
          ) : currentStatus === 'degraded' ? (
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping duration-700"></span>
          ) : (
            <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-90 animate-ping duration-500"></span>
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${statusConfig.dotBg}`}></span>
        </span>

        {/* Status Label */}
        <span className="font-bold text-slate-800 flex items-center gap-1.5">
          <span>Systems:</span>
          <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
            currentStatus === 'operational' ? 'text-emerald-700 bg-emerald-50' :
            currentStatus === 'degraded' ? 'text-amber-800 bg-amber-50' : 'text-rose-700 bg-rose-50'
          }`}>
            {statusConfig.label}
          </span>
        </span>

        {/* Latency Pill */}
        <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-medium text-slate-400 border-l border-slate-200 pl-2">
          {health ? `${health.overallLatencyMs}ms` : '...'}
        </span>

        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded Real-time Health Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header of Dropdown */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                System Diagnostics
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fetchHealth(simulationMode, true)}
                disabled={refreshing}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                title="Refresh health check"
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin text-cyan-600' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Overall Status Banner */}
          <div className={`mt-3 rounded-xl border p-3 flex items-start gap-2.5 ${statusConfig.bannerBg}`}>
            <StatusIcon className={`h-5 w-5 shrink-0 mt-0.5 ${statusConfig.iconColor}`} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{statusConfig.label}</span>
                <span className="text-[10px] font-mono opacity-80">v2.4.0</span>
              </div>
              <p className="text-[11px] mt-0.5 leading-tight opacity-90">
                {statusConfig.subtext}
              </p>
            </div>
          </div>

          {/* Subsystems Real-time Metrics */}
          <div className="mt-3 space-y-2">
            
            {/* 1. REST API Gateway */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100/70 text-blue-900">
                  <Server className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">API Gateway</p>
                  <p className="text-[10px] text-slate-500">
                    {health?.services.apiServer.message || 'Express REST endpoints'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  health?.services.apiServer.status === 'operational' ? 'text-emerald-700 bg-emerald-100/80' :
                  health?.services.apiServer.status === 'degraded' ? 'text-amber-800 bg-amber-100/80' : 'text-rose-700 bg-rose-100/80'
                }`}>
                  {health?.services.apiServer.status}
                </span>
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {health?.services.apiServer.latencyMs ?? 12}ms
                </p>
              </div>
            </div>

            {/* 2. AI Forensic Engine (Gemini 3.8 Flash) */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100/70 text-cyan-900">
                  <Cpu className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-800 leading-tight">Gemini 3.8 Flash</p>
                    <span className="rounded bg-cyan-200/60 px-1 text-[9px] font-mono font-semibold text-cyan-900">AI</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate max-w-[170px] sm:max-w-[210px]">
                    {health?.services.aiEngine.message || 'Multimodal OCR & ELA'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  health?.services.aiEngine.status === 'operational' ? 'text-emerald-700 bg-emerald-100/80' :
                  health?.services.aiEngine.status === 'degraded' ? 'text-amber-800 bg-amber-100/80' : 'text-rose-700 bg-rose-100/80'
                }`}>
                  {health?.services.aiEngine.status}
                </span>
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                  Multimodal
                </p>
              </div>
            </div>

            {/* 3. Document Database */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100/70 text-purple-900">
                  <Database className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Database Index</p>
                  <p className="text-[10px] text-slate-500">
                    {health?.services.database.message || 'Active Document Store'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  health?.services.database.status === 'operational' ? 'text-emerald-700 bg-emerald-100/80' :
                  health?.services.database.status === 'degraded' ? 'text-amber-800 bg-amber-100/80' : 'text-rose-700 bg-rose-100/80'
                }`}>
                  {health?.services.database.status}
                </span>
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                  Indexed
                </p>
              </div>
            </div>

            {/* 4. Encrypted Storage Vault */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/70 text-emerald-900">
                  <HardDrive className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Secure Storage</p>
                  <p className="text-[10px] text-slate-500">
                    {health?.services.storage.message || 'File upload volume'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  health?.services.storage.status === 'operational' ? 'text-emerald-700 bg-emerald-100/80' :
                  health?.services.storage.status === 'degraded' ? 'text-amber-800 bg-amber-100/80' : 'text-rose-700 bg-rose-100/80'
                }`}>
                  {health?.services.storage.status}
                </span>
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                  Read/Write
                </p>
              </div>
            </div>

          </div>

          {/* Uptime & Timestamp Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>Uptime: <strong className="font-semibold text-slate-700">{formatUptime(health?.uptime)}</strong></span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Checked {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
            </span>
          </div>

          {/* Interactive Simulation Sandbox (for demonstrating Green, Yellow, Red states) */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-4 p-3 rounded-b-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                Live State Simulator:
              </span>
              <span className="text-[10px] text-slate-400">
                Test Health Checks
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSimulationMode('normal');
                  fetchHealth('normal', true);
                }}
                className={`flex items-center justify-center gap-1 rounded-lg py-1 px-1.5 text-[10px] font-bold border transition ${
                  simulationMode === 'normal' 
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' 
                    : 'bg-white text-emerald-800 border-slate-200 hover:bg-emerald-50'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Operational</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSimulationMode('degraded');
                  fetchHealth('degraded', true);
                }}
                className={`flex items-center justify-center gap-1 rounded-lg py-1 px-1.5 text-[10px] font-bold border transition ${
                  simulationMode === 'degraded' 
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs' 
                    : 'bg-white text-amber-800 border-slate-200 hover:bg-amber-50'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Degraded</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSimulationMode('downtime');
                  fetchHealth('downtime', true);
                }}
                className={`flex items-center justify-center gap-1 rounded-lg py-1 px-1.5 text-[10px] font-bold border transition ${
                  simulationMode === 'downtime' 
                    ? 'bg-rose-600 text-white border-rose-700 shadow-xs' 
                    : 'bg-white text-rose-800 border-slate-200 hover:bg-rose-50'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping"></span>
                <span>Downtime</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
