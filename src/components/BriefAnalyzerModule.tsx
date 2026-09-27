import React, { useState } from 'react';
import { Project, StructuredBrief } from '../types';
import { 
  FileSearch, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ClipboardList, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  FileText 
} from 'lucide-react';

interface BriefAnalyzerModuleProps {
  activeProject?: Project;
  onApplyAnalysisToProject?: (analysis: StructuredBrief) => void;
}

export const BriefAnalyzerModule: React.FC<BriefAnalyzerModuleProps> = ({
  activeProject,
  onApplyAnalysisToProject,
}) => {
  const [briefInput, setBriefInput] = useState(activeProject?.rawBrief || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<StructuredBrief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleBriefs = [
    {
      name: 'DTC Skincare TikTok Ad',
      text: `Client: LuxeDerm USA
Product: GlowRevive Microcurrent Sculptor ($69 + Free Serum)
Goal: Cold traffic TikTok ads to scale scaling spend. Target audience is women 25-45 struggling with morning puffiness and fine lines.
Offer: 50% Off Spring Sale + Free Gua Sha bonus.
Visual musts: Show split-face before/after within first 5 seconds. Use aesthetic bathroom b-roll.
Restrictions: Do not claim it "permanently removes wrinkles" (legal issue). Use phrases like "visibly lifts" and "depuffs in 3 minutes".
Deliverables: 30-second 9:16 vertical video with 3 distinct hook openings. Missing: Need raw creator b-roll link and brand logo SVG.`,
    },
    {
      name: 'Roman Urdu DTC Chai Ad',
      text: `Client: Karachi Chai Co
Product: Instant Elaichi Karak Chai Premix (Pack of 30 sachets)
Market: Pakistan & UAE expats
Target audience: 18-35 young professionals, hostel students, tea lovers who miss authentic dhaba chai.
Hook requirement: "Office mein 4 baje ki thakawat?" or "Hostel mein dhang ki chai nahi milti?"
Language: Roman Urdu (Conversational, lively, relatable).
Offer: Buy 2 Boxes Get 1 Free + Cash on Delivery available.
Deliverable: 25s UGC reel with energetic audio cuts and punchy on-screen captions.`,
    },
    {
      name: 'FinTech Course 6-Min VSL',
      text: `Product: Apex Day-Trading Mastery Course ($497 one-time)
Goal: Convert cold YouTube and Facebook traffic into webinar signups and direct checkouts.
Target: Frustrated retail traders stuck at break-even or blowing accounts.
Core Mechanism: Proprietary Order Flow & Liquidity Heatmap system.
Deliverables: Full script broken down into Hook (0-60s), Agitation, Mechanism reveal, Social Proof Case Studies, and Final Offer Stack.
Restrictions: No unrealistic guaranteed returns claims. Disclaim trading carries financial risk.`,
    },
  ];

  const handleAnalyze = async () => {
    if (!briefInput.trim()) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/brief/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefText: briefInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAnalysis(resData.data);
        if (onApplyAnalysisToProject) {
          onApplyAnalysisToProject(resData.data);
        }
      } else {
        throw new Error(resData.error || 'Failed to parse brief JSON');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while analyzing brief');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!analysis) return;
    const md = `# Client Brief Analysis: ${analysis.productName}

## 1. Overview
- **Product Name:** ${analysis.productName}
- **Offer & Pricing:** ${analysis.offerAndPricing}
- **Target Audience:** ${analysis.targetAudience}
- **Campaign Objective:** ${analysis.campaignObjective}
- **Video Format:** ${analysis.videoType.toUpperCase()} | ${analysis.platformAndDeliverables.platform} | ${analysis.platformAndDeliverables.aspectRatio} | ${analysis.platformAndDeliverables.targetLength}

## 2. Key Benefits & Objections
${analysis.keyBenefitsAndClaims.map((b) => `- ✅ ${b}`).join('\n')}

### Objections to Counter:
${analysis.objectionsToCounter.map((o) => `- 🛡️ ${o}`).join('\n')}

- **Call to Action:** ${analysis.callToAction}

## 3. Brand Rules & Legal Restrictions
${analysis.brandRulesAndRestrictions.map((r) => `- ⚠️ ${r}`).join('\n')}

## 4. Confirmed Facts vs Assumptions
### Confirmed Facts (Guaranteed by Client):
${analysis.confirmedFacts.map((f) => `- 📌 ${f}`).join('\n')}

### Assumptions & Hypotheses (To Be Validated):
${analysis.assumptionsAndHypotheses.map((a) => `- 💡 ${a}`).join('\n')}

## 5. Flagged Contradictions & Missing Info
### Contradictions:
${analysis.flaggedContradictions.length ? analysis.flaggedContradictions.map((c) => `- 🚨 ${c}`).join('\n') : '- None detected'}

### Questions for Client:
${analysis.missingInformationQuestions.map((q) => `- ❓ ${q}`).join('\n')}

## 6. Editor Action Checklist
${analysis.editorChecklist.map((step) => `- [ ] ${step}`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Brief_Analysis_${analysis.productName.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto p-4 md:p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileSearch className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-white">Client Brief Analyzer</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Extract confirmed facts, isolate creative assumptions, flag contradictions, and generate editor checklists.
            </p>
          </div>

          {analysis && (
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </button>
            </div>
          )}
        </div>

        {/* Input Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Paste Client Brief or Raw Requirements
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Load sample:</span>
              {sampleBriefs.map((sb, idx) => (
                <button
                  key={idx}
                  onClick={() => setBriefInput(sb.text)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 border border-slate-700 transition-colors"
                >
                  {sb.name}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={briefInput}
            onChange={(e) => setBriefInput(e.target.value)}
            placeholder="Paste your client's email, Google Doc brief, Slack messages, or campaign specs here..."
            rows={6}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 font-mono resize-y"
          />

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500">
              {briefInput.length} characters entered
            </span>
            <button
              onClick={handleAnalyze}
              disabled={!briefInput.trim() || isAnalyzing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Extracting & Validating...' : 'Analyze Client Brief'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Structured Output Cards */}
        {analysis && (
          <div className="space-y-6">
            {/* 1. Core Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Product & Offer</div>
                <div className="text-base font-bold text-white mb-1">{analysis.productName}</div>
                <div className="text-xs text-indigo-300 font-medium">{analysis.offerAndPricing}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target Audience & Market</div>
                <p className="text-xs text-slate-300 leading-relaxed">{analysis.targetAudience}</p>
                <div className="mt-2 text-[11px] text-amber-400 font-medium">Goal: {analysis.campaignObjective}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Deliverables & Specs</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                    {analysis.platformAndDeliverables.aspectRatio}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-semibold">
                    {analysis.platformAndDeliverables.targetLength}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                    {analysis.platformAndDeliverables.platform}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2 font-medium">
                  {analysis.platformAndDeliverables.deliverablesCount}
                </div>
              </div>
            </div>

            {/* 2. Confirmed Facts vs Assumptions (Crucial Requirement) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Confirmed Facts */}
              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Confirmed Facts</h3>
                    <span className="text-[11px] text-emerald-400">Explicitly guaranteed by client</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {analysis.confirmedFacts.map((fact, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assumptions & Hypotheses */}
              <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Creative Assumptions & Hypotheses</h3>
                    <span className="text-[11px] text-amber-400">Needs validation from client / testing</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {analysis.assumptionsAndHypotheses.map((assump, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                      <span>{assump}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Contradictions & Missing Information (Safety Guard) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contradictions */}
              <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Flagged Contradictions</h3>
                    <span className="text-[11px] text-rose-400">Conflicting requests detected in brief</span>
                  </div>
                </div>
                {analysis.flaggedContradictions.length === 0 ? (
                  <div className="text-xs text-slate-400 italic bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                    No direct contradictions detected. Brief specifications align logically.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {analysis.flaggedContradictions.map((c, idx) => (
                      <li key={idx} className="text-xs text-rose-200 flex items-start gap-2 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/40">
                        <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Missing Information Questions */}
              <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Questions for Client</h3>
                    <span className="text-[11px] text-indigo-400">Ask these before starting the edit</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {analysis.missingInformationQuestions.map((q, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-indigo-400 font-bold">Q{idx + 1}:</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Benefits, Rules & Editor Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-white mb-2">Key Benefits & Claims</div>
                <ul className="space-y-1.5">
                  {analysis.keyBenefitsAndClaims.map((b, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-indigo-300">
                  <strong>CTA:</strong> {analysis.callToAction}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-white mb-2">Brand Rules & Restrictions</div>
                <ul className="space-y-1.5">
                  {analysis.brandRulesAndRestrictions.map((r, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="text-amber-400">⚠</span> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-indigo-400" />
                  Editor Action Checklist
                </div>
                <ul className="space-y-1.5">
                  {analysis.editorChecklist.map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <input type="checkbox" className="rounded border-slate-700 text-indigo-600 focus:ring-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
