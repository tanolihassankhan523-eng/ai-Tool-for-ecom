import { Project, EditorFaq, MetaAdRecord, FileItem, AppSettings } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  activeProvider: 'claude',
  selectedModel: 'claude-3-7-sonnet',
  ollamaUrl: 'http://127.0.0.1:11434',
  ollamaModel: 'llama3.2',
  geminiModel: 'gemini-3.8-flash',
  openaiModel: 'gpt-4o',
  claudeModel: 'claude-3-7-sonnet',
  temperature: 0.7,
  uiTheme: 'dark',
  preferredLanguage: 'roman_urdu',
  localGuestMode: true,
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'GlowRevive Microcurrent Sculptor',
    clientName: 'LuxeDerm USA',
    brandNiche: 'Skincare & Beauty Tech',
    videoType: 'dtc',
    targetPlatform: 'TikTok & Instagram Reels (9:16)',
    primaryLanguage: 'English',
    aspectRatio: '9:16',
    targetLengthSec: 30,
    brandGuidelines: 'High energy, clean aesthetic, pastel pink & deep purple accents, no aggressive medical claims.',
    deliverablesNotes: '3 hook variations + 1 main body + 2 CTA iterations. Safe zone overlays required.',
    rawBrief: `Client: LuxeDerm USA
Product: GlowRevive Microcurrent Sculptor ($69 + Free Serum)
Goal: Cold traffic TikTok ads to scale scaling spend. Target audience is women 25-45 struggling with morning puffiness and fine lines.
Offer: 50% Off Spring Sale + Free Gua Sha bonus.
Visual musts: Show split-face before/after within first 5 seconds. Use aesthetic bathroom b-roll.
Restrictions: Do not claim it "permanently removes wrinkles" (legal issue). Use phrases like "visibly lifts" and "depuffs in 3 minutes".
Deliverables: 30-second 9:16 vertical video with 3 distinct hook openings.`,
    status: 'active',
    createdAt: '2026-09-25',
  },
  {
    id: 'proj-2',
    title: 'Karachi Chai Co - Instant Cardamom Karak',
    clientName: 'Karachi Chai Co',
    brandNiche: 'Food & Beverage / DTC',
    videoType: 'ugc',
    targetPlatform: 'TikTok / Instagram Reels / YouTube Shorts',
    primaryLanguage: 'Roman Urdu',
    aspectRatio: '9:16',
    targetLengthSec: 25,
    brandGuidelines: 'Desi organic aesthetic, cozy rainy day vibes, colloquial Roman Urdu voiceover, relatable university / office student scenario.',
    deliverablesNotes: 'Authentic creator selfie style, steam pouring b-roll, ASMR kettle sounds, strong urgent CTA for delivery across Pakistan/UAE.',
    rawBrief: `Client: Karachi Chai Co
Product: Instant Elaichi Karak Chai Premix (Pack of 30 sachets)
Market: Pakistan & UAE expats
Target audience: 18-35 young professionals, hostel students, tea lovers who miss authentic dhaba chai.
Hook requirement: "Office mein 4 baje ki thakawat?" or "Hostel mein dhang ki chai nahi milti?"
Language: Roman Urdu (Conversational, lively, relatable).
Offer: Buy 2 Boxes Get 1 Free + Cash on Delivery available.
Deliverable: 25s UGC reel with energetic audio cuts and punchy on-screen captions.`,
    status: 'active',
    createdAt: '2026-09-26',
  },
  {
    id: 'proj-3',
    title: 'ApexTrader 7-Figure Strategy VSL',
    clientName: 'Apex Capital Academy',
    brandNiche: 'FinTech / E-Learning',
    videoType: 'vsl',
    targetPlatform: 'Landing Page Video Sales Letter',
    primaryLanguage: 'English',
    aspectRatio: '16:9',
    targetLengthSec: 360,
    brandGuidelines: 'Cinematic corporate, dark mode charts, confident delivery, no scammy Lamborghinis.',
    deliverablesNotes: 'Full 6-minute VSL script with visual chart animations, b-roll overlays, kinetic typography, and high-converting offer stack.',
    rawBrief: `Product: Apex Day-Trading Mastery Course ($497 one-time)
Goal: Convert cold YouTube and Facebook traffic into webinar signups and direct checkouts.
Target: Frustrated retail traders stuck at break-even or blowing accounts.
Core Mechanism: Proprietary Order Flow & Liquidity Heatmap system.
Deliverables: Full script broken down into Hook (0-60s), Agitation, Mechanism reveal, Social Proof Case Studies, and Final Offer Stack.`,
    status: 'active',
    createdAt: '2026-09-24',
  },
  {
    id: 'proj-4',
    title: 'NeonDrift 2D Pixel Art Game Promo',
    clientName: 'RetroByte Studios',
    brandNiche: 'Gaming / Steam Launch',
    videoType: 'animation',
    targetPlatform: 'Steam / YouTube / TikTok',
    primaryLanguage: 'English',
    aspectRatio: '16:9',
    targetLengthSec: 45,
    brandGuidelines: 'Synthwave color palette (neon cyan, magenta), high tempo 140 BPM electronic music, sync gameplay explosions to beat.',
    deliverablesNotes: 'Gameplay cutdown, animated title cards, Steam Wishlist CTA animation.',
    rawBrief: `Game: NeonDrift - Cyberpunk Retro Roguelike.
Needs: 45s launch trailer for Steam page and social media cutdown.
Key requirement: The cuts must hit exactly on the beat drops. High octane action.`,
    status: 'review',
    createdAt: '2026-09-20',
  },
];

export const INITIAL_FAQS: EditorFaq[] = [
  {
    id: 'faq-1',
    category: 'Hook Retention',
    question: 'How do I engineer a sub-3 second visual pattern interrupt?',
    instruction: 'Start mid-motion (dropping an object, spilling water, applying product in reverse, or an absurd visual question). Avoid logos, slow fades, or generic greeting phrases like "Hey guys!". Change visual elements every 1.5 - 2.5 seconds.',
    isActive: true,
  },
  {
    id: 'faq-2',
    category: 'Multilingual & Roman Urdu',
    question: 'How to write high-converting Roman Urdu for e-commerce UGC ads?',
    instruction: 'Blend natural colloquial Urdu with familiar English e-commerce terms (e.g., "Agar ap bhi roz subha face puffiness se tang hain, toh yeh viral tool try karein!"). Ensure phonetic clarity and keep sentences short so on-screen captions match creator speech rhythm.',
    isActive: true,
  },
  {
    id: 'faq-3',
    category: 'VSL Architecture',
    question: 'What is the standard 5-part VSL structure for direct-response editors?',
    instruction: '1. The Pattern Interrupt Hook (0:00-0:45) -> 2. The Root Cause / Core Problem (0:45-2:00) -> 3. The New Unique Mechanism (2:00-4:00) -> 4. Case Studies & Irrefutable Proof (4:00-5:30) -> 5. The Offer Stack & Risk Reversal (5:30-end).',
    isActive: true,
  },
  {
    id: 'faq-4',
    category: 'Editor Safe Zones',
    question: 'What are the safe-zone dimensions for 9:16 vertical TikTok/Reels?',
    instruction: 'Leave 150px top padding (search & account header), 280px bottom padding (caption and sound title), and 120px right margin (like, comment, share icons). Keep all critical text stickers centered in the middle 60% of the screen.',
    isActive: true,
  },
  {
    id: 'faq-5',
    category: 'Audio & Sound Design',
    question: 'What sound design rules guarantee higher watch time?',
    instruction: 'Layer 3 audio tracks: (1) Voiceover normalized to -14 LUFS, (2) Background music ducked to -24dB whenever voice speaks, (3) Sound effects (whooshes, vinyl scratches, pops, risers, bass drops) placed on key visual changes.',
    isActive: true,
  },
];

export const INITIAL_META_ADS: MetaAdRecord[] = [
  {
    id: 'ad-1',
    brandName: 'NuFACE Sculpting',
    adUrl: 'https://www.facebook.com/ads/library/?id=984392019402',
    dateChecked: '2026-09-24',
    hookPattern: 'Split-screen side-by-side: "Left side 3 mins ago vs Right side now"',
    offerFormat: '20% off starter bundle with code LIFT20',
    videoFormat: '9:16 UGC / Bathroom lighting',
    visualPatterns: 'Raw unfiltered skin texture, macro zoom on cheekbone contour, split-screen line divider.',
    ctaUsed: 'Shop Now - Limited Spring Stock',
    observedDetails: 'Ad has been active for 45+ days, indicating strong ROAS. Opens with zero intro, straight into wand gliding along jawline.',
    editorNotes: 'We can borrow the split-screen comparison for our GlowRevive ad, but use a dynamic swipe transition instead of static split.',
    creativeHypothesis: 'Testing a dynamic swipe transition comparing treated vs untreated jawline will beat static before/after by +25% in 3s hold rate.',
  },
  {
    id: 'ad-2',
    brandName: 'Karak House Dubai',
    adUrl: 'https://www.facebook.com/ads/library/?id=448190391024',
    dateChecked: '2026-09-25',
    hookPattern: 'Urgent relatable question: "3 PM slump at work and the office coffee tastes like cardboard?"',
    offerFormat: 'Free delivery on 2+ packs',
    videoFormat: '9:16 Creator POV / Desk setup',
    visualPatterns: 'Laptop screen background, steam rising, pouring hot water, intense golden color swirl.',
    ctaUsed: 'Order Your Desi Karak Today',
    observedDetails: 'Emphasizes sensory ASMR sounds of spoon stirring and steam. Clean yellow bold subtitles.',
    editorNotes: 'Perfect template for Karachi Chai Co ad. Add subtle lofi desi beats in the background.',
    creativeHypothesis: 'Starting with extreme close-up of water hitting chai premix (ASMR sound) will outperform face-talking intro.',
  },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'file-1',
    name: 'LuxeDerm_Client_Brief_v2.pdf',
    size: '1.4 MB',
    type: 'brief',
    projectId: 'proj-1',
    uploadedAt: '2026-09-25',
    status: 'indexed',
    chunksCount: 8,
    extractedText: 'Product specifications: 3 microcurrent intensity settings, red light therapy wavelength 630nm, rechargeable battery 500mAh. Offer: 50% discount with free conductive gel bottle.',
  },
  {
    id: 'file-2',
    name: 'Karachi_Chai_Customer_Reviews.txt',
    size: '180 KB',
    type: 'transcript',
    projectId: 'proj-2',
    uploadedAt: '2026-09-26',
    status: 'indexed',
    chunksCount: 4,
    extractedText: 'Top customer feedback: "Hostel mein sab se bari blessing hai", "Dhaba style elaichi fragrance without any hassle", "Saved me hundreds of rupees on cafe chai".',
  },
  {
    id: 'file-3',
    name: 'TikTok_Winning_Ads_Transcripts_Q3.docx',
    size: '3.2 MB',
    type: 'script',
    uploadedAt: '2026-09-22',
    status: 'indexed',
    chunksCount: 22,
    extractedText: 'Analysis of 50 top-scaling DTC skincare ads on TikTok Ads Manager in 2026. Common thread: Problem highlighted in first 1.8 seconds, demonstration of usage before 0:06.',
  },
];
