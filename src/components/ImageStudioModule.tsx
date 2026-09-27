import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Wand2, 
  Eye, 
  Maximize2, 
  Sliders, 
  Palette, 
  RefreshCw,
  Zap,
  Tag,
  Shield,
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface GeneratedImageItem {
  id: string;
  prompt: string;
  headline: string;
  badge: string;
  headlineColor: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  style: string;
  timestamp: string;
  imageUrl: string;
  seed?: number;
}

export const ImageStudioModule: React.FC = () => {
  const [prompt, setPrompt] = useState('Luxury skincare serum bottle on obsidian stone pedestal with water droplets and golden volumetric lighting');
  const [headline, setHeadline] = useState('VIRAL ON TIKTOK');
  const [badge, setBadge] = useState('⚡ 50% OFF TODAY');
  const [headlineColor, setHeadlineColor] = useState<'yellow' | 'white' | 'green' | 'red'>('yellow');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [style, setStyle] = useState('TikTok Ad Hook Thumbnail');
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Gallery of generated images
  const [gallery, setGallery] = useState<GeneratedImageItem[]>([
    {
      id: 'img-1',
      prompt: 'GlowRevive Microcurrent facial sculptor wand glowing with soft red LED light next to dewy fresh skin, commercial 8k advertising',
      headline: 'VIRAL ON TIKTOK',
      badge: '⭐ 4.9/5 RATED',
      headlineColor: 'yellow',
      aspectRatio: '9:16',
      style: 'TikTok Ad Hook Thumbnail',
      timestamp: '2 mins ago',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'img-2',
      prompt: 'Split screen before and after facial contouring, sharp jawline comparison with high contrast clinical arrows',
      headline: 'DAY 1 VS DAY 14',
      badge: '🔥 10,000+ ORDERS',
      headlineColor: 'green',
      aspectRatio: '9:16',
      style: 'Before/After Comparison',
      timestamp: '15 mins ago',
      imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9e07e8a?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'img-3',
      prompt: 'Instant Karak Chai sachet pouring rich steaming cardamom tea into traditional clay matka cup, warm cafe atmosphere',
      headline: 'OFFICE MEIN 4 BAJE?',
      badge: '☕ PURE CARDAMOM',
      headlineColor: 'yellow',
      aspectRatio: '1:1',
      style: 'Desi UGC Aesthetic',
      timestamp: '1 hour ago',
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'img-4',
      prompt: 'Cinematic financial trading chart with glowing heatmaps and dark cyberpunk neon interface with upward candlestick surge',
      headline: 'THE 7-FIGURE MECHANISM',
      badge: '🚨 SECRET ALGO',
      headlineColor: 'green',
      aspectRatio: '16:9',
      style: 'VSL Proof Slide',
      timestamp: '3 hours ago',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    },
  ]);

  const [selectedImage, setSelectedImage] = useState<GeneratedImageItem>(gallery[0]);

  // Enhance prompt with Gemini
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/generate/enhance-image-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roughPrompt: prompt, style, headline }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.enhancedPrompt) {
          setPrompt(data.data.enhancedPrompt);
        }
        if (data.data?.recommendedHeadline) {
          setHeadline(data.data.recommendedHeadline);
        }
      }
    } catch (err) {
      console.warn('Enhance failed:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate new AI image visual
  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          style,
          headline: headline.trim() || 'STOP SCROLLING',
        }),
      });

      let finalUrl = '';
      if (res.ok) {
        const data = await res.json();
        finalUrl = data.imageUrl || data.fallbackUrl;
      } else {
        // Fallback
        const seed = Math.floor(Math.random() * 999999);
        const w = aspectRatio === '9:16' ? 768 : aspectRatio === '16:9' ? 1280 : 1024;
        const h = aspectRatio === '9:16' ? 1344 : aspectRatio === '16:9' ? 720 : 1024;
        finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ', ' + style + ', commercial product photography')}?width=${w}&height=${h}&seed=${seed}&nologo=true`;
      }

      const newImg: GeneratedImageItem = {
        id: `img-${Date.now()}`,
        prompt: prompt.trim(),
        headline: headline.trim() || 'STOP SCROLLING',
        badge: badge.trim() || '⚡ 50% OFF TODAY',
        headlineColor,
        aspectRatio,
        style,
        timestamp: 'Just now',
        imageUrl: finalUrl,
      };

      setGallery((prev) => [newImg, ...prev]);
      setSelectedImage(newImg);
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download high-resolution composite canvas image
  const handleDownloadComposite = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.naturalWidth || 1080;
      canvas.height = img.naturalHeight || 1920;
      
      // Draw base image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Gradient overlay at top for text readability
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.4);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);

      // Draw Badge sticker
      if (selectedImage.badge) {
        ctx.font = 'bold 36px sans-serif';
        const badgeText = selectedImage.badge;
        const textWidth = ctx.measureText(badgeText).width;
        const px = (canvas.width - textWidth - 48) / 2;
        const py = canvas.height * 0.08;

        ctx.fillStyle = '#dc2626'; // red sticker
        ctx.beginPath();
        ctx.roundRect(px, py - 36, textWidth + 48, 54, 12);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(badgeText, px + 24, py + 4);
      }

      // Draw Headline sticker
      if (selectedImage.headline) {
        ctx.font = '900 68px sans-serif';
        ctx.textAlign = 'center';
        
        const hx = canvas.width / 2;
        const hy = canvas.height * 0.18;

        // Shadow / Stroke
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 14;
        ctx.strokeText(selectedImage.headline, hx, hy);

        // Fill color
        const colorMap: Record<string, string> = {
          yellow: '#facc15',
          white: '#ffffff',
          green: '#4ade80',
          red: '#f87171',
        };
        ctx.fillStyle = colorMap[selectedImage.headlineColor] || '#facc15';
        ctx.fillText(selectedImage.headline, hx, hy);
      }

      // Download
      const link = document.createElement('a');
      link.download = `Ad_Visual_${selectedImage.headline.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.onerror = () => {
      // Direct download fallback
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = selectedImage.imageUrl;
      link.download = `CineFlow_Ad_${selectedImage.id}.jpg`;
      link.click();
    };

    img.src = selectedImage.imageUrl;
  };

  const headlineColorClasses = {
    yellow: 'text-amber-300 drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]',
    white: 'text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]',
    green: 'text-emerald-400 drop-shadow-[0_4px_12px_rgba(16,185,129,0.6)]',
    red: 'text-rose-400 drop-shadow-[0_4px_12px_rgba(244,63,94,0.6)]',
  };

  const presetHooks = [
    {
      label: '⚡ TikTok 3s Hook',
      prompt: 'Viral beauty device gliding over cheek with microcurrent light, macro skin texture, high fashion studio lighting',
      headline: 'VIRAL ON TIKTOK',
      badge: '⭐ 4.9/5 RATED',
      style: 'TikTok Ad Hook Thumbnail',
    },
    {
      label: '🧴 Skincare Luxury',
      prompt: 'Gold glass serum dropper bottle suspended over dark volcanic stone with crystal water ripples and golden dust rays',
      headline: 'VISIBLY PLUMPED IN 3 MINS',
      badge: '⚡ 50% OFF TODAY',
      style: 'Photorealistic Luxury E-Com',
    },
    {
      label: '🍵 Desi Karak Chai',
      prompt: 'Steaming clay matka cup overflowing with rich creamy cardamom tea on rustic wooden table with fresh tea leaves',
      headline: 'OFFICE MEIN 4 BAJE?',
      badge: '🇵🇰 AUTHENTIC KARAK',
      style: 'Desi UGC Aesthetic',
    },
    {
      label: '📊 VSL Proof Slide',
      prompt: 'Dark obsidian tablet displaying glowing green profit chart surge with 3D floating crypto and currency metrics',
      headline: 'THE 7-FIGURE MECHANISM',
      badge: '🚨 SECRET METHOD',
      style: 'VSL Proof Slide',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-slate-950 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">AI Ad Visual & Thumbnail Studio</h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-full">
                    FLUX 8K
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate 9:16 scroll-stopping video thumbnails, before/after proof graphics, and product hero shots.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSafeZone(!showSafeZone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showSafeZone
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              TikTok Safe Zones {showSafeZone ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Quick Style Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 whitespace-nowrap pl-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Presets:
          </span>
          {presetHooks.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(preset.prompt);
                setHeadline(preset.headline);
                setBadge(preset.badge);
                setStyle(preset.style);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/[0.08] hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-all hover:bg-slate-800/80 active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-5 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-400" />
                  Visual Generator Specs
                </h2>
                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                  title="Enhance prompt with cinematic advertising photographer language"
                >
                  <Sparkles className={`w-3 h-3 ${isEnhancing ? 'animate-spin' : ''}`} />
                  {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Visual Prompt / Scene Description *
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe lighting, product, model, props, studio background..."
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans transition-colors"
                />
              </div>

              {/* On-Screen Overlays */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Headline Hook Text
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. STOP SCROLLING"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold tracking-wide uppercase focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Sticker / Badge Text
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. 50% OFF TODAY"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-rose-300 font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="9:16">9:16 TikTok / Reels</option>
                    <option value="1:1">1:1 Square Feed</option>
                    <option value="16:9">16:9 YouTube / VSL</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Headline Color</label>
                  <select
                    value={headlineColor}
                    onChange={(e) => setHeadlineColor(e.target.value as any)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="yellow">Yellow Gold</option>
                    <option value="white">Pure White</option>
                    <option value="green">Neon Green</option>
                    <option value="red">Vibrant Red</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-medium text-slate-300 block mb-1">Visual Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="TikTok Ad Hook Thumbnail">TikTok Hook</option>
                    <option value="Before/After Comparison">Before/After</option>
                    <option value="Photorealistic Luxury E-Com">Luxury E-Com</option>
                    <option value="Desi UGC Aesthetic">Desi UGC</option>
                    <option value="VSL Proof Slide">VSL Slide</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Rendering High-Res Ad Visual (FLUX)...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate AI Visual & Thumbnail
                  </>
                )}
              </button>
            </div>

            {/* Editor Hook Tips */}
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 space-y-2">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Performance Creative Tip
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                On TikTok & Meta Reels, ads with <span className="text-amber-400 font-bold">large contrast text headlines</span> in the upper third achieve an average of <span className="text-emerald-400 font-bold">2.4x higher 3-second hook retention</span>.
              </p>
            </div>
          </div>

          {/* Interactive Live Ad Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-4 md:p-6 backdrop-blur-xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-400" />
                    Live Ad Mockup Preview
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-white/[0.06]">
                    {selectedImage.aspectRatio}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadComposite}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                    title="Download high-resolution image with overlays baked in"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Ad Image
                  </button>
                </div>
              </div>

              {/* Mockup Frame */}
              <div 
                className={`relative rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-black flex items-center justify-center transition-all ${
                  selectedImage.aspectRatio === '9:16'
                    ? 'w-[280px] sm:w-[320px] aspect-[9/16]'
                    : selectedImage.aspectRatio === '16:9'
                    ? 'w-full aspect-[16/9]'
                    : 'w-[320px] sm:w-[360px] aspect-square'
                }`}
              >
                {/* Main Rendered Image */}
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="w-full h-full object-cover select-none"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay for text visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

                {/* Badge Sticker */}
                {selectedImage.badge && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase shadow-lg shadow-rose-600/50 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {selectedImage.badge}
                    </span>
                  </div>
                )}

                {/* Headline Hook Overlay */}
                {selectedImage.headline && (
                  <div className="absolute top-12 sm:top-14 inset-x-3 text-center z-10">
                    <h2 
                      className={`text-lg sm:text-xl font-black uppercase tracking-tight text-center leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] ${
                        headlineColorClasses[selectedImage.headlineColor as keyof typeof headlineColorClasses] || headlineColorClasses.yellow
                      }`}
                    >
                      {selectedImage.headline}
                    </h2>
                  </div>
                )}

                {/* TikTok UI Safe Zone Simulation Overlay */}
                {showSafeZone && (
                  <div className="absolute inset-0 z-20 pointer-events-none border border-dashed border-red-500/40">
                    {/* Right side icons */}
                    <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3 text-white/70 text-[10px]">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">❤️</div>
                      <span>42.8k</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">💬</div>
                      <span>1,204</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">↪️</div>
                      <span>Share</span>
                    </div>

                    {/* Bottom username & sound */}
                    <div className="absolute left-3 bottom-6 max-w-[200px] text-white/80 space-y-1">
                      <p className="text-[11px] font-bold">@brand_official</p>
                      <p className="text-[10px] text-white/60 line-clamp-1">Original sound - Viral Sound FX</p>
                    </div>

                    <div className="absolute top-2 right-2 bg-red-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Safe Zone
                    </div>
                  </div>
                )}

                {/* Bottom Style Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300 z-10">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 font-mono">
                    {selectedImage.style}
                  </span>
                  <span className="text-white/60 text-[9px]">
                    {selectedImage.timestamp}
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Gallery Strip */}
            <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-4 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Recent Visuals ({gallery.length})
                </span>
                <span className="text-[11px] text-slate-500">
                  Click any card to load into mockup
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage(item)}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all ${
                      selectedImage.id === item.id
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                      <p className="text-[10px] font-bold text-amber-300 truncate">
                        {item.headline}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        {item.style}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
