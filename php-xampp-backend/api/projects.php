<?php
/**
 * CineFlow AI - Projects API Endpoint (PHP 8+)
 * Manages video editing projects, client specifications, and deliverables
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}

if ($method === 'GET') {
    $stmt = $db->query("
        SELECT p.*, 
            (SELECT COUNT(*) FROM client_briefs cb WHERE cb.project_id = p.id) as briefs_count,
            (SELECT COUNT(*) FROM creative_assets ca WHERE ca.project_id = p.id) as assets_count
        FROM projects p 
        ORDER BY p.updated_at DESC
    ");
    $projects = $stmt->fetchAll();
    sendJsonResponse(['success' => true, 'projects' => $projects]);
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: [];

    $title = trim($data['title'] ?? '');
    if (empty($title)) {
        sendJsonResponse(['success' => false, 'error' => 'Project title is required'], 400);
    }

    $clientName = trim($data['client_name'] ?? '');
    $brandNiche = trim($data['brand_niche'] ?? 'E-commerce');
    $videoType = trim($data['video_type'] ?? 'dtc');
    $targetPlatform = trim($data['target_platform'] ?? 'TikTok / Reels (9:16)');
    $primaryLanguage = trim($data['primary_language'] ?? 'English');
    $aspectRatio = trim($data['aspect_ratio'] ?? '9:16');
    $targetLengthSec = (int)($data['target_length_sec'] ?? 30);
    $brandGuidelines = trim($data['brand_guidelines'] ?? '');
    $deliverablesNotes = trim($data['deliverables_notes'] ?? '');

    $stmt = $db->prepare("INSERT INTO projects (
        user_id, title, client_name, brand_niche, video_type, target_platform,
        primary_language, aspect_ratio, target_length_sec, brand_guidelines, deliverables_notes
    ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->execute([
        $title, $clientName, $brandNiche, $videoType, $targetPlatform,
        $primaryLanguage, $aspectRatio, $targetLengthSec, $brandGuidelines, $deliverablesNotes
    ]);

    $projectId = (int)$db->lastInsertId();

    sendJsonResponse([
        'success' => true,
        'project_id' => $projectId,
        'message' => 'Project created successfully'
    ], 201);
}
