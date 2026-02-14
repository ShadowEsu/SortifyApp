
import React from 'react';
import { Camera, MapPin, Trophy, User } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { id: 'scan', icon: Camera, label: 'SCAN' },
    { id: 'map', icon: MapPin, label: 'RADAR' },
    { id: 'leaderboard', icon: Trophy, label: 'RANKS' },
    { id: 'profile', icon: User, label: 'OP_ID' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-xl border-t border-white/5 px-8 pb-8 pt-4 flex justify-between items-center z-50 safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center gap-2 transition-all relative group ${
              isActive ? 'text-emerald-400' : 'text-neutral-600 hover:text-neutral-400'
            }`}
          >
            {isActive && (
              <div className="absolute -top-2 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]" />
            )}
            <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-emerald-500/10 border border-emerald-500/20 neon-glow' : 'bg-transparent border border-transparent group-hover:bg-white/5'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'fill-current' : ''} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] font-gaming">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
