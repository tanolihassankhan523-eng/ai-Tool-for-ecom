import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Terminal, 
  Database, 
  FolderTree, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  Layers, 
  FileCode, 
  Server, 
  HardDrive, 
  ExternalLink, 
  Sparkles, 
  Cpu 
} from 'lucide-react';

export const PhpHubModule: React.FC = () => {
  const [phpFiles, setPhpFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string>('database/schema.sql');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'code' | 'xampp_guide' | 'phases'>('architecture');

  useEffect(() => {
    fetch('/api/php-files')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.files) {
          setPhpFiles(data.files);
        }
      })
      .catch((err) => console.error('Failed to load PHP files:', err));
  }, []);

  const handleCopyCode = () => {
    const code = phpFiles[selectedFile] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const code = phpFiles[selectedFile] || '';
    const filename = selectedFile.split('/').pop() || 'file.txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto p-4 md:p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-white">XAMPP Windows, PHP 8+ & MySQL Architecture</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Production-ready local deployment blueprint for Windows XAMPP with Ollama local inference.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'architecture' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Architecture
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'code' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. PHP Files ({Object.keys(phpFiles).length})
            </button>
            <button
              onClick={() => setActiveTab('xampp_guide')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'xampp_guide' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. XAMPP Setup Steps
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'phases' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              4. Phases & Tests
            </button>
          </div>
        </div>

        {/* TAB 1: ARCHITECTURE OVERVIEW & FOLDER STRUCTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            {/* High-Level Architecture Diagram Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                Practical System Architecture Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-indigo-400 mb-1">1. Frontend Layer</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    HTML5, Tailwind CSS, Vanilla JS / React SPA. Communicates with PHP backend endpoints via asynchronous fetch calls with JSON payloads.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-400 mb-1">2. PHP 8+ Backend</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Modular REST controllers in <code className="text-amber-300">api/</code>, prepared PDO database wrapper in <code className="text-amber-300">config/</code>, and brief analysis pipeline.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-1">3. Local Ollama Engine</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Runs on <code className="text-emerald-300">localhost:11434</code>. Pulls Llama 3.2 / Mistral / DeepSeek locally. 100% offline and confidential.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-violet-400 mb-1">4. MySQL Database</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Stores projects, client briefs, timed scripts, chunked text for keyword/full-text search, and Meta Ads research observations.
                  </p>
                </div>
              </div>
            </div>

            {/* Folder Structure */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-indigo-400" />
                Target Windows XAMPP Directory Structure
              </h2>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
{`C:\\xampp\\htdocs\\videocraft-ai\\
│
├── .htaccess                       <- Apache URL rewrite & security rules
├── index.php                       <- Local diagnosis dashboard & web gateway
├── .env.example                    <- Environment configuration template
│
├── config\\
│   ├── config.php                  <- App constants, paths, CORS, and runtime flags
│   └── database.php                <- PDO connection singleton with prepared queries
│
├── database\\
│   └── schema.sql                  <- Complete MySQL schema (11 tables & initial seeds)
│
├── services\\
│   ├── OllamaService.php           <- cURL abstraction for local Ollama API (:11434)
│   ├── BriefAnalyzerService.php    <- Facts vs assumptions extraction & prompt pipeline
│   └── DocumentService.php         <- File parsing, text extraction, & chunking
│
├── api\\
│   ├── chat.php                    <- Multilingual chat with project context & FAQs
│   ├── briefs.php                  <- Brief extraction, contradiction checker, and saving
│   ├── projects.php                <- Project CRUD (create, read, update, list)
│   ├── creative.php                <- Timed scripts, storyboards, and hook packs
│   ├── meta_ads.php                <- Competitor ad library records & hypotheses
│   └── status.php                  <- System diagnostic, MySQL & Ollama health check
│
├── storage\\
│   ├── uploads\\                    <- Uploaded briefs, audio, and video files
│   └── logs\\                       <- Error and execution audit logs
│
└── public\\                         <- Frontend assets (HTML, CSS, JS)
    ├── css\\
    ├── js\\
    └── index.html`}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE PHP FILE BROWSER */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* File list */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Backend Files
              </div>
              <div className="space-y-1">
                {Object.keys(phpFiles).map((filename) => {
                  const isSelected = selectedFile === filename;
                  return (
                    <button
                      key={filename}
                      onClick={() => setSelectedFile(filename)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow'
                          : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <span className="truncate">{filename}</span>
                      <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code viewer */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-mono font-bold text-indigo-300">
                  {selectedFile}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadFile}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed">
                <code>{phpFiles[selectedFile] || '// Loading file content...'}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: XAMPP SETUP STEPS */}
        {activeTab === 'xampp_guide' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Complete Windows XAMPP Installation & Setup Guide
            </h2>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 text-sm">Step 1: Install XAMPP with PHP 8+</div>
                <p className="leading-relaxed">
                  Download XAMPP from <strong>apachefriends.org</strong> (choose PHP 8.1 or 8.2 version). Run installer and select <strong>Apache</strong> and <strong>MySQL</strong>.
                </p>
                <div className="p-2 rounded bg-slate-900 text-slate-400 font-mono text-[11px]">
                  Ensure PHP extensions are enabled in <code>C:\xampp\php\php.ini</code>: <br />
                  <code>extension=pdo_mysql</code>, <code>extension=curl</code>, <code>extension=mbstring</code>, <code>extension=fileinfo</code>.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400 text-sm">Step 2: Create & Import MySQL Database</div>
                <p className="leading-relaxed">
                  1. Open the XAMPP Control Panel and click <strong>Start</strong> on both Apache and MySQL.<br />
                  2. Open your browser and navigate to <code>http://localhost/phpmyadmin</code>.<br />
                  3. Click on the <strong>Import</strong> tab.<br />
                  4. Select the <code>database/schema.sql</code> file and click <strong>Go</strong>. It will create <code>videocraft_db</code> with all 11 tables and initial video editing seed rules.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-indigo-400 text-sm">Step 3: Setup Ollama for Local AI Inference</div>
                <p className="leading-relaxed">
                  1. Download Ollama from <strong>ollama.com</strong> for Windows.<br />
                  2. Open Command Prompt or PowerShell and run:
                </p>
                <div className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px]">
                  ollama serve<br />
                  ollama pull llama3.2
                </div>
                <p className="leading-relaxed text-slate-400 text-[11px]">
                  Ollama will now listen on <code>http://127.0.0.1:11434</code>. CineFlow AI will automatically connect and keep all your client briefs 100% offline.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-violet-400 text-sm">Step 4: Optional Local Tools (FFmpeg & Whisper)</div>
                <p className="leading-relaxed">
                  - <strong>FFmpeg:</strong> Download ffmpeg from <code>gyan.dev/ffmpeg/builds</code> and add to Windows PATH. Used for audio extraction and video duration checks.<br />
                  - <strong>Local Whisper:</strong> Install via <code>pip install openai-whisper</code> for offline voiceover transcription.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PHASES & ACCEPTANCE TESTS */}
        {activeTab === 'phases' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Build Phases & Acceptance Verification Checklist
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-indigo-400 text-sm">Phase 1: Core Foundation & Local Engine</div>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> App starts on localhost / XAMPP
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> MySQL database connects via PDO
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Ollama responds on :11434
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Multilingual chat (English, Roman Urdu, Urdu)
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-indigo-400 text-sm">Phase 2: Projects, Briefs & Creative Studio</div>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Confirmed facts vs assumptions isolated
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Contradictions flagged & questions asked
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Timed scene-by-scene script generated
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Export to Markdown, CSV, TXT
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-indigo-400 text-sm">Phase 3: Meta Ads & Intelligence</div>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Meta Ad Library records logged
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Creative test hypotheses derived
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Observed details separated from hypotheses
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-indigo-400 text-sm">Phase 4: Knowledge Base & RAG Chunking</div>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Documents chunked with index references
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Local disk storage monitored
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> File deletion purges chunks from index
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
