import React, { useState } from 'react';
import { MetaAdRecord } from '../types';
import { 
  TrendingUp, 
  ExternalLink, 
  Plus, 
  Sparkles, 
  Lightbulb, 
  Eye, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Search, 
  Copy, 
  Check 
} from 'lucide-react';

interface MetaAdsModuleProps {
  ads: MetaAdRecord[];
  onAddAd: (ad: MetaAdRecord) => void;
  onDeleteAd: (id: string) => void;
}

export const MetaAdsModule: React.FC<MetaAdsModuleProps> = ({
  ads,
  onAddAd,
  onDeleteAd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hypothesisResult, setHypothesisResult] = useState<any | null>(null);

  // New Ad Form State
  const [brandName, setBrandName] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [hookPattern, setHookPattern] = useState('');
  const [offerFormat, setOfferFormat] = useState('');
  const [videoFormat, setVideoFormat] = useState('9:16 Vertical UGC');
  const [visualPatterns, setVisualPatterns] = useState('');
  const [ctaUsed, setCtaUsed] = useState('Shop Now');
  const [observedDetails, setObservedDetails] = useState('');
  const [editorNotes, setEditorNotes] = useState('');

  const filteredAds = ads.filter(
    (a) =>
      a.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.hookPattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.observedDetails.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !observedDetails.trim()) return;

    const newAd: MetaAdRecord = {
      id: `ad-${Date.now()}`,
      brandName,
      adUrl: adUrl.trim() || 'https://www.facebook.com/ads/library/',
      dateChecked: new Date().toISOString().split('T')[0],
      hookPattern,
      offerFormat,
      videoFormat,
      visualPatterns,
      ctaUsed,
      observedDetails,
      editorNotes,
      creativeHypothesis: `Test variation against ${brandName}'s hook with an inverted speed ramp.`,
    };

    onAddAd(newAd);
    setIsFormOpen(false);
    // Reset form
    setBrandName('');
    setAdUrl('');
    setHookPattern('');
    setOfferFormat('');
    setVisualPatterns('');
    setObservedDetails('');
    setEditorNotes('');
  };

  const handleGenerateHypotheses = async (ad: MetaAdRecord) => {
    setIsAnalyzing(true);
    setHypothesisResult(null);
    try {
      const res = await fetch('/api/meta-ads/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: ad.brandName,
          adUrl: ad.adUrl,
          observedHooks: ad.hookPattern,
          visualPatterns: ad.visualPatterns,
          offerDetails: ad.offerFormat,
          editorNotes: ad.editorNotes,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setHypothesisResult({ adId: ad.id, ...data.data });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto p-4 md:p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-white">Meta Ads Research & Creative Intelligence</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Track competitor ads from the Meta Ad Library, catalog winning hooks, and engineer high-retention creative hypotheses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.facebook.com/ads/library/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
            >
              <span>Meta Ad Library</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isFormOpen ? 'Close Form' : 'Log Competitor Ad'}</span>
            </button>
          </div>
        </div>

        {/* New Competitor Ad Form Modal / Collapsible */}
        {isFormOpen && (
          <form onSubmit={handleSubmitAd} className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              Log Meta Ad Library Finding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ridge Wallet / Gymshark"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Ad Library URL / ID</label>
                <input
                  type="text"
                  placeholder="https://www.facebook.com/ads/library/?id=..."
                  value={adUrl}
                  onChange={(e) => setAdUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Video Format</label>
                <select
                  value={videoFormat}
                  onChange={(e) => setVideoFormat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="9:16 Vertical UGC">9:16 Vertical UGC</option>
                  <option value="9:16 Split Screen">9:16 Split Screen (Before/After)</option>
                  <option value="1:1 Square Feed">1:1 Square Feed</option>
                  <option value="16:9 Cinematic VSL">16:9 Cinematic VSL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Hook Pattern (0:00 - 0:03)</label>
                <input
                  type="text"
                  placeholder="e.g. 'Stop applying face oils like this' or Extreme zoom"
                  value={hookPattern}
                  onChange={(e) => setHookPattern(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Offer & CTA</label>
                <input
                  type="text"
                  placeholder="e.g. 50% Off Bundle | Shop Now"
                  value={offerFormat}
                  onChange={(e) => setOfferFormat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Observed Visual & Audio Patterns *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe fast cuts, sound effects, subtitles color, pacing..."
                  value={observedDetails}
                  onChange={(e) => setObservedDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Editor Notes & Remix Angles</label>
                <textarea
                  rows={2}
                  placeholder="How can we steal this structure and make it 10x punchier?"
                  value={editorNotes}
                  onChange={(e) => setEditorNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
              >
                Save to Research Library
              </button>
            </div>
          </form>
        )}

        {/* Search Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search saved competitor ads, hooks, or brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Ads Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAds.map((ad) => (
            <div key={ad.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {ad.brandName}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {ad.videoFormat}
                      </span>
                    </h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Observed: {ad.dateChecked}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={ad.adUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                      title="Open in Meta Ad Library"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onDeleteAd(ad.id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Hook Pattern */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                    0-3s Hook Pattern:
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    "{ad.hookPattern}"
                  </div>
                </div>

                {/* Observed Facts vs Notes */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-400">Visual Pattern: </span>
                    <span className="text-slate-300">{ad.visualPatterns || 'Standard dynamic cuts'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Offer: </span>
                    <span className="text-indigo-300 font-medium">{ad.offerFormat}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Observed Details: </span>
                    <span className="text-slate-300">{ad.observedDetails}</span>
                  </div>
                  {ad.editorNotes && (
                    <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-[11px]">
                      <strong>Editor Note:</strong> {ad.editorNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Derive Creative Hypothesis Action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleGenerateHypotheses(ad)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing && hypothesisResult?.adId === ad.id ? 'Deriving...' : 'Derive Test Hypotheses'}</span>
                </button>

                <span className="text-[10px] text-slate-500">
                  Evidence-based observation
                </span>
              </div>

              {/* Expanded Hypothesis Output for this card */}
              {hypothesisResult && hypothesisResult.adId === ad.id && (
                <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs space-y-3">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    AI Creative Test Hypotheses & Remix Ideas
                  </div>

                  {hypothesisResult.creativeHypothesesToTest?.map((hyp: any, i: number) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-amber-300 text-[11px] mb-1">
                        Test #{i + 1}: {hyp.testAngle}
                      </div>
                      <p className="text-slate-300 mb-1 leading-relaxed">{hyp.hypothesis}</p>
                      <div className="text-[10px] text-slate-400">
                        Metric to watch: <span className="text-indigo-400 font-mono">{hyp.metricToWatch}</span>
                      </div>
                    </div>
                  ))}

                  {hypothesisResult.remixScripts?.length > 0 && (
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Recommended Remix Angle:</span>
                      <div className="text-xs text-slate-200 mt-1">
                        <strong>{hypothesisResult.remixScripts[0].title}:</strong> {hypothesisResult.remixScripts[0].hookIdea}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
