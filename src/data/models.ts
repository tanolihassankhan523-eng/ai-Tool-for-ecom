import { AIModelOption } from '../types';

export const AVAILABLE_MODELS: AIModelOption[] = [
  // Claude Models
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'claude',
    badge: 'Elite Thinking',
    description: 'Anthropic\'s flagship model with hybrid reasoning, superior nuance for VSLs & storyboards.',
    contextWindow: '200k',
    isPopular: true,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'claude',
    badge: 'Creative Standard',
    description: 'Exceptional creative copywriting, natural Roman Urdu colloquial phrasing, and deep empathy.',
    contextWindow: '200k',
    isPopular: true,
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'claude',
    badge: 'Ultra Fast',
    description: 'Lightning-fast hook generation and rapid brief categorization.',
    contextWindow: '200k',
  },

  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'openai',
    badge: 'Industry Standard',
    description: 'High-speed flagship multimodal reasoning, direct-response advertising formulas.',
    contextWindow: '128k',
    isPopular: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    badge: 'Cost Efficient',
    description: 'Affordable, fast generation for quick hook variations and scene pacing.',
    contextWindow: '128k',
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    provider: 'openai',
    badge: 'Deep Logic',
    description: 'Deep reasoning for complex multi-product briefs and contradiction checking.',
    contextWindow: '200k',
  },

  // Gemini Models (Server-Side Native)
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'gemini',
    badge: 'Default / Instant',
    description: 'Google\'s fastest intelligence model. Server-integrated, zero setup needed in preview.',
    contextWindow: '1M+',
    isPopular: true,
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    provider: 'gemini',
    badge: 'Complex Reasoning',
    description: 'Deep creative strategy, multi-scene breakdowns, and complex visual workflows.',
    contextWindow: '2M+',
  },

  // Local Ollama Models (100% Confidential / Localhost)
  {
    id: 'llama3.2',
    name: 'Ollama Llama 3.2',
    provider: 'ollama',
    badge: 'Local Offline',
    description: 'Meta\'s lightweight local model running on your local XAMPP machine. 100% private.',
    contextWindow: '128k',
    isPopular: true,
  },
  {
    id: 'deepseek-r1',
    name: 'Ollama DeepSeek-R1',
    provider: 'ollama',
    badge: 'Local Reasoning',
    description: 'Open-weights reasoning model running on local GPU for strategic ad frameworks.',
    contextWindow: '64k',
  },
  {
    id: 'mistral',
    name: 'Ollama Mistral 7B',
    provider: 'ollama',
    badge: 'Local Creative',
    description: 'Punchy scriptwriting and concise scene descriptions running offline.',
    contextWindow: '32k',
  },
];
