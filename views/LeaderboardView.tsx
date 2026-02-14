
import React, { useEffect, useState } from 'react';
import { Trophy, Crown, ArrowUp, Zap, Target, Loader2 } from 'lucide-react';
import { dbService } from '../services/dbService';
import { UserStats } from '../types';

const LeaderboardView: React.FC = () => {
  const [rankings, setRankings] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbService.getLeaderboard().then(data => {
      setRankings(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 p-8 pb-32 font-gaming">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">GLOBAL RANKS</h2>
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Top Planetary Operatives</p>
          </div>
          <div className="p-4 bg-emerald-500 text-black rounded-2xl shadow-lg shadow-emerald-500/20">
            <Trophy size={24} className="fill-current" />
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center p-20"><Loader2 className="text-emerald-500 animate-spin" size={48} /></div>
        ) : (
          <div className="space-y-4">
            {rankings.map((user, i) => (
              <div 
                key={user.uid} 
                className={`flex items-center gap-5 p-5 rounded-[2rem] border transition-all ${
                  i === 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 
                  i < 3 ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5'
                }`}
              >
                <div className="w-8 flex items-center justify-center">
                  {i === 0 ? <Crown size={24} className="text-emerald-400" /> : 
                   <span className={`text-lg font-black ${i < 3 ? 'text-white' : 'text-neutral-600'}`}>#{i + 1}</span>}
                </div>
                
                <img src={user.photoURL} className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-white/10 object-cover" />
                
                <div className="flex-1">
                  <h4 className="font-black text-white uppercase text-xs tracking-wider">{user.username}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">LVL {user.level}</span>
                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1">
                       <Zap size={8} className="fill-current" /> STREAK {user.streak}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-black text-white text-sm tracking-tight">{user.points.toLocaleString()} <span className="text-emerald-500">XP</span></p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <ArrowUp size={10} className="text-emerald-400" />
                    <span className="text-[10px] font-black text-emerald-400">UP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 glass rounded-3xl border-emerald-500/20 text-center">
           <Target size={32} className="mx-auto text-emerald-500 mb-3 opacity-50" />
           <p className="text-xs font-black text-neutral-400 uppercase tracking-widest leading-loose">
             Next rank reset in 12 days. <br/> Keep sorting to maintain status.
           </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardView;
