import React, { useState, useEffect } from 'react';
import { 
  ActivePage, 
  UserProfile, 
  VerificationResult, 
  AuthMode, 
  DocumentCategory, 
  DocumentType 
} from './types';
import { INITIAL_VERIFICATIONS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { VerificationView } from './components/VerificationView';
import { ResultsView } from './components/ResultsView';
import { HistoryView } from './components/HistoryView';
import { ReportsView } from './components/ReportsView';
import { SupportedDocsView } from './components/SupportedDocsView';
import { SettingsView } from './components/SettingsView';
import { HelpView } from './components/HelpView';

import { api } from './services/api';

const DEFAULT_USER: UserProfile = {
  name: 'Dr. Vikram Sethi',
  email: 'v.sethi@delhi.gov.in',
  role: 'government',
  organization: 'State Public Services & e-District Directorate',
  accountType: 'Enterprise Verifier'
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('landing');
  // Starts as stored user or null so top navigation shows Sign In / Get Started when not logged in
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => api.auth.getStoredUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  
  // Verification history state (persisted to localStorage & synced with server)
  const [verifications, setVerifications] = useState<VerificationResult[]>(() => {
    try {
      const saved = localStorage.getItem('docshield_verifications_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return INITIAL_VERIFICATIONS;
  });

  // Active document result / report selection
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [selectedReport, setSelectedReport] = useState<VerificationResult | null>(null);
  const [presetToLoad, setPresetToLoad] = useState<string | null>(null);

  // Restore authenticated session from server on mount
  useEffect(() => {
    api.auth.getMe().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    }).catch(() => {
      // Ignore
    });
  }, []);

  // Sync verifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('docshield_verifications_v2', JSON.stringify(verifications));
    } catch (e) {
      // Ignore
    }
  }, [verifications]);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setActivePage('login');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActivePage('dashboard');
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setCurrentUser(null);
    setActivePage('landing');
  };

  const handleStartVerificationFromLanding = () => {
    if (!currentUser) {
      setCurrentUser(DEFAULT_USER);
    }
    setCurrentResult(null);
    setActivePage('verify');
  };

  const handleLaunchPreset = (presetId: string) => {
    if (!currentUser) setCurrentUser(DEFAULT_USER);
    setPresetToLoad(presetId);
    setCurrentResult(null);
    setActivePage('verify');
  };

  const handleSelectDocTypeForVerification = (category: DocumentCategory, docType: DocumentType) => {
    if (!currentUser) setCurrentUser(DEFAULT_USER);
    setCurrentResult(null);
    setActivePage('verify');
  };

  const handleVerificationComplete = (result: VerificationResult) => {
    // Add to verifications state at front
    setVerifications(prev => [result, ...prev.filter(p => p.id !== result.id)]);
    setCurrentResult(result);
  };

  const handleSelectReport = (doc: VerificationResult | null) => {
    setSelectedReport(doc);
    setActivePage('reports');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navbar with Logo on top-left, Home/How It Works/Features/About Us, and prominent Sign In & Get Started on top-right */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          if (page === 'verify') setCurrentResult(null);
          setActivePage(page);
        }}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      {activePage === 'landing' ? (
        <LandingPage
          onStartVerification={handleStartVerificationFromLanding}
          onExploreFeatures={() => {
            const el = document.getElementById('features');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          setActivePage={setActivePage}
        />
      ) : activePage === 'login' ? (
        /* Dedicated Login Page */
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          setActivePage={setActivePage}
          initialMode={authMode}
        />
      ) : (
        /* Authenticated / Dashboard Portal Layout */
        <div className="flex flex-1">
          
          {/* Left Sidebar */}
          {currentUser && (
            <div className="hidden md:block">
              <Sidebar
                activePage={activePage}
                setActivePage={(page) => {
                  if (page === 'verify') setCurrentResult(null);
                  setActivePage(page);
                }}
                currentUser={currentUser}
                onLogout={handleLogout}
                historyCount={verifications.length}
              />
            </div>
          )}

          {/* Main Workspace Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            
            {activePage === 'dashboard' && (
              <DashboardView
                verifications={verifications}
                currentUser={currentUser || DEFAULT_USER}
                setActivePage={(page) => {
                  if (page === 'verify') setCurrentResult(null);
                  setActivePage(page);
                }}
                onSelectReport={handleSelectReport}
                onLaunchPreset={handleLaunchPreset}
              />
            )}

            {activePage === 'verify' && (
              currentResult ? (
                <ResultsView
                  result={currentResult}
                  onVerifyAnother={() => setCurrentResult(null)}
                  onViewFullReport={handleSelectReport}
                />
              ) : (
                <VerificationView
                  onVerificationComplete={handleVerificationComplete}
                  presetToLoad={presetToLoad}
                  onClearPreset={() => setPresetToLoad(null)}
                />
              )
            )}

            {activePage === 'history' && (
              <HistoryView
                verifications={verifications}
                onSelectReport={handleSelectReport}
                onClearHistory={() => setVerifications([])}
                onDeleteDoc={(id) => setVerifications(prev => prev.filter(v => v.id !== id))}
              />
            )}

            {activePage === 'reports' && (
              <ReportsView
                verifications={verifications}
                selectedReport={selectedReport}
                onSelectReport={setSelectedReport}
                onVerifyNew={() => {
                  setCurrentResult(null);
                  setActivePage('verify');
                }}
              />
            )}

            {activePage === 'supported-docs' && (
              <SupportedDocsView
                onSelectDocTypeForVerification={handleSelectDocTypeForVerification}
              />
            )}

            {activePage === 'settings' && (
              <SettingsView
                currentUser={currentUser || DEFAULT_USER}
                onUpdateUser={(updated) => setCurrentUser(updated)}
              />
            )}

            {activePage === 'help' && (
              <HelpView />
            )}

          </main>
        </div>
      )}

      {/* Auth Modal (optional quick modal fallback) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
