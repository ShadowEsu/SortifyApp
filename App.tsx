
import React, { useState, useEffect } from 'react';
import ScanView from './views/ScanView';
import MapView from './views/MapView';
import LeaderboardView from './views/LeaderboardView';
import ProfileView from './views/ProfileView';
import AuthView from './views/AuthView';
import Navigation from './components/Navigation';
import { dbService } from './services/dbService';
import { UserStats } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserStats | null>(null);
  const [currentView, setCurrentView] = useState('scan');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbService.getCurrentSessionUser().then(user => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    dbService.logout();
    setCurrentUser(null);
  };

  if (loading) return (
    <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_20px_rgba(52,211,153,0.3)]" />
      <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] animate-pulse uppercase">INITIALIZING SORTIFY...</span>
    </div>
  );

  if (!currentUser) {
    return <AuthView onAuth={setCurrentUser} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'scan': return <ScanView />;
      case 'map': return <MapView />;
      case 'leaderboard': return <LeaderboardView />;
      case 'profile': return <ProfileView onLogout={handleLogout} />;
      default: return <ScanView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 selection:bg-emerald-500/30 selection:text-emerald-300">
      <main className="flex-1 pb-20">
        {renderView()}
      </main>
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;
