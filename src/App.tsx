import React, { useState, useEffect } from 'react';
import { 
  NavModule, 
  Project, 
  ChatMessage, 
  MetaAdRecord, 
  FileItem, 
  EditorFaq, 
  AppSettings, 
  StructuredBrief, 
  UserProfile 
} from './types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_FAQS, 
  INITIAL_META_ADS, 
  INITIAL_FILES, 
  INITIAL_SETTINGS 
} from './data/initialData';
import { AVAILABLE_MODELS } from './data/models';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ChatModule } from './components/ChatModule';
import { BriefAnalyzerModule } from './components/BriefAnalyzerModule';
import { CreativeStudioModule } from './components/CreativeStudioModule';
import { ImageStudioModule } from './components/ImageStudioModule';
import { AudioStudioModule } from './components/AudioStudioModule';
import { MetaAdsModule } from './components/MetaAdsModule';
import { ProjectsModule } from './components/ProjectsModule';
import { KnowledgeBaseModule } from './components/KnowledgeBaseModule';
import { FaqInstructionsModule } from './components/FaqInstructionsModule';
import { SettingsModule } from './components/SettingsModule';
import { PhpHubModule } from './components/PhpHubModule';
import { AuthModal } from './components/AuthModal';
import { 
  auth, 
  onAuthStateChanged, 
  saveProjectToFirestore, 
  loadUserProjectsFromFirestore, 
  deleteProjectFromFirestore,
  saveChatMessageToFirestore,
  type FirebaseUser
} from './firebase';

export default function App() {
  const [activeModule, setActiveModule] = useState<NavModule>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cineflow_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'user-default-1',
          name: 'Hassan Tanoli',
          email: 'tanolihassankhan523@gmail.com',
          isGuest: false,
          role: 'Creative Director & DTC Lead',
          preferredLanguage: 'roman_urdu',
          createdAt: new Date().toISOString(),
        };
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('cineflow_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || '');
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('cineflow_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [faqs, setFaqs] = useState<EditorFaq[]>(() => {
    const saved = localStorage.getItem('cineflow_faqs');
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [ads, setAds] = useState<MetaAdRecord[]>(() => {
    const saved = localStorage.getItem('cineflow_ads');
    return saved ? JSON.parse(saved) : INITIAL_META_ADS;
  });

  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('cineflow_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const currentModel = AVAILABLE_MODELS.find(m => m.id === settings.selectedModel) || AVAILABLE_MODELS[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Salam! Welcome to CineFlow Studio. I am your personal video creative director & AI strategist.

Currently active engine: **${currentModel.name}** (${currentModel.badge}).

I am specialized in:
- 🎯 **3-Second Scroll Stoppers:** High-contrast pattern interrupts for TikTok, Reels, & Shorts.
- 🇵🇰 **Natural Roman Urdu:** Conversational scripts with authentic desi relatable phrasing.
- 📋 **Brief Extraction:** Separating confirmed facts from creative hypotheses.
- 📈 **Performance Ad Frameworks:** Hook, agitation, unique mechanism, and clear CTA.
- 🛠️ **Local Confidentiality:** Runs on local Windows XAMPP with Ollama or multi-cloud adapters (Claude, OpenAI, Gemini).

Select a prompt or ask me anything to begin!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: currentModel.provider,
      model: currentModel.name,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Firebase Auth & Cloud Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const profile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Creative Director',
          email: fbUser.email || '',
          isGuest: false,
          role: 'Creative Director',
          preferredLanguage: 'en',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(profile);
        try {
          const cloudProjects = await loadUserProjectsFromFirestore(fbUser.uid);
          if (cloudProjects && cloudProjects.length > 0) {
            setProjects(cloudProjects);
            setActiveProjectId(cloudProjects[0].id);
          }
        } catch (e) {
          console.warn('Notice: Firestore project fetch:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cineflow_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cineflow_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cineflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('cineflow_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('cineflow_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('cineflow_ads', JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem('cineflow_files', JSON.stringify(files));
  }, [files]);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  // Handle chat messaging
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Build project context string
      let projectContext = '';
      if (activeProject) {
        projectContext = `Project: ${activeProject.title}
Client: ${activeProject.clientName}
Category: ${activeProject.brandNiche}
Video Type: ${activeProject.videoType}
Platform: ${activeProject.targetPlatform}
Duration: ${activeProject.targetLengthSec}s
Aspect Ratio: ${activeProject.aspectRatio}
Language: ${activeProject.primaryLanguage}
Guidelines: ${activeProject.brandGuidelines}
Raw Brief Context: ${activeProject.rawBrief || 'None'}`;
      }

      // Build active FAQs custom instructions
      const customInstructions = faqs
        .filter((f) => f.isActive)
        .map((f) => `[${f.category}] ${f.question}: ${f.instruction}`)
        .join('\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          provider: settings.activeProvider,
          model: settings.selectedModel,
          ollamaUrl: settings.ollamaUrl,
          temperature: settings.temperature,
          projectContext,
          customInstructions,
          preferredLanguage: settings.preferredLanguage,
          anthropicApiKey: settings.anthropicApiKey,
          openaiApiKey: settings.openaiApiKey,
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: data.provider || settings.activeProvider,
          model: data.model || currentModel.name,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (currentUser && !currentUser.isGuest) {
          saveChatMessageToFirestore(currentUser.id, activeProjectId || 'default-chat', userMsg).catch(console.warn);
          saveChatMessageToFirestore(currentUser.id, activeProjectId || 'default-chat', assistantMsg).catch(console.warn);
        }
      } else {
        const errorReply = data.error || 'Failed to generate response.';
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: `⚠️ **Execution Notice:** ${errorReply}\n\n*${data.hint || 'Check provider status in Settings.'}*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `⚠️ **Network Error:** Could not contact server: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    if (currentUser && !currentUser.isGuest) {
      saveProjectToFirestore(currentUser.id, newProject).catch((err) => {
        console.warn('Could not persist project to Firestore:', err);
      });
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(projects.find((p) => p.id !== id)?.id || '');
    }
    if (currentUser && !currentUser.isGuest) {
      deleteProjectFromFirestore(currentUser.id, id).catch((err) => {
        console.warn('Could not delete project from Firestore:', err);
      });
    }
  };

  const handleAddAd = (newAd: MetaAdRecord) => {
    setAds((prev) => [newAd, ...prev]);
  };

  const handleDeleteAd = (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUploadFile = (newFile: FileItem) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddFaq = (newFaq: EditorFaq) => {
    setFaqs((prev) => [newFaq, ...prev]);
  };

  const handleToggleFaq = (id: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const handleOpenChatWithProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveModule('chat');
  };

  const handleOpenBriefAnalyzerWithProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveModule('brief-analyzer');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${settings.uiTheme === 'dark' ? 'bg-[#0d0f12] text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenPhpHub={() => setActiveModule('php-hub')}
        onOpenDashboard={() => setActiveModule('dashboard')}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(mod) => {
            setActiveModule(mod);
            setIsMobileSidebarOpen(false);
          }}
          activeProjectTitle={activeProject?.title}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onNewChat={() => {
            handleClearChat();
            setActiveModule('chat');
            setIsMobileSidebarOpen(false);
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Workspace Module */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeModule === 'dashboard' && (
            <DashboardOverview
              currentUser={currentUser}
              projects={projects}
              ads={ads}
              settings={settings}
              onNavigate={setActiveModule}
              onSelectProject={setActiveProjectId}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          )}

          {activeModule === 'chat' && (
            <ChatModule
              messages={messages}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              isLoading={isLoading}
              activeProject={activeProject}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              faqs={faqs}
            />
          )}

          {activeModule === 'projects' && (
            <ProjectsModule
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={setActiveProjectId}
              onAddProject={handleAddProject}
              onDeleteProject={handleDeleteProject}
              onOpenChatWithProject={handleOpenChatWithProject}
              onOpenBriefAnalyzerWithProject={handleOpenBriefAnalyzerWithProject}
            />
          )}

          {activeModule === 'brief-analyzer' && (
            <BriefAnalyzerModule
              activeProject={activeProject}
            />
          )}

          {activeModule === 'creative' && (
            <CreativeStudioModule
              activeProject={activeProject}
            />
          )}

          {activeModule === 'image-studio' && (
            <ImageStudioModule />
          )}

          {activeModule === 'music-studio' && (
            <AudioStudioModule />
          )}

          {activeModule === 'meta-ads' && (
            <MetaAdsModule
              ads={ads}
              onAddAd={handleAddAd}
              onDeleteAd={handleDeleteAd}
            />
          )}

          {activeModule === 'library' && (
            <KnowledgeBaseModule
              files={files}
              projects={projects}
              onUploadFile={handleUploadFile}
              onDeleteFile={handleDeleteFile}
            />
          )}

          {activeModule === 'faqs' && (
            <FaqInstructionsModule
              faqs={faqs}
              onAddFaq={handleAddFaq}
              onToggleFaq={handleToggleFaq}
              onDeleteFaq={handleDeleteFaq}
            />
          )}

          {activeModule === 'settings' && (
            <SettingsModule
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {activeModule === 'php-hub' && (
            <PhpHubModule />
          )}
        </main>
      </div>

      {/* Auth Modal (Login / Signup) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />
    </div>
  );
}
