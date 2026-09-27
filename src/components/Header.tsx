import React, { useState, useRef, useEffect } from 'react';
import { Project, AppSettings, LanguageCode, UserProfile, AIProvider } from '../types';
import { AVAILABLE_MODELS } from '../data/models';
import { 
  Menu, 
  X, 
  Sparkles, 
  FolderKanban, 
  Cpu, 
  Sun, 
  Moon, 
  Globe, 
  User, 
  ChevronDown, 
  Check, 
  Terminal, 
  ShieldCheck, 
  Activity, 
  Layers 
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenPhpHub: () => void;
  onOpenDashboard: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuth,
  projects,
  activeProjectId,
  onSelectProject,
  settings,
  onUpdateSettings,
  onOpenPhpHub,
  onOpenDashboard,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const projectMenuRef = useRef<HTMLDivElement>(null);

  const currentModel = AVAILABLE_MODELS.find(m => m.id === settings.selectedModel) || AVAILABLE_MODELS[0];
  const activeProject = projects.find(p => p.id === activeProjectId);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    onUpdateSettings({ uiTheme: settings.uiTheme === 'dark' ? 'light' : 'dark' });
  };

  const handleSelectModel = (modelId: string) => {
    const m = AVAILABLE_MODELS.find(item => item.id === modelId);
    if (m) {
      onUpdateSettings({
        selectedModel: m.id,
        activeProvider: m.provider,
      });
    }
    setModelDropdownOpen(false);
  };

  return (
    <header className="h-13 border-b border-zinc-800/60 bg-[#0d0f12]/95 backdrop-blur-xl px-3 sm:px-5 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Left: Mobile hamburger + CineFlow Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <div 
          onClick={onOpenDashboard}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-sm tracking-tighter">CF</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">CineFlow</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                SaaS
              </span>
            </div>
          </div>
        </div>

        {/* Workspace / Project Quick Switcher */}
        <div className="relative ml-2 sm:ml-4 hidden sm:block" ref={projectMenuRef}>
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition-all"
          >
            <FolderKanban className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="max-w-[130px] md:max-w-[170px] truncate">
              {activeProject ? activeProject.title : 'Global Studio'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute top-10 left-0 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
                Active Client Project
              </div>
              <button
                onClick={() => {
                  onSelectProject('');
                  setProjectDropdownOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  !activeProjectId ? 'bg-indigo-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Global Studio (No Project)</span>
                {!activeProjectId && <Check className="w-3.5 h-3.5" />}
              </button>
              <div className="my-1 border-t border-slate-800"></div>
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {projects.map((p) => {
                  const isSelected = p.id === activeProjectId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p.id);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-indigo-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{p.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center/Right: AI Model Selector & Status */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Model Selector Pill (ChatGPT & Claude style) */}
        <div className="relative" ref={modelMenuRef}>
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 border border-white/[0.08] hover:border-white/[0.15] text-xs text-slate-200 transition-all cursor-pointer shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-100 hidden xs:inline">{currentModel.name}</span>
            <span className="font-semibold text-slate-100 xs:hidden">{currentModel.provider}</span>
            <span className="text-[10px] text-indigo-400 font-mono hidden md:inline">({currentModel.badge})</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Model Selection Menu */}
          {modelDropdownOpen && (
            <div className="absolute top-10 right-0 sm:right-auto sm:left-0 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 flex items-center justify-between">
                <span>Select AI Intelligence Engine</span>
                <span className="text-emerald-400 font-normal">Online</span>
              </div>
              <div className="space-y-1 max-h-72 overflow-y-auto mt-1">
                {AVAILABLE_MODELS.map((m) => {
                  const isSelected = m.id === currentModel.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelectModel(m.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-medium shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="font-semibold flex items-center gap-1.5">
                          <span className="truncate">{m.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-400'
                          }`}>
                            {m.badge}
                          </span>
                        </div>
                        <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {m.description}
                        </p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="relative hidden md:flex items-center">
          <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
          <select
            value={settings.preferredLanguage}
            onChange={(e) => onUpdateSettings({ preferredLanguage: e.target.value as LanguageCode })}
            className="pl-6 pr-2 py-1 rounded-lg bg-slate-900 border border-white/[0.08] text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            title="Preferred Language"
          >
            <option value="roman_urdu">Roman Urdu</option>
            <option value="en">English</option>
            <option value="ur">اردو</option>
          </select>
        </div>

        {/* XAMPP & PHP Hub Button */}
        <button
          onClick={onOpenPhpHub}
          className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-white/[0.08] text-xs font-medium transition-colors"
          title="XAMPP & PHP 8 Backend Hub"
        >
          <Terminal className="w-3 h-3 text-amber-400" />
          <span>XAMPP Hub</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-white/[0.08] transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {settings.uiTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
        </button>

        {/* User Account Button */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 border border-white/[0.08] hover:border-white/[0.15] text-xs text-slate-200 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
            {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:inline font-medium text-xs truncate max-w-[80px]">
            {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
          </span>
          <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
            {currentUser?.isGuest ? 'Guest' : 'Pro'}
          </span>
        </button>
      </div>
    </header>
  );
};
