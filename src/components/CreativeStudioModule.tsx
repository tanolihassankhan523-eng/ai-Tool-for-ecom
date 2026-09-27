import React, { useState } from 'react';
import { Project, VideoType, CreativePack } from '../types';
import { 
  Video, 
  Sparkles, 
  Clock, 
  Layers, 
  Music, 
  Type, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  FileCode, 
  Eye, 
  Volume2, 
  Scissors, 
  Sliders 
} from 'lucide-react';

interface CreativeStudioModuleProps {
  activeProject?: Project;
}

export const CreativeStudioModule: React.FC<CreativeStudioModuleProps> = ({
  activeProject,
}) => {
  const [workflowType, setWorkflowType] = useState<VideoType>(activeProject?.videoType || 'dtc');
  const [productName, setProductName] = useState(activeProject?.title || 'Viral Hydro-Glow Facial Wand');
  const [targetAudience, setTargetAudience] = useState('Women 22-38 looking for radiant skin without salon costs');
  const [coreBenefit, setCoreBenefit] = useState('Reduces morning puffiness and defines jawline in 3 minutes');
  const [hookAngle, setHookAngle] = useState('Pattern Interrupt / Reverse Application');
  const [language, setLanguage] = useState(activeProject?.primaryLanguage || 'English');
  const [durationSec, setDurationSec] = useState(activeProject?.targetLengthSec || 30);
  const [aspectRatio, setAspectRatio] = useState(activeProject?.aspectRatio || '9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [creativePack, setCreativePack] = useState<CreativePack | null>(null);
  const [copied, setCopied] = useState(false);

  const workflows: { id: VideoType; label: string; desc: string; icon: string }[] = [
    { id: 'dtc', label: 'DTC Ad (TikTok/Reels)', desc: 'Fast hook, problem-agitate, product reveal, proof, CTA', icon: '🛍️' },
    { id: 'vsl', label: 'VSL (Video Sales Letter)', desc: 'The Big Idea, unique mechanism, story arc, offer stack', icon: '📈' },
    { id: 'ugc', label: 'UGC & Avatar Video', desc: 'Authentic creator selfie, raw unboxing, b-roll cuts, captions', icon: '🤳' },
    { id: 'animation', label: 'Cartoon & Animation', desc: 'Visual storytelling, character beats, kinetic energy, gags', icon: '🎨' },
    { id: 'music_video', label: 'Music Video & Montage', desc: 'Beat-synced cuts, thematic narrative, speed ramps, visual motif', icon: '🎵' },
    { id: 'social_promo', label: 'Social Promo / Reel', desc: 'Organic feel, curiosity loop, high-retention spikes', icon: '⚡' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/creative/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowType,
          productName,
          targetAudience,
          coreBenefit,
          hookAngle,
          language,
          durationSec,
          aspectRatio,
          rawBrief: activeProject?.rawBrief || '',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCreativePack(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export to Markdown
  const exportMarkdown = () => {
    if (!creativePack) return;
    const md = `# ${productName} - Editor Production Pack
**Workflow:** ${workflowType.toUpperCase()} | **Duration:** ${durationSec}s | **Aspect Ratio:** ${aspectRatio} | **Language:** ${language}

## Summary
${creativePack.summary}
**Winning Angle:** ${creativePack.angleName}

---

## 1. Hook Variations (0:00 - 0:03)
${creativePack.hooks
  .map(
    (h, i) => `### Hook ${i + 1}: ${h.type}
- **Visual:** ${h.visual}
- **Audio / VO:** ${h.audio}
- **On-Screen Text:** "${h.onScreenText}"
- **Retention Strategy:** ${h.retentionWhy}
`
  )
  .join('\n')}

---

## 2. Timed Scene-by-Scene Script
| Timestamp | Beat | Visual Direction | Spoken Voiceover | On-Screen Text | Sound Effects |
|---|---|---|---|---|---|
${creativePack.scriptTimeline
  .map(
    (b) =>
      `| ${b.timestamp} | ${b.beatName} | ${b.visualShot} | ${b.voiceover} | ${b.onScreenText} | ${b.soundEffects} |`
  )
  .join('\n')}

---

## 3. B-Roll & Footage Shot List
${creativePack.brollShotList.map((shot) => `- [ ] ${shot}`).join('\n')}

---

## 4. Editor Instructions
- **Pacing:** ${creativePack.editorInstructions.pacing}
- **Color Grading:** ${creativePack.editorInstructions.colorGrading}
- **Text & Graphics:** ${creativePack.editorInstructions.textGraphics}
- **Audio & Loudness:** ${creativePack.editorInstructions.audioLoudness}

---

## 5. Asset Checklist & Assumptions
${creativePack.assetChecklist.map((a) => `- [ ] ${a}`).join('\n')}

### Questions / Assumptions:
${creativePack.questionsAndAssumptions.map((q) => `- ❓ ${q}`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CineFlow_Pack_${productName.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to CSV (ideal for Premiere Pro / DaVinci Resolve marker import)
  const exportCsv = () => {
    if (!creativePack) return;
    const headers = ['Timestamp', 'Beat', 'Visual Direction', 'Voiceover', 'On-Screen Text', 'Sound FX'];
    const rows = creativePack.scriptTimeline.map((s) => [
      `"${s.timestamp}"`,
      `"${s.beatName}"`,
      `"${s.visualShot.replace(/"/g, '""')}"`,
      `"${s.voiceover.replace(/"/g, '""')}"`,
      `"${s.onScreenText.replace(/"/g, '""')}"`,
      `"${s.soundEffects.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Timeline_Markers_${productName.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto p-4 md:p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Video className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-white">Video Creative Studio</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Produce editor-ready scripts, timed storyboards, hook packs, and audio cues tailored to specific video types.
            </p>
          </div>

          {creativePack && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
                title="Export as CSV for Premiere / DaVinci markers"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={exportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Pack</span>
              </button>
            </div>
          )}
        </div>

        {/* Workflow Selector Cards */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
            Select Video Format & Workflow
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {workflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => setWorkflowType(wf.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  workflowType === wf.id
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xl mb-1.5">{wf.icon}</div>
                <div>
                  <div className={`text-xs font-bold ${workflowType === wf.id ? 'text-indigo-300' : 'text-slate-200'}`}>
                    {wf.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    {wf.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Creative Parameters Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Product / Campaign Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Core Unique Benefit / Mechanism</label>
              <input
                type="text"
                value={coreBenefit}
                onChange={(e) => setCoreBenefit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Audience & Trigger</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Hook Angle / Concept</label>
              <input
                type="text"
                value={hookAngle}
                onChange={(e) => setHookAngle(e.target.value)}
                placeholder="e.g. Reverse application / Skeptic test / 3pm office slump"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Roman Urdu">Roman Urdu (Desi / Pakistani)</option>
                <option value="Urdu">Urdu (اردو)</option>
                <option value="Bilingual">Bilingual (English + Roman Urdu)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Duration</label>
              <select
                value={durationSec}
                onChange={(e) => setDurationSec(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={15}>15s (Ultra-short / Hook test)</option>
                <option value={25}>25s (TikTok / Reels Sweetspot)</option>
                <option value={30}>30s (Standard DTC ad)</option>
                <option value={45}>45s (Story / Unboxing ad)</option>
                <option value={60}>60s (Comprehensive UGC)</option>
                <option value={360}>6 Minutes (Full VSL)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="9:16">9:16 Vertical (TikTok / Reels / Shorts)</option>
                <option value="16:9">16:9 Widescreen (YouTube / VSL / Desktop)</option>
                <option value="1:1">1:1 Square (Meta Feed / Carousel)</option>
                <option value="4:5">4:5 Portrait (Instagram Feed)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Pack...' : 'Generate Pack'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generated Pack Display */}
        {creativePack && (
          <div className="space-y-6">
            {/* Strategy Header */}
            <div className="bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                Creative Strategy & Winning Angle
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{creativePack.angleName}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{creativePack.summary}</p>
            </div>

            {/* 1. Hook Variations */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                3-Second Hook Variations ({creativePack.hooks.length} Options)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {creativePack.hooks.map((hook, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {hook.type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">0:00 - 0:03</span>
                      </div>
                      <div className="text-xs font-semibold text-white mb-1.5 flex items-start gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{hook.visual}</span>
                      </div>
                      <div className="text-xs text-slate-300 mb-2 flex items-start gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="italic">"{hook.audio}"</span>
                      </div>
                      <div className="text-[11px] font-mono text-indigo-300 bg-slate-950 p-2 rounded border border-slate-800 mb-2">
                        Text: {hook.onScreenText}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <strong>Why it stops:</strong> {hook.retentionWhy}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Scene-by-Scene Timeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-indigo-400" />
                  Editor-Ready Scene Breakdown with Timestamps
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Total Beats: {creativePack.scriptTimeline.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Beat</th>
                      <th className="py-2.5 px-3">Visual & Shot Action</th>
                      <th className="py-2.5 px-3">Voiceover (Audio)</th>
                      <th className="py-2.5 px-3">On-Screen Text</th>
                      <th className="py-2.5 px-3">Sound FX</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {creativePack.scriptTimeline.map((beat, idx) => (
                      <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-indigo-400 whitespace-nowrap">
                          {beat.timestamp}
                        </td>
                        <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                          {beat.beatName}
                        </td>
                        <td className="py-3 px-3 leading-relaxed max-w-xs">
                          {beat.visualShot}
                        </td>
                        <td className="py-3 px-3 italic text-amber-200/90 leading-relaxed max-w-xs">
                          {beat.voiceover}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap max-w-xs">
                          {beat.onScreenText}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-400">
                          {beat.soundEffects}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. B-Roll list & Editor Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  B-Roll & Overlay Footage Needed
                </h4>
                <ul className="space-y-2">
                  {creativePack.brollShotList.map((shot, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      <span>{shot}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Editor Technical Instructions
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-bold text-indigo-400">Pacing: </span>
                    <span className="text-slate-300">{creativePack.editorInstructions.pacing}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-bold text-amber-400">Color Grading: </span>
                    <span className="text-slate-300">{creativePack.editorInstructions.colorGrading}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-bold text-emerald-400">Audio Loudness: </span>
                    <span className="text-slate-300">{creativePack.editorInstructions.audioLoudness}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
