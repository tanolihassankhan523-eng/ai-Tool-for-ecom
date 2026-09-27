<?php
/**
 * CineFlow AI - Brief Analyzer Service
 * Analyzes client video briefs with strict separation between confirmed facts and assumptions.
 * Prevents hallucinations, flags missing deliverables, and prepares editor instructions.
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/OllamaService.php';

class BriefAnalyzerService {
    private OllamaService $ollama;

    public function __construct(?OllamaService $ollama = null) {
        $this->ollama = $ollama ?: new OllamaService();
    }

    /**
     * Build the structured system prompt for video editing brief extraction
     */
    public static function getSystemPrompt(): string {
        return <<<PROMPT
You are CineFlow AI, an elite e-commerce video editor and creative director.
Your job is to analyze client briefs for DTC video ads, VSLs, UGC, animation, music videos, and social promos.

CRITICAL RULES:
1. SEPARATE FACTS FROM ASSUMPTIONS: Only classify something as a "Confirmed Fact" if the client explicitly states it. Mark everything else as an "Assumption" or "Hypothesis".
2. ZERO HALLUCINATIONS: Never invent product claims, clinical trials, discount codes, or testimonials that are not in the brief.
3. CONTRADICTIONS: Flag if the brief contradicts itself (e.g. asking for a 15-second fast TikTok that also covers 7 complex clinical proofs).
4. MISSING INFORMATION: Proactively list every missing spec an editor needs (aspect ratio, exact deadline, footage assets provided vs required, brand color hex codes, target audio style).
5. MULTILINGUAL: Understand English, Roman Urdu (e.g. "Yeh product hair fall ke liye hai, fast paced video banani hai"), and Urdu. Respond in the requested or source language naturally.

OUTPUT FORMAT MUST BE VALID JSON with the following structure:
{
  "productName": "Extracted or inferred name",
  "offerAndPricing": "The exact offer or 'Not specified'",
  "targetAudience": "Demographics and pain points",
  "campaignObjective": "Conversion, Awareness, Retargeting, etc.",
  "platformAndFormat": {
    "platform": "TikTok / Meta / YouTube / etc.",
    "aspectRatio": "9:16 / 16:9 / 1:1",
    "targetLength": "e.g. 30s or Not specified"
  },
  "videoType": "dtc | vsl | ugc | animation | music_video | social_promo",
  "keyBenefitsAndClaims": ["Claim 1", "Claim 2"],
  "objectionsToCounter": ["Objection 1", "Objection 2"],
  "callToAction": "Exact CTA",
  "brandRulesAndRestrictions": ["Rule 1", "Rule 2"],
  "confirmedFacts": ["Fact 1", "Fact 2"],
  "assumptionsAndHypotheses": ["Assumption 1", "Assumption 2"],
  "flaggedContradictions": ["Contradiction 1"],
  "missingInformationQuestions": ["Question 1", "Question 2"],
  "editorChecklist": ["Step 1", "Step 2"]
}
PROMPT;
    }

    /**
     * Analyze brief using AI
     */
    public function analyze(string $rawBrief, ?string $model = null): array {
        $messages = [
            ['role' => 'system', 'content' => self::getSystemPrompt()],
            ['role' => 'user', 'content' => "Here is the client brief to analyze:\n\n" . $rawBrief]
        ];

        $response = $this->ollama->chat($messages, $model, [
            'temperature' => 0.2, // Low temperature for high precision
            'format' => 'json'
        ]);

        if (!$response['success']) {
            return $response;
        }

        // Parse JSON output safely
        $rawJson = $response['reply'];
        $cleanJson = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim($rawJson));
        $parsed = json_decode($cleanJson, true);

        if (!$parsed) {
            // Fallback: return raw reply with structured wrapper
            return [
                'success' => true,
                'isRawText' => true,
                'reply' => $response['reply'],
                'model' => $response['model']
            ];
        }

        return [
            'success' => true,
            'isRawText' => false,
            'data' => $parsed,
            'model' => $response['model']
        ];
    }
}
