import React, { useState } from 'react';
import { NavModule, UserProfile } from '../types';
import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  FileSearch,
  Video,
  Image as ImageIcon,
  Music,
  Database,
  TrendingUp,
  HelpCircle,
  Settings,
  Code2,
  Plus,
  Search,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  X
} from 'lucide-react';

interface SidebarProps {
  activeModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  activeProjectTitle?: string;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onNewChat: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  activeProjectTitle,
  currentUser,
  onOpenAuth,
  onNewChat,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chatSearch, setChatSearch] = useState('');

  // Editor conversation history
  const recentSessions: { id: string; title: string; time: string }[] = [
    { id: 'sess-1', title: 'GlowRevive 3s Hook Retention', time: 'Today' },
    { id: 'sess-2', title: 'Karachi Chai Roman Urdu UGC', time: 'Yesterday' },
    { id: 'sess-3', title: 'ApexTrader 6-Min VSL Breakdown', time: 'Previous 7 Days' },
  ];

  const filteredSessions = recentSessions.filter(s => 
    s.title.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const navItems: { id: NavModule; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, badge: 'Claude & GPT' },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'brief-analyzer', label: 'Brief Analyzer', icon: FileSearch, badge: 'Smart' },
    { id: 'creative', label: 'Creative Studio', icon: Video, badge: 'Pro' },
    { id: 'image-studio', label: 'Image Studio', icon: ImageIcon, badge: 'FLUX' },
    { id: 'music-studio', label: 'Audio & Music Studio', icon: Music, badge: 'SFX' },
    { id: 'meta-ads', label: 'Meta Ads Research', icon: TrendingUp },
    { id: 'library', label: 'Knowledge Base', icon: Database },
    { id: 'faqs', label: 'FAQs & Rules', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'php-hub', label: 'XAMPP & PHP Hub', icon: Code2, badge: 'PHP 8' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-[#111317] border-r border-zinc-800/60 select-none font-sans">
      {/* Top Header & New Chat button */}
      <div className="p-3 space-y-2.5">
        {/* Workspace Title & Collapse Toggle */}
        <div className="flex items-center justify-between px-1.5 py-1">
          <div className="flex items-center gap-2">
            {!isCollapsed && (
              <span className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
                Studio Workspace
              </span>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimalist "New Chat" Pill (ChatGPT / Claude signature style) */}
        <button
          onClick={() => {
            onNewChat();
            if (activeModule !== 'chat') {
              onSelectModule('chat');
            }
          }}
          className={`w-full py-2 px-3 rounded-xl border border-zinc-700/60 hover:border-zinc-600 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer ${
            isCollapsed ? 'p-2' : ''
          }`}
          title="Start new conversation"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-300" />
          {!isCollapsed && <span>New Chat</span>}
        </button>

        {/* Search Chat History (Minimalist) */}
        {!isCollapsed && (
          <div className="relative">
            <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search chat history..."
              className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg pl-7 pr-2.5 py-1.5 text-[11px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Main Nav Items List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-none py-1">
        {/* Navigation Categories */}
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-zinc-800/90 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Recent Chat History in Sidebar (Claude / ChatGPT style) */}
        {!isCollapsed && (
          <div className="pt-3 mt-3 border-t border-zinc-800/60 space-y-1">
            <div className="px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              Recent Chats
            </div>
            {filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectModule('chat')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors truncate block group"
              >
                <span className="truncate block group-hover:text-zinc-200">{session.title}</span>
                <span className="text-[10px] text-zinc-600 block">{session.time}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Profile Drawer (Minimalist) */}
      <div className="p-3 border-t border-zinc-800/60">
        <div 
          onClick={onOpenAuth}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 cursor-pointer transition-colors group"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {currentUser ? currentUser.name[0].toUpperCase() : 'G'}
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                {currentUser?.name || 'Local Editor (Guest)'}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {currentUser?.role || 'Guest Mode'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block h-[calc(100vh-3.5rem)] transition-all duration-200 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in"
          onClick={onCloseMobile}
        >
          <div 
            className="w-72 h-full bg-[#111317] border-r border-zinc-800 shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
