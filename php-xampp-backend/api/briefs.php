<?php
/**
 * CineFlow AI - Briefs API Endpoint (PHP 8+)
 * Extracts structured data from raw briefs and stores them in MySQL
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/BriefAnalyzerService.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: [];

    $briefText = trim($data['brief_text'] ?? '');
    $projectId = (int)($data['project_id'] ?? 0);
    $model = trim($data['model'] ?? OLLAMA_DEFAULT_MODEL);

    if (empty($briefText)) {
        sendJsonResponse(['success' => false, 'error' => 'Brief text cannot be empty'], 400);
    }

    $analyzer = new BriefAnalyzerService();
    $analysisResult = $analyzer->analyze($briefText, $model);

    if (!$analysisResult['success']) {
        sendJsonResponse($analysisResult, 500);
    }

    // Save to database if connected and project_id provided
    $savedBriefId = null;
    try {
        $db = Database::getConnection();
        if ($projectId > 0) {
            $parsed = $analysisResult['data'] ?? [];
            $ins = $db->prepare("INSERT INTO client_briefs (
                project_id, raw_text, product_name, offer_details, target_audience,
                campaign_objective, key_benefits, proof_claims, objections_to_counter,
                call_to_action, visual_rules, confirmed_facts, assumptions,
                missing_information, contradictions_flagged
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $ins->execute([
                $projectId,
                $briefText,
                $parsed['productName'] ?? 'Untitled',
                $parsed['offerAndPricing'] ?? null,
                $parsed['targetAudience'] ?? null,
                $parsed['campaignObjective'] ?? null,
                json_encode($parsed['keyBenefitsAndClaims'] ?? [], JSON_UNESCAPED_UNICODE),
                null,
                json_encode($parsed['objectionsToCounter'] ?? [], JSON_UNESCAPED_UNICODE),
                $parsed['callToAction'] ?? null,
                json_encode($parsed['brandRulesAndRestrictions'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($parsed['confirmedFacts'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($parsed['assumptionsAndHypotheses'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($parsed['missingInformationQuestions'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($parsed['flaggedContradictions'] ?? [], JSON_UNESCAPED_UNICODE)
            ]);
            $savedBriefId = (int)$db->lastInsertId();
        }
    } catch (Exception $e) {
        // continue without crashing if db not ready
    }

    sendJsonResponse([
        'success' => true,
        'analysis' => $analysisResult['data'] ?? null,
        'raw_reply' => $analysisResult['reply'] ?? null,
        'saved_brief_id' => $savedBriefId,
        'model' => $analysisResult['model']
    ]);
}

if ($method === 'GET') {
    // List briefs for a project
    $projectId = (int)($_GET['project_id'] ?? 0);
    try {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM client_briefs WHERE project_id = ? ORDER BY id DESC");
        $stmt->execute([$projectId]);
        $briefs = $stmt->fetchAll();
        sendJsonResponse(['success' => true, 'briefs' => $briefs]);
    } catch (Exception $e) {
        sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}
