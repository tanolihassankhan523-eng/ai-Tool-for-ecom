<?php
/**
 * CineFlow AI - Ollama Local AI Service
 * Connects to local Ollama API (http://127.0.0.1:11434)
 * Keeps all briefs and private client data strictly on the local machine
 */

require_once __DIR__ . '/../config/config.php';

class OllamaService {
    private string $baseUrl;
    private string $defaultModel;

    public function __construct(?string $baseUrl = null, ?string $defaultModel = null) {
        $this->baseUrl = rtrim($baseUrl ?: OLLAMA_BASE_URL, '/');
        $this->defaultModel = $defaultModel ?: OLLAMA_DEFAULT_MODEL;
    }

    /**
     * Check if Ollama is running locally and return available models
     */
    public function checkStatus(): array {
        $ch = curl_init($this->baseUrl . '/api/tags');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 3,
            CURLOPT_CONNECTTIMEOUT => 2,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error || $httpCode !== 200) {
            return [
                'online' => false,
                'baseUrl' => $this->baseUrl,
                'error' => $error ?: "HTTP Status: $httpCode",
                'models' => [],
                'instructions' => 'Make sure Ollama is running. Open terminal and run: ollama serve, then run: ollama run ' . $this->defaultModel
            ];
        }

        $data = json_decode($response, true);
        $models = [];
        if (isset($data['models']) && is_array($data['models'])) {
            foreach ($data['models'] as $m) {
                $models[] = $m['name'] ?? $m['model'] ?? '';
            }
        }

        return [
            'online' => true,
            'baseUrl' => $this->baseUrl,
            'models' => array_filter($models),
            'defaultModel' => $this->defaultModel
        ];
    }

    /**
     * Generate chat completion
     */
    public function chat(array $messages, ?string $model = null, array $options = []): array {
        $targetModel = $model ?: $this->defaultModel;
        $url = $this->baseUrl . '/api/chat';

        $payload = [
            'model' => $targetModel,
            'messages' => $messages,
            'stream' => false,
            'options' => array_merge([
                'temperature' => 0.7,
                'num_predict' => 2048,
            ], $options)
        ];

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_TIMEOUT => 120, // AI generation can take time locally
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError || $httpCode !== 200) {
            return [
                'success' => false,
                'error' => $curlError ?: "Ollama returned HTTP $httpCode: $response",
                'provider' => 'ollama',
                'model' => $targetModel
            ];
        }

        $result = json_decode($response, true);
        $reply = $result['message']['content'] ?? '';

        return [
            'success' => true,
            'reply' => $reply,
            'provider' => 'ollama',
            'model' => $targetModel,
            'total_duration' => $result['total_duration'] ?? 0,
            'eval_count' => $result['eval_count'] ?? 0
        ];
    }
}
