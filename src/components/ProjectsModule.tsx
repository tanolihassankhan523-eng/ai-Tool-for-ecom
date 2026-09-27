import React, { useState } from 'react';
import { Project, VideoType } from '../types';
import { 
  FolderKanban, 
  Plus, 
  Clock, 
  CheckCircle, 
  Layers, 
  ArrowRight, 
  FileText, 
  Trash2, 
  Tag, 
  Globe 
} from 'lucide-react';

interface ProjectsModuleProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onAddProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onOpenChatWithProject: (projectId: string) => void;
  onOpenBriefAnalyzerWithProject: (projectId: string) => void;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
  onOpenChatWithProject,
  onOpenBriefAnalyzerWithProject,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // New Project Form
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [brandNiche, setBrandNiche] = useState('Skincare & Beauty Tech');
  const [videoType, setVideoType] = useState<VideoType>('dtc');
  const [targetPlatform, setTargetPlatform] = useState('TikTok & Instagram Reels (9:16)');
  const [primaryLanguage, setPrimaryLanguage] = useState('English');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [targetLengthSec, setTargetLengthSec] = useState(30);
  const [brandGuidelines, setBrandGuidelines] = useState('');
  const [rawBrief, setRawBrief] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      clientName: clientName.trim() || 'Internal Client',
      brandNiche,
      videoType,
      targetPlatform,
      primaryLanguage,
      aspectRatio,
      targetLengthSec,
      brandGuidelines,
      deliverablesNotes: `Target ${durationSecText(targetLengthSec)} ad in ${aspectRatio} format.`,
      rawBrief: rawBrief.trim() || undefined,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddProject(newProject);
    setIsFormOpen(false);
    // Reset
    setTitle('');
    setClientName('');
    setBrandGuidelines('');
    setRawBrief('');
  };

  const durationSecText = (sec: number) => {
    if (sec >= 60) return `${Math.round(sec / 60)} min`;
    return `${sec}s`;
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto p-4 md:p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FolderKanban className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-white">Client Projects & Briefs Workspace</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Organize video editing projects by client, deliverable specs, language, and brand guidelines.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isFormOpen ? 'Cancel' : 'New Project'}</span>
          </button>
        </div>

        {/* New Project Form */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              Create Video Editing Project
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Project / Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GlowSerum Spring Scaling Ad"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Client / Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. LuxeDerm / Karachi Chai Co"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Niche / Category</label>
                <input
                  type="text"
                  placeholder="e.g. Skincare, Fitness, Gadgets, SaaS"
                  value={brandNiche}
                  onChange={(e) => setBrandNiche(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Video Type</label>
                <select
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value as VideoType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="dtc">DTC Ad (TikTok/Reels)</option>
                  <option value="vsl">VSL (Video Sales Letter)</option>
                  <option value="ugc">UGC / Avatar Video</option>
                  <option value="animation">Cartoon / Animation</option>
                  <option value="music_video">Music Video</option>
                  <option value="social_promo">Social Promo</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Language</label>
                <select
                  value={primaryLanguage}
                  onChange={(e) => setPrimaryLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="English">English</option>
                  <option value="Roman Urdu">Roman Urdu</option>
                  <option value="Urdu">Urdu (اردو)</option>
                  <option value="Bilingual">Bilingual</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="9:16">9:16 Vertical</option>
                  <option value="16:9">16:9 Widescreen</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="4:5">4:5 Feed Portrait</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Length (Sec)</label>
                <input
                  type="number"
                  value={targetLengthSec}
                  onChange={(e) => setTargetLengthSec(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Guidelines & Restrictions</label>
              <textarea
                rows={2}
                placeholder="Colors, font styles, pacing rules, legal restrictions (e.g. no medical claims)..."
                value={brandGuidelines}
                onChange={(e) => setBrandGuidelines(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Raw Client Brief / Notes</label>
              <textarea
                rows={3}
                placeholder="Paste original client brief here (can be analyzed automatically)..."
                value={rawBrief}
                onChange={(e) => setRawBrief(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
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
                Save Project
              </button>
            </div>
          </form>
        )}

        {/* Project List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                className={`bg-slate-900 rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{proj.title}</h3>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-medium">
                        {proj.clientName} • <span className="text-indigo-400">{proj.brandNiche}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
                      {proj.videoType.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-mono">
                      {proj.aspectRatio}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                      {durationSecText(proj.targetLengthSec)}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 text-xs">
                      {proj.primaryLanguage}
                    </span>
                  </div>

                  {/* Brand Guidelines excerpt */}
                  {proj.brandGuidelines && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <strong className="text-slate-300">Rules:</strong> {proj.brandGuidelines}
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 cursor-default'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 cursor-pointer'
                    }`}
                  >
                    {isActive ? 'Current Project' : 'Set as Active'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenBriefAnalyzerWithProject(proj.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                      title="Open in Brief Analyzer"
                    >
                      <FileText className="w-3.5 h-3.5 inline mr-1 text-indigo-400" />
                      Brief
                    </button>
                    <button
                      onClick={() => onOpenChatWithProject(proj.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
                      title="Open AI Chat for this project"
                    >
                      Chat
                      <ArrowRight className="w-3 h-3 inline ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
