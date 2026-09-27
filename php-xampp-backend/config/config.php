<?php
/**
 * CineFlow AI - Configuration File (PHP 8+)
 * Safe defaults for XAMPP Windows localhost deployment
 */

// Disable direct error output in production, display in dev
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// App Base Constants
define('APP_NAME', 'CineFlow AI - Video Creative Copilot');
define('APP_VERSION', '1.0.0');
define('APP_ENV', 'development'); // 'development' or 'production'

// Base Directory Paths
define('BASE_PATH', dirname(__DIR__));
define('STORAGE_PATH', BASE_PATH . DIRECTORY_SEPARATOR . 'storage');
define('UPLOADS_PATH', STORAGE_PATH . DIRECTORY_SEPARATOR . 'uploads');

// Ensure storage directories exist
if (!is_dir(STORAGE_PATH)) {
    mkdir(STORAGE_PATH, 0755, true);
}
if (!is_dir(UPLOADS_PATH)) {
    mkdir(UPLOADS_PATH, 0755, true);
}

// Database Credentials (Standard XAMPP default: root, empty password)
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'videocraft_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Local AI Provider (Ollama)
define('OLLAMA_BASE_URL', 'http://127.0.0.1:11434');
define('OLLAMA_DEFAULT_MODEL', 'llama3.2'); // recommended: llama3.2, mistral, or qwen2.5

// Optional Cloud Fallback (Disabled by default to avoid unintended cloud usage)
define('ENABLE_CLOUD_FALLBACK', false);
define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');

// Security & Upload Rules
define('MAX_UPLOAD_BYTES', 50 * 1024 * 1024); // 50MB
define('ALLOWED_EXTENSIONS', ['pdf', 'docx', 'txt', 'md', 'mp3', 'wav', 'mp4', 'mov', 'jpg', 'png', 'webp']);

// Session handling
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Standard JSON Response Helper
 */
function sendJsonResponse(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Handle preflight CORS OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(200);
    exit;
}
