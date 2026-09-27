export type NavModule = 
  | 'dashboard'
  | 'chat'
  | 'projects'
  | 'brief-analyzer'
  | 'creative'
  | 'image-studio'
  | 'music-studio'
  | 'library'
  | 'meta-ads'
  | 'faqs'
  | 'settings'
  | 'php-hub';

export type VideoType = 'dtc' | 'vsl' | 'ugc' | 'animation' | 'music_video' | 'social_promo';

export type LanguageCode = 'en' | 'roman_urdu' | 'ur';

export type AIProvider = 'claude' | 'openai' | 'gemini' | 'ollama';

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProvider;
  badge: string;
  description: string;
  contextWindow: string;
  isPopular?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
  role: string;
  preferredLanguage: LanguageCode;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  brandNiche: string;
  videoType: VideoType;
  targetPlatform: string;
  primaryLanguage: string;
  aspectRatio: string;
  targetLengthSec: number;
  brandGuidelines: string;
  deliverablesNotes: string;
  rawBrief?: string;
  status: 'active' | 'review' | 'completed';
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  provider: AIProvider;
}

export interface ChatMessage {
  id: string;
  sessionId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provider?: AIProvider;
  model?: string;
  citations?: string[];
  isRomanUrdu?: boolean;
}

export interface StructuredBrief {
  productName: string;
  offerAndPricing: string;
  targetAudience: string;
  campaignObjective: string;
  platformAndDeliverables: {
    platform: string;
    aspectRatio: string;
    targetLength: string;
    deliverablesCount: string;
  };
  videoType: VideoType;
  keyBenefitsAndClaims: string[];
  objectionsToCounter: string[];
  callToAction: string;
  brandRulesAndRestrictions: string[];
  confirmedFacts: string[];
  assumptionsAndHypotheses: string[];
  flaggedContradictions: string[];
  missingInformationQuestions: string[];
  editorChecklist: string[];
}

export interface ScriptBeat {
  timestamp: string;
  beatName: string;
  visualShot: string;
  voiceover: string;
  onScreenText: string;
  soundEffects: string;
}

export interface CreativePack {
  summary: string;
  angleName: string;
  hooks: {
    type: string;
    visual: string;
    audio: string;
    onScreenText: string;
    retentionWhy: string;
  }[];
  scriptTimeline: ScriptBeat[];
  brollShotList: string[];
  editorInstructions: {
    pacing: string;
    colorGrading: string;
    textGraphics: string;
    audioLoudness: string;
  };
  assetChecklist: string[];
  questionsAndAssumptions: string[];
}

export interface MetaAdRecord {
  id: string;
  brandName: string;
  adUrl: string;
  dateChecked: string;
  hookPattern: string;
  offerFormat: string;
  videoFormat: string;
  visualPatterns: string;
  ctaUsed: string;
  observedDetails: string;
  editorNotes: string;
  creativeHypothesis?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'brief' | 'transcript' | 'audio' | 'video' | 'script' | 'image';
  projectId?: string;
  uploadedAt: string;
  status: 'indexed' | 'processing' | 'ready';
  extractedText?: string;
  chunksCount: number;
}

export interface EditorFaq {
  id: string;
  category: string;
  question: string;
  instruction: string;
  isActive: boolean;
}

export interface AppSettings {
  activeProvider: AIProvider;
  selectedModel: string;
  ollamaUrl: string;
  ollamaModel: string;
  geminiModel: string;
  openaiModel: string;
  claudeModel: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  temperature: number;
  uiTheme: 'dark' | 'light';
  preferredLanguage: LanguageCode;
  localGuestMode: boolean;
}
