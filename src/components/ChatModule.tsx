import React, { useState, useRef, useEffect } from 'react';
import { Project, ChatMessage, AppSettings, EditorFaq } from '../types';
import { AVAILABLE_MODELS } from '../data/models';
import { MarkdownRenderer } from './MarkdownRenderer';
import { 
  Sparkles, 
  Trash2, 
  Download, 
  Cpu, 
  FolderKanban, 
  User, 
  Copy, 
  Check, 
  ChevronDown, 
  ArrowUp, 
  RotateCcw,
  Zap,
  Globe,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

interface ChatModuleProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  isLoading: boolean;
  activeProject?: Project;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  faqs: EditorFaq[];
}

export const ChatModule: React.FC<ChatModuleProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  activeProject,
  settings,
  onUpdateSettings,
  faqs,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  const currentModel = AVAILABLE_MODELS.find(m => m.id === settings.selectedModel) || AVAILABLE_MODELS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Close model menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-resize textarea like ChatGPT & Claude
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportChat = () => {
    const textContent = messages
      .map((m) => `### [${m.role.toUpperCase()}] (${m.timestamp || ''})\n\n${m.content}\n\n---\n`)
      .join('\n');
    const blob = new Blob([textContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CineFlow_Chat_${activeProject ? activeProject.title.replace(/\s+/g, '_') : 'Session'}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
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

  // High-value creative prompts (ChatGPT/Claude card style)
  const suggestedPrompts = [
    {
      title: '3-Second Visual Hook Pack',
      desc: 'Generate 5 pattern-interrupt hooks with visual directions & text overlays',
      prompt: 'Generate 5 scroll-stopping pattern-interrupt hooks for this product video ad. For each, describe the visual motion, on-screen text sticker, and why it stops the scroll in the first 3 seconds.',
    },
    {
      title: 'Roman Urdu UGC Script',
      desc: 'Conversational 25s creator script tailored for Pakistani/UAE buyers',
      prompt: 'Write an authentic 25-second UGC creator script in natural Roman Urdu. Keep the tone conversational and relatable (not stiff corporate Urdu). Include timestamps, camera angles, and on-screen caption text.',
    },
    {
      title: 'Scene-by-Scene Timeline Table',
      desc: '0:00-0:03, 0:03-0:08, B-roll overlays & sound effects cues',
      prompt: 'Break down a 30-second DTC ad into an editor-ready table: [Timestamp] | [Visual Shot & Motion] | [Spoken Voiceover] | [On-Screen Text] | [Sound FX (whoosh, riser, hit)].',
    },
    {
      title: 'Contradiction & Missing Specs Audit',
      desc: 'Check if the client brief has conflicting requirements or missing assets',
      prompt: 'Audit the current client brief. Flag any contradictions (e.g. asking for 15s length with 8 testimonials) and list the missing technical specifications I need to request.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-[#0d0f12] text-zinc-100 overflow-hidden relative font-sans">
      {/* Minimalist Top Bar (Claude / ChatGPT Model Selector Header) */}
      <div className="h-11 border-b border-zinc-800/60 bg-[#0d0f12]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between text-xs shrink-0 z-20">
        {/* Model Picker Pill */}
        <div className="relative" ref={modelMenuRef}>
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-zinc-800/70 text-zinc-200 hover:text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                currentModel.provider === 'claude' ? 'bg-amber-400' :
                currentModel.provider === 'openai' ? 'bg-emerald-400' :
                currentModel.provider === 'ollama' ? 'bg-sky-400' : 'bg-indigo-400'
              }`} />
              {currentModel.name}
            </span>
            <span className="text-[10px] text-zinc-400 font-normal">
              {currentModel.badge}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
          </button>

          {/* Model Dropdown Menu */}
          {modelDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/80">
                Select AI Engine
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModel(m.id)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-zinc-800/80 transition-colors ${
                      m.id === currentModel.id ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-xs flex items-center gap-1.5">
                        {m.name}
                        {m.id === currentModel.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                      <div className="text-[10px] text-zinc-500">{m.description}</div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase font-mono">
                      {m.provider}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Project Context & Chat Utilities */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {activeProject && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
              <FolderKanban className="w-3 h-3 text-indigo-400" />
              <span className="truncate max-w-[140px]">{activeProject.title}</span>
            </div>
          )}

          {messages.length > 0 && (
            <>
              <button
                onClick={handleExportChat}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Export as Markdown"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClearChat}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Conversation Canvas (Centered reading column like Claude & ChatGPT) */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            /* Minimalist Welcome State (ChatGPT / Claude Vibe) */
            <div className="py-10 sm:py-16 text-center space-y-8 animate-in fade-in duration-300">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
                  What are we editing today?
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Generate high-converting video ad hooks, Roman Urdu UGC scripts, timeline shot lists, and analyze client briefs.
                </p>
              </div>

              {/* Minimalist Suggested Prompt Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto pt-2">
                {suggestedPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.prompt)}
                    className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900 transition-all text-left group cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors mb-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-relaxed">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Conversation Messages Thread */
            messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-3 sm:gap-4 ${isAssistant ? 'items-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  )}

                  <div
                    className={`relative group max-w-2xl text-xs sm:text-sm leading-relaxed rounded-2xl p-4 sm:p-5 ${
                      isAssistant
                        ? 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-200 shadow-sm'
                        : 'bg-zinc-800 border border-zinc-700/60 text-white font-normal shadow-sm'
                    }`}
                  >
                    {/* Assistant Engine Tag */}
                    {isAssistant && (
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-800/80 text-[10px] text-zinc-400">
                        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Cpu className="w-3 h-3 text-indigo-400" />
                          {msg.model || currentModel.name}
                        </span>
                        {msg.timestamp && <span className="text-zinc-500">{msg.timestamp}</span>}
                      </div>
                    )}

                    {/* Rich Formatted Markdown Output (Zero raw asterisks or hashtags) */}
                    {isAssistant ? (
                      <MarkdownRenderer content={msg.content} />
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}

                    {/* Assistant Message Footer Actions */}
                    {isAssistant && (
                      <div className="mt-3.5 pt-2 border-t border-zinc-800/70 flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="text-[10px] text-zinc-500">Video Creative Output</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                            title="Copy output"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 text-[10px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 items-start animate-in fade-in">
              <div className="w-7 h-7 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-zinc-400">{currentModel.name} is writing your script...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Bottom Input Capsule (Signature Claude & ChatGPT Style) */}
      <div className="p-3 sm:p-5 bg-gradient-to-t from-[#0d0f12] via-[#0d0f12]/95 to-transparent">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Quick Context & Language Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setInput((p) => p ? `${p} (Roman Urdu script)` : 'Write an authentic 25-second UGC creator script in natural Roman Urdu.')}
              className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[10px] font-medium shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              🇵🇰 Roman Urdu
            </button>
            <button
              onClick={() => setInput((p) => p ? `${p} (3-second hook)` : 'First 3 seconds ka high-contrast visual pattern interrupt design karein.')}
              className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[10px] font-medium shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              🎯 3s Visual Hook
            </button>
            <button
              onClick={() => setInput((p) => p ? `${p} (Breakdown table)` : 'Break this video down into a scene-by-scene editor table with timestamps.')}
              className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[10px] font-medium shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              ⏱️ Timed Breakdown
            </button>
          </div>

          {/* Minimalist Floating Capsule Container */}
          <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-zinc-700 shadow-xl transition-all p-2.5 flex flex-col justify-between"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${currentModel.name}... (Shift + Enter for new line)`}
              className="w-full bg-transparent border-0 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 resize-none px-2 py-1 max-h-48 leading-relaxed font-sans"
            />

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 mt-1 px-1">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span className="hidden sm:inline font-mono">Shift+Enter for new line</span>
              </div>

              {/* Minimalist Circular Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  input.trim() && !isLoading
                    ? 'bg-zinc-100 hover:bg-white text-zinc-900 shadow-sm'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          <p className="text-[10px] text-zinc-500 text-center">
            CineFlow AI can make mistakes. Verify technical specs with client briefs.
          </p>
        </div>
      </div>
    </div>
  );
};
