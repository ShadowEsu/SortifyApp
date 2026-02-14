
import React, { useEffect, useState } from 'react';
import { Search, MapPin, Navigation, Filter, Recycle, Trash2, Leaf, Radar, Loader2 } from 'lucide-react';
import { binService } from '../services/binService';
import { BinLocation, BinCategory } from '../types';

const MapView: React.FC = () => {
  const [bins, setBins] = useState<BinLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BinCategory | 'all'>('all');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        binService.getNearbyBins(pos.coords.latitude, pos.coords.longitude, 2000).then(data => {
          setBins(data);
          setLoading(false);
        });
      },
      () => {
        binService.getNearbyBins(40.7128, -74.0060, 2000).then(data => {
          setBins(data);
          setLoading(false);
        });
      }
    );
  }, []);

  const getBinIcon = (type: BinCategory) => {
    switch (type) {
      case BinCategory.RECYCLE: return <Recycle className="text-blue-400" size={16} />;
      case BinCategory.COMPOST: return <Leaf className="text-emerald-400" size={16} />;
      case BinCategory.WASTE: return <Trash2 className="text-neutral-400" size={16} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-950 font-gaming">
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
          <Radar className="text-emerald-500" />
          DISPOSAL GRID
        </h2>
        
        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={20} />
          <input 
            type="text" 
            placeholder="SCANNING AREA FOR HUBS..." 
            className="w-full bg-neutral-900 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-bold uppercase tracking-widest"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {(['all', ...Object.values(BinCategory)] as const).map(cat => (
             <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedCategory === cat 
                ? 'bg-emerald-500 text-black border-emerald-500' 
                : 'bg-neutral-900 text-neutral-500 border-white/5 hover:border-white/10'
              }`}
             >
               {cat}
             </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative bg-black overflow-hidden m-4 rounded-[2.5rem] border border-white/5">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Loader2 className="text-emerald-500 animate-spin" size={48} />
            <p className="text-xs font-black text-emerald-500 tracking-[0.3em]">SYNCHRONIZING HUB DATA...</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             {/* User Location */}
             <div className="relative">
                <div className="w-8 h-8 bg-emerald-500 rounded-full border-4 border-black shadow-[0_0_20px_rgba(52,211,153,0.8)] animate-pulse" />
                <div className="w-32 h-32 bg-emerald-500/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
             </div>

             {/* Mock Markers based on bins */}
             {bins.map((bin, i) => (
               <div 
                 key={bin.id}
                 className="absolute cursor-pointer group"
                 style={{
                   top: `${30 + (i * 15) % 40}%`,
                   left: `${20 + (i * 25) % 60}%`
                 }}
               >
                 <div className="bg-neutral-900 p-3 rounded-2xl border border-white/10 shadow-2xl group-hover:scale-125 transition-transform group-hover:border-emerald-500">
                   {getBinIcon(bin.type)}
                 </div>
                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold text-white border border-white/10">
                    {bin.name}
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>

      <div className="p-8 pt-0 pb-32">
        <div className="bg-neutral-900/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
               <MapPin size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">NEAREST FACILITY</p>
              <h4 className="font-black text-white uppercase text-sm tracking-tight">{bins[0]?.name || 'SCANNING...'}</h4>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter mt-1">AVAILABLE • 0.3km HUB_ID_009</p>
            </div>
          </div>
          <button className="bg-emerald-500 text-black p-4 rounded-2xl shadow-xl shadow-emerald-500/10 active:scale-95 transition-transform">
            <Navigation size={20} className="fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
