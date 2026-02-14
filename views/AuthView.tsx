
import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { UserStats } from '../types';
import { Zap, ShieldCheck, Rocket, Loader2 } from 'lucide-react';

interface AuthViewProps {
  onAuth: (user: UserStats) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuth }) => {
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError('');

    try {
      const user = isLogin 
        ? await dbService.login(username.trim())
        : await dbService.signup(username.trim());
      onAuth(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-neutral-950 text-white">
      <div className="mb-12 text-center">
        <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 mb-6 neon-glow">
          <Zap size={48} className="text-emerald-400 fill-emerald-400/20" />
        </div>
        <h1 className="text-5xl font-black font-gaming tracking-tighter mb-2">SORT<span className="text-emerald-500">IFY</span></h1>
        <p className="text-neutral-500 font-medium">Eco-Logistics Management System v2.0</p>
      </div>

      <div className="w-full max-w-sm glass rounded-[2.5rem] p-8 shadow-2xl border border-white/5">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {isLogin ? <ShieldCheck className="text-emerald-400" /> : <Rocket className="text-emerald-400" />}
          {isLogin ? 'RESUME SESSION' : 'ENLIST NOW'}
        </h2>

        <form onSubmit={handleAction} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">Codename / Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ENTER OPERATIVE ID"
              className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-gaming text-sm uppercase"
            />
          </div>

          {error && <p className="text-red-400 text-xs font-bold text-center bg-red-400/10 p-2 rounded-lg">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 font-gaming"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'INITIALIZE' : 'CREATE PROFILE')}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-xs font-bold text-neutral-500 uppercase tracking-widest hover:text-emerald-400 transition-colors"
        >
          {isLogin ? "DON'T HAVE AN ID? JOIN THE CORPS" : "ALREADY ENLISTED? SIGN IN"}
        </button>
      </div>

      <div className="mt-12 text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em]">
        Earth Defense Initiative &copy; 2025
      </div>
    </div>
  );
};

export default AuthView;
