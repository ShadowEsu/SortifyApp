
import React, { useEffect, useState } from 'react';
import { 
  Settings, User, Shield, Volume2, Bell, Palette, 
  ChevronRight, Save, RotateCcw, Fingerprint, 
  Target, Zap, Sliders, Smartphone, Info
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { soundService } from '../services/soundService';
import { UserStats, CharacterGear } from '../types';

const AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alpha',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Bravo',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Delta',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Echo',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Foxtrot',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Golf',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Hotel',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=India',
];

const COLORS = [
  { name: 'EMERALD', hex: '#10b981' },
  { name: 'BLUE', hex: '#3b82f6' },
  { name: 'RED', hex: '#ef4444' },
  { name: 'GOLD', hex: '#f59e0b' },
];

const SettingsView: React.FC = () => {
  const [user, setUser] = useState<UserStats | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [baseColor, setBaseColor] = useState('#10b981');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'SYSTEM'>('IDENTITY');

  useEffect(() => {
    dbService.getCurrentSessionUser().then(u => {
      if (u) {
        setUser(u);
        setDisplayName(u.displayName);
        setSelectedAvatar(u.photoURL);
        setBaseColor(u.gear.baseColor);
      }
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    soundService.playSuccess();
    try {
      const updatedGear: CharacterGear = {
        ...user!.gear,
        baseColor: baseColor
      };
      await dbService.updateUser({ 
        displayName, 
        photoURL: selectedAvatar,
        gear: updatedGear
      });
      // Force reload to apply theme
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-950 p-8 pb-32 font-gaming">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">SETTINGS</h2>
            <p className="text-[9px] font-black text-emerald-500/60 tracking-[0.3em] uppercase underline underline-offset-4">HUD_CALIBRATION_v4.2</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white">
            <Settings size={24} />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-900/50 p-1.5 rounded-2xl border border-white/5 mb-8">
           <button 
             onClick={() => {soundService.playClick(); setActiveTab('IDENTITY');}}
             className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'IDENTITY' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-neutral-500'}`}
           >
             IDENTITY
           </button>
           <button 
             onClick={() => {soundService.playClick(); setActiveTab('SYSTEM');}}
             className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SYSTEM' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-neutral-500'}`}
           >
             SYSTEM
           </button>
        </div>

        {activeTab === 'IDENTITY' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Identity Card */}
            <div className="glass rounded-[2.5rem] p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-8">
                <Fingerprint className="text-emerald-500" size={18} />
                <h3 className="text-[12px] font-black text-white uppercase tracking-widest">OPERATIVE_SIG</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3 block ml-1">CODENAME</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-black uppercase tracking-widest focus:border-emerald-500 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3 block ml-1">BIOMETRIC_AVATAR</label>
                  <div className="grid grid-cols-3 gap-3">
                    {AVATARS.map((avatar, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {soundService.playClick(); setSelectedAvatar(avatar);}}
                        className={`aspect-square rounded-xl border-2 transition-all relative overflow-hidden ${selectedAvatar === avatar ? 'border-emerald-500 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-white/5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                      >
                        <img src={avatar} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual HUD Card */}
            <div className="glass rounded-[2.5rem] p-8 border border-white/10">
               <div className="flex items-center gap-3 mb-8">
                <Palette className="text-emerald-500" size={18} />
                <h3 className="text-[12px] font-black text-white uppercase tracking-widest">HUD_VISUALS</h3>
              </div>

              <div>
                  <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-4 block ml-1">CORE_UI_THEME</label>
                  <div className="grid grid-cols-2 gap-3">
                    {COLORS.map((color) => (
                      <button 
                        key={color.name}
                        onClick={() => {soundService.playClick(); setBaseColor(color.hex);}}
                        className={`py-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${baseColor === color.hex ? 'border-white bg-white/10' : 'border-white/5 bg-black/40 text-neutral-500'}`}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                        <span className="text-[9px] font-black tracking-widest">{color.name}</span>
                      </button>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
             {/* Sound Module */}
             <div className="bg-neutral-900/60 p-6 rounded-3xl border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 group-hover:text-emerald-500 transition-colors">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">AUDIO_CORE</h4>
                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-[0.2em]">TACTICAL SFX OUTPUT</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1">
                   <div className="w-4 h-4 bg-black rounded-full" />
                </div>
             </div>

             {/* Notifications Module */}
             <div className="bg-neutral-900/60 p-6 rounded-3xl border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 group-hover:text-emerald-500 transition-colors">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">NEURAL_ALERTS</h4>
                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-[0.2em]">MISSION STATUS LOGS</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1">
                   <div className="w-4 h-4 bg-black rounded-full shadow-lg" />
                </div>
             </div>

             {/* Device Info */}
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                <div className="flex items-center gap-3 opacity-40">
                   <Smartphone size={16} />
                   <span className="text-[9px] font-black uppercase tracking-widest">DEVICE_LINK: STABLE</span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                   <Zap size={16} />
                   <span className="text-[9px] font-black uppercase tracking-widest">LATENCY: 14ms</span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                   <Info size={16} />
                   <span className="text-[9px] font-black uppercase tracking-widest">VERSION: SORTIFY-X.v.4.2</span>
                </div>
             </div>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-10 py-6 rounded-3xl bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.4em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
        >
          {isSaving ? <RotateCcw size={20} className="animate-spin" /> : <Save size={20} />}
          APPLY CALIBRATION
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
