<?php
/**
 * CineFlow AI - Database Connection Manager (PDO)
 * Provides prepared statement execution, connection pooling, and error handling
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;

    private function __construct() {}
    private function __clone() {}

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                DB_HOST,
                DB_PORT,
                DB_NAME,
                DB_CHARSET
            );

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // If database doesn't exist yet, provide helpful message
                sendJsonResponse([
                    'success' => false,
                    'error' => 'Database connection failed: ' . $e->getMessage(),
                    'hint' => 'Ensure MySQL is running in XAMPP and you have imported database/schema.sql into videocraft_db'
                ], 500);
            }
        }

        return self::$instance;
    }
}
