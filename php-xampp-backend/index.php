<?php
/**
 * CineFlow AI - Local Web Gateway & Diagnostic Interface (PHP 8+)
 * Provides status, system diagnostic, API documentation, and testing tools
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/services/OllamaService.php';

$ollama = new OllamaService();
$ollamaStatus = $ollama->checkStatus();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars(APP_NAME) ?> - Local PHP Backend</title>
    <style>
        :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --accent: #6366f1; --success: #10b981; --warn: #f59e0b; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
        .container { max-width: 900px; margin: 0 auto; }
        .card { background: var(--card); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #334155; }
        .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; }
        .badge-success { background: rgba(16, 185, 129, 0.2); color: var(--success); }
        .badge-warn { background: rgba(245, 158, 11, 0.2); color: var(--warn); }
        h1, h2, h3 { margin-top: 0; }
        pre { background: #090d16; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem; color: #a5b4fc; }
        code { font-family: Consolas, monospace; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    </style>
</head>
<body>
<div class="container">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
        <div>
            <h1><?= htmlspecialchars(APP_NAME) ?></h1>
            <p style="color:#94a3b8; margin:0;">XAMPP Windows Local PHP Backend & Ollama Gateway</p>
        </div>
        <span class="badge <?= $ollamaStatus['online'] ? 'badge-success' : 'badge-warn' ?>">
            <?= $ollamaStatus['online'] ? '● Ollama Connected' : '○ Ollama Offline' ?>
        </span>
    </div>

    <div class="grid">
        <div class="card">
            <h3>PHP Environment</h3>
            <p><strong>Version:</strong> PHP <?= PHP_VERSION ?></p>
            <p><strong>Base Path:</strong> <code><?= htmlspecialchars(BASE_PATH) ?></code></p>
            <p><strong>Uploads Directory:</strong> <?= is_writable(UPLOADS_PATH) ? '✅ Writable' : '❌ Not writable' ?></p>
            <p><strong>MySQL Default:</strong> <?= DB_HOST ?>:<?= DB_PORT ?> / <?= DB_NAME ?></p>
        </div>

        <div class="card">
            <h3>Ollama Local AI Runtime</h3>
            <p><strong>Endpoint:</strong> <code><?= htmlspecialchars($ollamaStatus['baseUrl']) ?></code></p>
            <p><strong>Status:</strong> <?= $ollamaStatus['online'] ? 'Ready for private local inference' : 'Offline / Not reachable' ?></p>
            <p><strong>Available Models:</strong> <?= empty($ollamaStatus['models']) ? 'None found (run: ollama pull llama3.2)' : implode(', ', $ollamaStatus['models']) ?></p>
        </div>
    </div>

    <div class="card">
        <h3>Available Local API Endpoints</h3>
        <ul>
            <li><code>POST /api/chat.php</code> - Multilingual AI chat with project context & FAQs</li>
            <li><code>POST /api/briefs.php</code> - Deep brief extraction with fact/assumption segregation</li>
            <li><code>GET /api/projects.php</code> - List client video projects</li>
            <li><code>POST /api/projects.php</code> - Create a new video editing project</li>
            <li><code>GET /api/status.php</code> - Comprehensive system and database health check</li>
        </ul>
    </div>
</div>
</body>
</html>
