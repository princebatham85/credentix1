import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  History, 
  FileText, 
  Files, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ActivePage, UserProfile } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  currentUser,
  onLogout,
  historyCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'verify', label: 'New Verification', icon: FileCheck2, highlight: true },
    { id: 'history', label: 'Verification History', icon: History, badge: historyCount.toString() },
    { id: 'supported-docs', label: 'Supported Documents', icon: Files },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      
      {/* Top Nav List */}
      <div className="p-4 space-y-1">
        
        {/* User Role Tag */}
        <div className="mb-4 rounded-xl border border-slate-200/80 bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Session</p>
          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{currentUser.name}</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[10px] font-bold text-cyan-800 uppercase">
              {currentUser.role}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold font-mono">Verified Session</span>
          </div>
        </div>

        {/* Links */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as ActivePage)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                isActive
                  ? 'bg-blue-950 text-white shadow-sm'
                  : item.highlight
                  ? 'bg-cyan-50/70 text-cyan-900 hover:bg-cyan-100/70 border border-cyan-200/50'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-300' : item.highlight ? 'text-cyan-700' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          onClick={() => setActivePage('landing')}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
        >
          <span>Back to Landing Page</span>
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};
