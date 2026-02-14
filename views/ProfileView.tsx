
import React, { useEffect, useState } from 'react';
import { Settings, History, Calendar, Star, ChevronRight, Award, LogOut, Flame, BarChart3, ShieldCheck } from 'lucide-react';
import { dbService } from '../services/dbService';
import { UserStats, ScanRecord } from '../types';

interface ProfileViewProps {
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onLogout }) => {
  const [user, setUser] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);

  useEffect(() => {
    dbService.getCurrentSessionUser().then(userData => {
      if (userData) {
        setUser(userData);
        dbService.getScans(userData.uid).then(scans => setHistory(scans));
      }
    });
  }, []);

  if (!user) return <div className="p-10 text-center text-neutral-500 uppercase font-black tracking-widest">LOADING DOSSIER...</div>;

  const xpRequiredForNextLevel = 100;
  const xpInCurrentLevel = user.points % xpRequiredForNextLevel;
  const progressPercent = (xpInCurrentLevel / xpRequiredForNextLevel) * 100;

  return (
    <div className="min-h-screen bg-neutral-950 p-8 pb-32 font-gaming">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-12">
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter">OPERATIVE PROFILE</h2>
           <button onClick={onLogout} className="p-3 bg-neutral-900 rounded-2xl border border-white/5 text-neutral-500 hover:text-red-400 transition-colors">
             <LogOut size={20} />
           </button>
        </div>

        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-emerald-500 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity" />
            <img src={user.photoURL} className="relative w-32 h-32 rounded-full border-4 border-neutral-900 shadow-2xl mb-6 object-cover bg-neutral-800" />
            <div className="absolute bottom-6 right-2 bg-emerald-500 text-black p-2 rounded-xl border-2 border-neutral-900 shadow-lg">
              <ShieldCheck size={18} fill="currentColor" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{user.username}</h3>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] bg-emerald-500/10 px-2 py-1 rounded">Rank Operative</span>
            <span className="w-1 h-1 bg-neutral-700 rounded-full" />
            <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em]">Joined 2025</span>
          </div>
        </div>

        {/* Level & XP Card */}
        <div className="glass rounded-[2rem] p-8 border-emerald-500/10 mb-8 relative overflow-hidden">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-1">CURRENT LEVEL</p>
              <h4 className="text-4xl font-black text-white leading-none tracking-tight">LEVEL {user.level}</h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">TOTAL XP</p>
              <p className="text-2xl font-black text-white leading-none tracking-tight">{user.points.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-4 bg-neutral-800 rounded-full overflow-hidden mb-3 border border-white/5">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,1)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{xpInCurrentLevel} XP</span>
            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{xpRequiredForNextLevel} XP NEEDED</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-5 mb-10">
           <div className="bg-neutral-900/50 p-6 rounded-3xl border border-white/5 flex flex-col items-center">
             <BarChart3 className="text-neutral-500 mb-3" size={24} />
             <p className="text-[9px] font-black text-neutral-500 mb-1 uppercase tracking-widest">TOTAL SCANS</p>
             <p className="text-2xl font-black text-white">{user.scansCount}</p>
           </div>
           <div className="bg-neutral-900/50 p-6 rounded-3xl border border-white/5 flex flex-col items-center">
             <Flame className="text-orange-500 mb-3" size={24} />
             <p className="text-[9px] font-black text-neutral-500 mb-1 uppercase tracking-widest">HOT STREAK</p>
             <p className="text-2xl font-black text-white">{user.streak}D</p>
           </div>
        </div>

        {/* Achievements */}
        <div className="mb-10">
          <h4 className="font-black text-white text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
            <Star size={16} className="text-emerald-500" /> MISSION BADGES
          </h4>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {user.achievements.map((ach) => (
              <div 
                key={ach.id} 
                className={`min-w-[120px] p-6 rounded-3xl border flex flex-col items-center text-center transition-all ${
                  ach.unlockedAt ? 'bg-emerald-500/10 border-emerald-500/20 shadow-lg' : 'bg-neutral-900/30 border-white/5 grayscale opacity-50'
                }`}
              >
                <span className="text-3xl mb-3">{ach.icon}</span>
                <h5 className="text-[10px] font-black text-white uppercase tracking-wider mb-1 leading-tight">{ach.title}</h5>
                <p className="text-[8px] font-bold text-neutral-600 uppercase leading-tight">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Operations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
               <History size={16} className="text-emerald-500" /> OPERATION LOG
            </h4>
            <button className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
              VIEW FULL ARCHIVE <ChevronRight size={12} />
            </button>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="bg-neutral-900/50 rounded-3xl p-10 text-center border border-dashed border-white/10">
                 <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">LOGS EMPTY. START FIELD OPS.</p>
              </div>
            ) : (
              history.slice(0, 5).map((scan) => (
                <div key={scan.id} className="bg-neutral-900/80 p-4 rounded-3xl border border-white/5 flex items-center gap-5 group hover:border-emerald-500/30 transition-all">
                   <div className="relative">
                     <img src={scan.imageUrl} className="w-16 h-16 rounded-2xl object-cover border border-white/10 group-hover:border-emerald-500/50" />
                     <div className="absolute -top-2 -left-2 bg-emerald-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded-lg border border-black">
                       +{scan.xpAwarded}
                     </div>
                   </div>
                   <div className="flex-1">
                     <h5 className="font-black text-white text-xs uppercase tracking-tight mb-1">{scan.result.detectedItem}</h5>
                     <div className="flex items-center gap-3">
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${
                         scan.result.binCategory === 'recycle' ? 'border-blue-400 text-blue-400' :
                         scan.result.binCategory === 'compost' ? 'border-emerald-400 text-emerald-400' : 'border-neutral-500 text-neutral-500'
                       }`}>
                         {scan.result.binCategory}
                       </span>
                       <span className="text-[8px] text-neutral-600 font-black uppercase tracking-[0.2em] flex items-center gap-1">
                         <Calendar size={10} /> {new Date(scan.timestamp).toLocaleDateString()}
                       </span>
                     </div>
                   </div>
                   <Award size={20} className="text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
