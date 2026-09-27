import React, { useState, useRef, useEffect } from 'react';
import { synthesizeMusicTrack, synthesizeSfx } from '../utils/audioSynthesizer';
import { 
  Music, 
  Volume2, 
  Play, 
  Pause, 
  Download, 
  Sparkles, 
  Sliders, 
  Layers, 
  Radio, 
  Flame, 
  Check, 
  Zap, 
  DollarSign, 
  ArrowDownCircle, 
  Camera, 
  CircleDot,
  Clock,
  RotateCcw,
  Activity,
  Headphones,
  Bell,
  Cpu
} from 'lucide-react';

export const AudioStudioModule: React.FC = () => {
  const [style, setStyle] = useState<'dtc_tiktok' | 'vsl_cinematic' | 'lofi_chai' | 'synthwave' | 'luxury_ambient' | 'countdown_tension'>('dtc_tiktok');
  const [bpm, setBpm] = useState<number>(128);
  const [duration, setDuration] = useState<number>(12);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [currentTrack, setCurrentTrack] = useState<{
    title: string;
    style: string;
    blob: Blob | null;
    audioUrl: string | null;
    duration: number;
    bpm: number;
  }>({
    title: 'TikTok Viral Drop (128 BPM)',
    style: 'dtc_tiktok',
    blob: null,
    audioUrl: null,
    duration: 12,
    bpm: 128,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // SFX states
  const [playingSfx, setPlayingSfx] = useState<string | null>(null);

  // Initialize a default track on first load safely
  useEffect(() => {
    generateTrack('dtc_tiktok', 128, 12);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animated visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 48;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        let height = 8;
        if (isPlaying) {
          // Dynamic dancing waveform
          const freq = Math.sin((i / 4) + step * 0.15) * 0.5 + 0.5;
          const beatPulse = (currentTime % 0.46) / 0.46;
          height = Math.max(6, (freq * (canvas.height - 16)) * (1 - beatPulse * 0.3));
        } else {
          // Resting wave
          height = 6 + Math.sin(i * 0.25) * 4;
        }

        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        if (isPlaying) {
          grad.addColorStop(0, '#818cf8');
          grad.addColorStop(1, '#c084fc');
        } else {
          grad.addColorStop(0, '#475569');
          grad.addColorStop(1, '#334155');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x + 1.5, y, Math.max(1, barWidth - 3), height, 2);
        ctx.fill();
      }

      step++;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime]);

  const generateTrack = async (
    targetStyle: 'dtc_tiktok' | 'vsl_cinematic' | 'lofi_chai' | 'synthwave' | 'luxury_ambient' | 'countdown_tension',
    targetBpm?: number,
    targetDuration?: number
  ) => {
    setIsGenerating(true);
    setIsPlaying(false);
    setAudioError(null);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const activeBpm = targetBpm || bpm;
      const activeDur = targetDuration || duration;

      const { blob } = await synthesizeMusicTrack(targetStyle, activeBpm, activeDur);
      const url = URL.createObjectURL(blob);
      
      const titles: Record<string, string> = {
        dtc_tiktok: `TikTok Viral Hook Beat (${activeBpm} BPM)`,
        vsl_cinematic: `VSL Suspense Riser & Sub Drop (${activeBpm} BPM)`,
        lofi_chai: `Desi Karak Chai Relaxed Lofi (${activeBpm} BPM)`,
        synthwave: `Neon Cyberpunk Tech Promo (${activeBpm} BPM)`,
        luxury_ambient: `Luxury Crystalline Ambient (${activeBpm} BPM)`,
        countdown_tension: `Urgency Countdown & Heartbeat (${activeBpm} BPM)`,
      };

      setCurrentTrack({
        title: titles[targetStyle] || 'Custom Studio Beat',
        style: targetStyle,
        blob,
        audioUrl: url,
        duration: activeDur,
        bpm: activeBpm,
      });
      setCurrentTime(0);
    } catch (e: any) {
      console.error('Track generation error:', e);
      setAudioError(e.message || 'Audio synthesis failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current || !currentTrack.audioUrl) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      console.warn('Playback error (browser policy):', err);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleDownloadTrack = () => {
    if (!currentTrack.blob) return;
    const a = document.createElement('a');
    a.href = currentTrack.audioUrl || '';
    a.download = `CineFlow_${currentTrack.title.replace(/\s+/g, '_')}.wav`;
    a.click();
  };

  // Play and download individual SFX
  const triggerSfx = async (type: 'whoosh' | 'chaching' | 'bass_drop' | 'pop' | 'shutter' | 'glitch' | 'ding') => {
    setPlayingSfx(type);
    try {
      const { blob } = await synthesizeSfx(type);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      await audio.play();
      setTimeout(() => setPlayingSfx(null), 800);
    } catch (e) {
      console.warn('SFX trigger error:', e);
      setPlayingSfx(null);
    }
  };

  const downloadSfx = async (type: 'whoosh' | 'chaching' | 'bass_drop' | 'pop' | 'shutter' | 'glitch' | 'ding') => {
    const { blob } = await synthesizeSfx(type);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CineFlow_SFX_${type.toUpperCase()}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const beatStyles = [
    {
      id: 'dtc_tiktok' as const,
      name: 'TikTok Viral Drop',
      bpm: 128,
      desc: 'Punchy 4-on-the-floor kick, snappy clap on 2 & 4, high-energy bouncy 808',
      icon: Flame,
      color: 'from-amber-500/20 to-rose-500/20 border-amber-500/30 text-amber-400',
    },
    {
      id: 'vsl_cinematic' as const,
      name: 'Cinematic VSL Tension',
      bpm: 100,
      desc: 'Sub bass pulse, suspense riser swell, deep atmospheric tension build',
      icon: Radio,
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
    },
    {
      id: 'lofi_chai' as const,
      name: 'Desi Karak Lofi Beat',
      bpm: 84,
      desc: 'Warm electric piano chords, authentic vinyl crackle, relaxed coffee shop groove',
      icon: Layers,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'synthwave' as const,
      name: 'Cyberpunk Tech Promo',
      bpm: 120,
      desc: '16th-note analog arpeggiator, punchy synth kick, retro-futuristic drive',
      icon: Cpu,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    },
    {
      id: 'luxury_ambient' as const,
      name: 'Luxury Skincare Ambient',
      bpm: 75,
      desc: 'Crystalline harmonic bells, lush reverb swells, high-end commercial atmosphere',
      icon: Sparkles,
      color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400',
    },
    {
      id: 'countdown_tension' as const,
      name: 'Urgency Countdown',
      bpm: 130,
      desc: 'Ticking mechanical stopwatch with deep heartbeat thuds for limited offers',
      icon: Clock,
      color: 'from-red-500/20 to-amber-500/20 border-red-500/30 text-red-400',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-slate-950 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">Audio & Music Synthesis Studio</h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full">
                    44.1kHz WAV
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate royalty-free rhythm beat loops and editor-ready sound effects (SFX) directly in browser memory.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Studio DAW Master Track Player */}
        <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-5 md:p-6 backdrop-blur-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                disabled={!currentTrack.audioUrl || isGenerating}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title={isPlaying ? 'Pause playback' : 'Play audio loop'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
              </button>

              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  {currentTrack.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="font-mono text-indigo-400 font-semibold">{currentTrack.bpm} BPM</span>
                  <span>•</span>
                  <span>{currentTrack.duration}s Loop</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">16-bit PCM WAV (Premiere / Resolve)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadTrack}
              disabled={!currentTrack.blob}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-purple-400" />
              Download WAV File
            </button>
          </div>

          {/* Animated Canvas Waveform Visualizer */}
          <div className="relative h-20 w-full bg-slate-950/80 rounded-xl overflow-hidden border border-white/10 p-2 flex items-center">
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={80} 
              className="w-full h-full block"
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center gap-2 text-indigo-400 text-xs font-bold">
                <Sparkles className="w-4 h-4 animate-spin" />
                Synthesizing Custom Audio PCM Samples...
              </div>
            )}
          </div>

          {/* Timeline Scrub Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{formatSeconds(currentTime)}</span>
              <span>{formatSeconds(currentTrack.duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={currentTrack.duration}
              step={0.01}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Hidden audio element for clean playback */}
          {currentTrack.audioUrl && (
            <audio
              ref={audioRef}
              src={currentTrack.audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              loop
            />
          )}
        </div>

        {/* Synthesizer Genre Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Beat Loops & Pacing Presets
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">BPM:</span>
                <input
                  type="number"
                  min={60}
                  max={180}
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value) || 120)}
                  className="w-16 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-center text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Duration:</span>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-xs cursor-pointer"
                >
                  <option value={8}>8s</option>
                  <option value={12}>12s</option>
                  <option value={15}>15s</option>
                  <option value={30}>30s</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beatStyles.map((item) => {
              const Icon = item.icon;
              const isSelected = style === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setStyle(item.id);
                    setBpm(item.bpm);
                    generateTrack(item.id, item.bpm, duration);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/40 border-white/[0.08] hover:border-white/20 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} border`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        <span className="text-[11px] font-mono text-indigo-400">{item.bpm} BPM</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Video Editor SFX Library */}
        <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-5 md:p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Headphones className="w-4 h-4 text-indigo-400" />
                Instant Video Sound Effects (SFX)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click to preview immediately or download the lossless WAV for your NLE timeline.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {[
              { type: 'whoosh' as const, label: 'Fast Whoosh', icon: Zap, desc: 'Cut transition' },
              { type: 'chaching' as const, label: 'Cha-Ching', icon: DollarSign, desc: 'Offer / Cart' },
              { type: 'bass_drop' as const, label: '808 Sub Drop', icon: ArrowDownCircle, desc: 'Hook impact' },
              { type: 'pop' as const, label: 'Bubble Pop', icon: CircleDot, desc: 'Sticker appearance' },
              { type: 'shutter' as const, label: 'Camera Click', icon: Camera, desc: 'Social proof' },
              { type: 'glitch' as const, label: 'Cyber Glitch', icon: Activity, desc: 'Pattern interrupt' },
              { type: 'ding' as const, label: 'Crystal Bell', icon: Bell, desc: 'Notification ping' },
            ].map((sfx) => {
              const Icon = sfx.icon;
              const isPlayingThis = playingSfx === sfx.type;
              return (
                <div
                  key={sfx.type}
                  className="bg-slate-950/60 border border-white/[0.08] hover:border-indigo-500/40 rounded-xl p-3 flex flex-col justify-between space-y-3 group transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isPlayingThis ? 'text-indigo-400 animate-bounce' : 'text-slate-400'}`} />
                      <button
                        onClick={() => downloadSfx(sfx.type)}
                        className="text-slate-500 hover:text-white transition-colors"
                        title="Download WAV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {sfx.label}
                    </p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {sfx.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => triggerSfx(sfx.type)}
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                      isPlayingThis
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
