
import React, { useRef, useState, useEffect } from 'react';
import { Camera, RotateCcw, Loader2, CheckCircle2, AlertCircle, Zap, TrendingUp, Trophy } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { ScanResult, BinCategory, UserStats } from '../types';

const ScanView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      setError('CAMERA ACCESS DENIED. CHECK PERMISSIONS.');
    }
  };

  useEffect(() => {
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    const base64Image = canvas.toDataURL('image/jpeg', 0.8);

    try {
      const user = await dbService.getCurrentSessionUser();
      if (!user) throw new Error("Session expired.");

      const classification = await geminiService.classifyWaste(base64Image);
      const saveResult = await dbService.saveScan(user.uid, base64Image, classification);
      
      setXpEarned(saveResult.scan.xpAwarded);
      setResult(classification);
    } catch (err: any) {
      setError(err.message || 'AI ANALYSIS FAILED');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryTheme = (cat: BinCategory) => {
    switch (cat) {
      case BinCategory.RECYCLE: return { color: 'text-blue-400', border: 'border-blue-400/50', bg: 'bg-blue-400/10' };
      case BinCategory.COMPOST: return { color: 'text-green-400', border: 'border-green-400/50', bg: 'bg-green-400/10' };
      case BinCategory.WASTE: return { color: 'text-neutral-400', border: 'border-neutral-400/50', bg: 'bg-neutral-400/10' };
    }
  };

  if (result) {
    const theme = getCategoryTheme(result.binCategory);
    return (
      <div className="min-h-screen bg-neutral-950 p-6 pb-32 animate-in fade-in zoom-in duration-300">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 neon-glow">
              <CheckCircle2 className="text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black font-gaming text-white uppercase tracking-tight">ANALYSIS COMPLETE</h2>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">CORE DATA RECEIVED</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-[2rem] overflow-hidden border-white/5 shadow-2xl relative">
             <div className="relative aspect-[4/5] bg-neutral-900">
               <canvas ref={canvasRef} className="w-full h-full object-cover" />
               <div className={`absolute top-6 right-6 px-5 py-2 rounded-2xl border-2 backdrop-blur-md font-black font-gaming text-sm uppercase ${theme.color} ${theme.border} ${theme.bg}`}>
                 {result.binCategory}
               </div>
               
               {/* Floating XP Gain Animation */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="animate-bounce flex flex-col items-center">
                   <span className="text-6xl font-black font-gaming text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">+{xpEarned} XP</span>
                   <span className="text-emerald-400/50 font-gaming text-sm font-bold tracking-widest">MISSION BONUS</span>
                 </div>
               </div>
             </div>

             <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white font-gaming uppercase tracking-tight">{result.detectedItem}</h3>
                    <p className="text-xs font-bold text-neutral-500 tracking-widest mt-1">CONFIDENCE: {Math.round(result.confidence * 100)}%</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <TrendingUp className="text-emerald-400 mb-1" size={18} />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Impact Logged</span>
                  </div>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 mb-8">
                  <p className="text-neutral-400 text-sm leading-relaxed font-medium italic">"{result.explanation}"</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-neutral-200 text-xs font-gaming tracking-widest uppercase">DISPOSAL PROTOCOL</h4>
                  {result.disposalTips.map((tip, i) => (
                    <div key={i} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                      <Zap className="text-emerald-400 shrink-0" size={16} />
                      <p className="text-sm text-neutral-300 font-bold uppercase text-[10px] tracking-wider leading-tight">{tip}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <button
            onClick={() => {setResult(null); startCamera();}}
            className="w-full mt-10 bg-emerald-500 hover:bg-emerald-400 text-black font-black font-gaming py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/10 active:scale-95 text-sm uppercase tracking-widest"
          >
            <RotateCcw size={18} />
            INITIATE NEXT SCAN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden font-gaming">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />

      {/* Futuristic HUD */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5">
        <div className="absolute top-10 left-10 flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
           <span className="text-[10px] text-emerald-400/80 font-black tracking-[0.3em]">SYSTEM ACTIVE</span>
        </div>
        <div className="absolute top-10 right-10 flex items-center gap-2 text-white/40">
           <span className="text-[10px] font-black tracking-[0.3em]">OP_MODE: AUTO_CLASS</span>
        </div>
        
        {/* Viewfinder brackets */}
        <div className="absolute inset-20 border border-white/10 rounded-[3rem]">
          <div className="absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl"></div>
          <div className="absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl"></div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl"></div>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="h-24 bg-gradient-to-b from-black to-transparent" />
        <div className="flex-1" />

        <div className="bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-center px-8 pb-32 pointer-events-auto">
          {error && (
             <div className="mb-6 bg-red-500/20 text-red-200 py-3 px-6 rounded-2xl flex items-center gap-3 text-xs font-black border border-red-500/30 uppercase tracking-widest">
               <AlertCircle size={18} />
               {error}
             </div>
          )}
          
          <div className="relative mb-8 text-center">
             <p className="text-white text-xs font-black tracking-[0.4em] uppercase opacity-80">ALIGN OBJECT FOR ANALYSIS</p>
             <div className="h-1 w-12 bg-emerald-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(52,211,153,1)]" />
          </div>

          <button
            onClick={capturePhoto}
            disabled={isProcessing}
            className={`group relative w-24 h-24 rounded-full border-[6px] transition-all flex items-center justify-center ${
              isProcessing ? 'border-emerald-500 scale-90' : 'border-white/20 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="text-emerald-400 animate-spin" size={40} />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white group-hover:bg-emerald-400 transition-colors shadow-2xl flex items-center justify-center">
                <Camera className="text-black" size={24} />
              </div>
            )}
            <div className="absolute -inset-4 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ScanView;
