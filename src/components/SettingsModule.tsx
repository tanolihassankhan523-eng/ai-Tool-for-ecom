import React, { useState, useEffect } from 'react';
import { AppSettings, AIProvider } from '../types';
import { AVAILABLE_MODELS } from '../data/models';
import { 
  Settings, 
  Cpu, 
  Cloud, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Key, 
  Lock, 
  Sliders, 
  Sparkles, 
  Bot 
} from 'lucide-react';

interface SettingsModuleProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [testingOllama, setTestingOllama] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<{
    tested: boolean;
    online: boolean;
    models: string[];
  }>({
    tested: false,
    online: false,
    models: [],
  });

  const testOllamaConnection = async () => {
    setTestingOllama(true);
    try {
      const res = await fetch(`/api/health?ollamaUrl=${encodeURIComponent(settings.ollamaUrl)}`);
      const data = await res.json();
      setOllamaStatus({
        tested: true,
        online: data.ollama?.online || false,
        models: data.ollama?.models || [],
      });
    } catch (e: any) {
      setOllamaStatus({
        tested: true,
        online: false,
        models: [],
      });
    } finally {
      setTestingOllama(false);
    }
  };

  useEffect(() => {
    testOllamaConnection();
  }, [settings.ollamaUrl]);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white">AI Provider & Multi-Model Engine Manager</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure Claude (Anthropic), OpenAI, Google Gemini, and Local Ollama models.
          </p>
        </div>

        {/* Model Selection Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            Available AI Models
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AVAILABLE_MODELS.map((m) => {
              const isSelected = settings.selectedModel === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() =>
                    onUpdateSettings({
                      selectedModel: m.id,
                      activeProvider: m.provider,
                    })
                  }
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        m.provider === 'claude'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : m.provider === 'openai'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : m.provider === 'ollama'
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                          : 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                      }`}>
                        {m.provider}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.contextWindow}</span>
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{m.name}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                      {m.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">{m.badge}</span>
                    {isSelected ? (
                      <span className="text-indigo-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </span>
                    ) : (
                      <span className="text-slate-500">Click to activate</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Custom API Keys */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Key className="w-4 h-4 text-amber-400" />
            Optional Direct Cloud API Keys
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            By default, all models are accelerated via CineFlow server proxy. You can optionally plug in your own Anthropic Claude or OpenAI API key.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Anthropic (Claude) API Key</label>
              <input
                type="password"
                placeholder="sk-ant-api03-..."
                value={settings.anthropicApiKey || ''}
                onChange={(e) => onUpdateSettings({ anthropicApiKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">OpenAI API Key</label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={settings.openaiApiKey || ''}
                onChange={(e) => onUpdateSettings({ openaiApiKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Ollama Local Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Local Ollama Runtime Configuration (100% Offline / Localhost)
            </h3>

            <button
              onClick={testOllamaConnection}
              disabled={testingOllama}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingOllama ? 'animate-spin' : ''}`} />
              <span>Test Ollama</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Ollama Base URL</label>
              <input
                type="text"
                value={settings.ollamaUrl}
                onChange={(e) => onUpdateSettings({ ollamaUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Local Model</label>
              <input
                type="text"
                value={settings.ollamaModel}
                onChange={(e) => onUpdateSettings({ ollamaModel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
