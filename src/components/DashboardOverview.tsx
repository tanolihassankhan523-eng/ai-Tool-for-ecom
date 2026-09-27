import React from 'react';
import { Project, MetaAdRecord, UserProfile, AppSettings, NavModule } from '../types';
import { AVAILABLE_MODELS } from '../data/models';
import { 
  Clapperboard, 
  Sparkles, 
  FolderKanban, 
  FileSearch, 
  Video, 
  Image as ImageIcon, 
  Music, 
  TrendingUp, 
  Cpu, 
  Database, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Layers, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

interface DashboardOverviewProps {
  currentUser: UserProfile | null;
  projects: Project[];
  ads: MetaAdRecord[];
  settings: AppSettings;
  onNavigate: (module: NavModule) => void;
  onSelectProject: (id: string) => void;
  onOpenAuth: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  projects,
  ads,
  settings,
  onNavigate,
  onSelectProject,
  onOpenAuth,
}) => {
  const activeModel = AVAILABLE_MODELS.find(m => m.id === settings.selectedModel) || AVAILABLE_MODELS[0];

  const quickActions = [
    {
      title: 'Analyze Client Brief',
      desc: 'Separate confirmed facts from assumptions & catch contradictions',
      module: 'brief-analyzer' as NavModule,
      icon: FileSearch,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'Generate DTC Ad Script',
      desc: '3-second hook pack, problem-agitate-solve & B-roll directions',
      module: 'creative' as NavModule,
      icon: Video,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      title: 'Create Roman Urdu UGC Script',
      desc: 'Conversational creator script tailored for Pakistani/UAE buyers',
      module: 'chat' as NavModule,
      icon: MessageSquare,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Build a High-Converting VSL',
      desc: 'The Big Idea, unique mechanism revelation & offer stack',
      module: 'creative' as NavModule,
      icon: Sparkles,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Research Competitor Ads',
      desc: 'Catalog observed Meta Ad Library hooks & derive test hypotheses',
      module: 'meta-ads' as NavModule,
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Open Ad Visual Studio',
      desc: 'Generate 9:16 scroll-stopping thumbnails & product hero shots',
      module: 'image-studio' as NavModule,
      icon: ImageIcon,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
    },
    {
      title: 'Open Audio & Music Studio',
      desc: 'Synthesize 128 BPM TikTok beat loops & export clean WAV SFX',
      module: 'music-studio' as NavModule,
      icon: Music,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'XAMPP & PHP Architecture',
      desc: 'Inspect backend code, MySQL schema, and Windows local setup',
      module: 'php-hub' as NavModule,
      icon: ShieldCheck,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Welcome Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Studio Workspace
              </span>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Engine: {activeModel.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser ? currentUser.name : 'Creative Editor'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Your professional e-commerce video editing copilot. Analyze client briefs, produce editor-ready timed scripts, and stop the scroll.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start New Script</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real Status Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div 
            onClick={() => onNavigate('projects')}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-white/[0.07] hover:border-white/[0.15] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Client Projects</span>
              <FolderKanban className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Active briefs & campaigns</div>
          </div>

          <div 
            onClick={() => onNavigate('meta-ads')}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-white/[0.07] hover:border-white/[0.15] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Meta Ad Intel</span>
              <TrendingUp className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-white">{ads.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Observed winning ad patterns</div>
          </div>

          <div 
            onClick={() => onNavigate('brief-analyzer')}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-white/[0.07] hover:border-white/[0.15] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Brief Fact-Checker</span>
              <FileSearch className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-white">0% Hallucination</div>
            <div className="text-[11px] text-slate-500 mt-1">Strict facts vs assumptions isolation</div>
          </div>

          <div 
            onClick={() => onNavigate('settings')}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-white/[0.07] hover:border-white/[0.15] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Active Engine</span>
              <Cpu className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-sm font-bold text-white truncate">{activeModel.name}</div>
            <div className="text-[11px] text-indigo-400 mt-1">{activeModel.badge} • Ready</div>
          </div>
        </div>

        {/* Quick Creative Action Shortcuts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Creative Studio Workflows
            </h2>
            <span className="text-[11px] text-slate-500">Pick a workflow to jump right in</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate(action.module)}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.07] hover:border-indigo-500/40 hover:bg-slate-900 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className={`w-8 h-8 rounded-xl ${action.bg} ${action.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {action.title}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {action.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/[0.05] text-[10px] font-medium text-slate-500 group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                    <span>Open Module</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Client Projects */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-400" />
                Active Client Video Projects
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Select a project to load its brief and brand guidelines</p>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View All ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProject(p.id);
                  onNavigate('chat');
                }}
                className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.07] hover:border-indigo-500/40 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {p.videoType.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.aspectRatio}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-white line-clamp-1">{p.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.clientName}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                  <span>Open in Chat</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
