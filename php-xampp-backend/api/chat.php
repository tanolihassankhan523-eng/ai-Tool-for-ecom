<?php
/**
 * CineFlow AI - Chat API Endpoint
 * Handles chat messaging with project context, local Ollama execution, and conversation logging
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/OllamaService.php';

// Accept JSON payload
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: [];

$userMessage = trim($data['message'] ?? '');
$conversationId = (int)($data['conversation_id'] ?? 0);
$projectId = (int)($data['project_id'] ?? 0);
$model = trim($data['model'] ?? OLLAMA_DEFAULT_MODEL);
$preferredLanguage = trim($data['language'] ?? 'en'); // en, roman_urdu, ur

if (empty($userMessage)) {
    sendJsonResponse(['success' => false, 'error' => 'Message content is required'], 400);
}

$db = null;
try {
    $db = Database::getConnection();
} catch (Exception $e) {
    // Continue in guest memory mode if DB is not yet initialized
}

// 1. Fetch relevant FAQs / Custom Instructions from DB if connected
$customInstructions = "";
if ($db) {
    try {
        $faqStmt = $db->query("SELECT category, question_trigger, answer_instruction FROM editor_faqs WHERE is_active = 1 LIMIT 10");
        $faqs = $faqStmt->fetchAll();
        if ($faqs) {
            $customInstructions .= "\n\nEDITOR GUIDELINES & FAQS:\n";
            foreach ($faqs as $f) {
                $customInstructions .= "- [{$f['category']}] {$f['question_trigger']}: {$f['answer_instruction']}\n";
            }
        }
    } catch (Exception $e) {
        // ignore
    }
}

// 2. Fetch Project Context if assigned
$projectContext = "";
if ($db && $projectId > 0) {
    try {
        $projStmt = $db->prepare("SELECT title, client_name, brand_niche, video_type, target_platform, brand_guidelines FROM projects WHERE id = ?");
        $projStmt->execute([$projectId]);
        $project = $projStmt->fetch();
        if ($project) {
            $projectContext = "\nCURRENT ACTIVE PROJECT CONTEXT:\n" .
                "Title: {$project['title']}\n" .
                "Client/Brand: {$project['client_name']} ({$project['brand_niche']})\n" .
                "Format: {$project['video_type']} ({$project['target_platform']})\n" .
                "Guidelines: {$project['brand_guidelines']}\n";
        }
    } catch (Exception $e) {
        // ignore
    }
}

// 3. Assemble System Prompt with Editor Persona & Multilingual Rules
$systemPrompt = <<<SYS
You are CineFlow AI, a world-class e-commerce video editor, direct-response copywriter, and creative strategist.
You specialize in DTC TikTok/Reels ads, high-converting VSLs, authentic UGC/Avatar videos, animations, music video editing, and social promos.

YOUR PERSONALITY & PRINCIPLES:
1. Think like a video editor: Always consider timeline pacing, cuts per second, visual pattern interrupts (every 2-3s), on-screen text safe zones, sound effects (whooshes, risers, hits), and B-roll variety.
2. Separate confirmed facts from assumptions. Clearly label creative hypotheses as "Hypothesis".
3. Multilingual fluency:
   - English: Clear, punchy, persuasive.
   - Roman Urdu: Natural, conversational Pakistani/South Asian phrasing (e.g. "Hook mein sabse pehle problem dikhani hai, then quick transition to the solution").
   - Urdu (Nastaliq/Script): Fluent and professional when requested.
   Respond in the exact language the user communicates with you in!
4. Structured outputs: Always break scripts into: [Timestamp] | [Visual / Shot] | [Audio / Voiceover] | [On-Screen Text].
{$projectContext}
{$customInstructions}
SYS;

// 4. Build message payload
$messages = [
    ['role' => 'system', 'content' => $systemPrompt]
];

// Add conversation history if conversation_id provided
if ($db && $conversationId > 0) {
    try {
        $histStmt = $db->prepare("SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id ASC LIMIT 10");
        $histStmt->execute([$conversationId]);
        $history = $histStmt->fetchAll();
        foreach ($history as $h) {
            $messages[] = ['role' => $h['role'], 'content' => $h['content']];
        }
    } catch (Exception $e) {
        // ignore
    }
}

$messages[] = ['role' => 'user', 'content' => $userMessage];

// 5. Send to Ollama
$ollama = new OllamaService(null, $model);
$result = $ollama->chat($messages, $model);

if (!$result['success']) {
    sendJsonResponse([
        'success' => false,
        'error' => $result['error'],
        'hint' => 'Check if Ollama is running at http://127.0.0.1:11434 and model "' . $model . '" is installed (`ollama pull ' . $model . '`).'
    ], 503);
}

// 6. Save to DB if available
if ($db) {
    try {
        if ($conversationId === 0) {
            $title = mb_substr($userMessage, 0, 50) . '...';
            $insConv = $db->prepare("INSERT INTO conversations (project_id, title, model_name) VALUES (?, ?, ?)");
            $insConv->execute([$projectId ?: null, $title, $model]);
            $conversationId = (int)$db->lastInsertId();
        }

        $insMsg = $db->prepare("INSERT INTO messages (conversation_id, role, content) VALUES (?, 'user', ?), (?, 'assistant', ?)");
        $insMsg->execute([$conversationId, $userMessage, $conversationId, $result['reply']]);
    } catch (Exception $e) {
        // ignore DB insert error for guest session
    }
}

sendJsonResponse([
    'success' => true,
    'reply' => $result['reply'],
    'conversation_id' => $conversationId,
    'provider' => 'ollama',
    'model' => $result['model'],
    'duration' => $result['total_duration'] ?? 0
]);
