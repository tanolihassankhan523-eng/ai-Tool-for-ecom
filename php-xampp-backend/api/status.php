<?php
/**
 * CineFlow AI - Health & Status Check Endpoint
 * Checks MySQL connection and Ollama local server status
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/OllamaService.php';

$response = [
    'app' => APP_NAME,
    'version' => APP_VERSION,
    'php_version' => PHP_VERSION,
    'timestamp' => date('c'),
    'database' => ['connected' => false, 'error' => null],
    'ollama' => ['online' => false, 'models' => []]
];

// Check Database
try {
    $db = Database::getConnection();
    $stmt = $db->query("SELECT 1");
    $response['database']['connected'] = true;
} catch (Exception $e) {
    $response['database']['error'] = $e->getMessage();
}

// Check Ollama
$ollama = new OllamaService();
$response['ollama'] = $ollama->checkStatus();

sendJsonResponse($response);
