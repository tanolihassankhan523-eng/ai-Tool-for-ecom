-- CineFlow AI: MySQL Database Schema for Local XAMPP (MySQL 8.0+ / MariaDB 10.4+)
-- Created for E-commerce Video Editing Copilot & Creative Suite

CREATE DATABASE IF NOT EXISTS `videocraft_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `videocraft_db`;

-- 1. Users / Accounts (Supports Guest Mode & Optional Local Auth)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(60) NOT NULL UNIQUE,
    `email` VARCHAR(120) NULL UNIQUE,
    `password_hash` VARCHAR(255) NULL, -- Nullable for local guest mode
    `is_guest` TINYINT(1) DEFAULT 0,
    `preferred_language` VARCHAR(20) DEFAULT 'en', -- en, ur, roman_urdu
    `theme` VARCHAR(10) DEFAULT 'dark',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Projects (E-commerce clients, campaigns, video types)
CREATE TABLE IF NOT EXISTS `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL DEFAULT 1,
    `title` VARCHAR(150) NOT NULL,
    `client_name` VARCHAR(100) NULL,
    `brand_niche` VARCHAR(80) NULL, -- e.g., Skincare, Fitness, SaaS, Tech Gadget
    `video_type` ENUM('dtc', 'vsl', 'ugc', 'animation', 'music_video', 'social_promo') NOT NULL DEFAULT 'dtc',
    `target_platform` VARCHAR(50) DEFAULT 'TikTok / Reels (9:16)',
    `primary_language` VARCHAR(30) DEFAULT 'English', -- English, Roman Urdu, Urdu, Bilingual
    `aspect_ratio` VARCHAR(20) DEFAULT '9:16', -- 9:16, 16:9, 1:1, 4:5
    `target_length_sec` INT DEFAULT 30,
    `brand_guidelines` TEXT NULL,
    `deliverables_notes` TEXT NULL,
    `status` ENUM('active', 'review', 'completed', 'archived') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_user_project` (`user_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Client Briefs (Raw input, facts, assumptions, missing questions)
CREATE TABLE IF NOT EXISTS `client_briefs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `raw_text` LONGTEXT NOT NULL,
    `product_name` VARCHAR(150) NULL,
    `offer_details` TEXT NULL,
    `target_audience` TEXT NULL,
    `campaign_objective` VARCHAR(100) NULL,
    `key_benefits` TEXT NULL,
    `proof_claims` TEXT NULL,
    `objections_to_counter` TEXT NULL,
    `call_to_action` VARCHAR(255) NULL,
    `visual_rules` TEXT NULL,
    `confirmed_facts` TEXT NULL,
    `assumptions` TEXT NULL,
    `missing_information` TEXT NULL,
    `contradictions_flagged` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Chat Conversations & Sessions
CREATE TABLE IF NOT EXISTS `conversations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NULL,
    `user_id` INT NOT NULL DEFAULT 1,
    `title` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) DEFAULT 'general', -- brief_analysis, scriptwriting, hook_ideation, sound_pacing
    `active_provider` VARCHAR(40) DEFAULT 'ollama', -- ollama, gemini, etc.
    `model_name` VARCHAR(60) DEFAULT 'llama3.2',
    `is_pinned` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_project_conv` (`project_id`),
    INDEX `idx_user_conv` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Chat Messages (Multilingual, with citations and metadata)
CREATE TABLE IF NOT EXISTS `messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` INT NOT NULL,
    `role` ENUM('user', 'assistant', 'system') NOT NULL,
    `content` LONGTEXT NOT NULL,
    `language` VARCHAR(20) DEFAULT 'en', -- en, ur, roman_urdu
    `tokens_used` INT DEFAULT 0,
    `citations_json` JSON NULL, -- References to knowledge chunks
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
    FULLTEXT KEY `ft_content` (`content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Video Creative Outputs (Editor-Ready Scripts, Storyboards, Hook Packs)
CREATE TABLE IF NOT EXISTS `creative_assets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `asset_type` ENUM('hook_pack', 'script', 'storyboard', 'b_roll_list', 'sound_design', 'full_pack') NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `version` INT DEFAULT 1,
    `brief_summary` TEXT NULL,
    `hooks_json` JSON NULL,
    `script_timed_json` JSON NULL, -- [{time: '0:00-0:03', visual: '...', audio: '...', text: '...'}]
    `storyboard_json` JSON NULL,
    `broll_suggestions` TEXT NULL,
    `onscreen_text` TEXT NULL,
    `voiceover_script` TEXT NULL,
    `sound_music_notes` TEXT NULL,
    `editing_pacing_notes` TEXT NULL,
    `asset_checklist` TEXT NULL,
    `questions_assumptions` TEXT NULL,
    `raw_markdown` LONGTEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. File Library & Storage (Metadata only; physical files stored on disk)
CREATE TABLE IF NOT EXISTS `files` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NULL,
    `user_id` INT NOT NULL DEFAULT 1,
    `original_name` VARCHAR(255) NOT NULL,
    `stored_filename` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `file_size_bytes` BIGINT NOT NULL,
    `category` ENUM('brief', 'script', 'audio', 'video', 'image', 'transcript', 'other') DEFAULT 'other',
    `processing_status` ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    `error_message` VARCHAR(500) NULL,
    `media_duration_sec` FLOAT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_file_project` (`project_id`),
    INDEX `idx_file_status` (`processing_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Extracted Document Content & Chunks (For Local Search / RAG)
CREATE TABLE IF NOT EXISTS `document_chunks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `file_id` INT NOT NULL,
    `project_id` INT NULL,
    `chunk_index` INT NOT NULL,
    `page_number` INT NULL,
    `timestamp_start` FLOAT NULL,
    `timestamp_end` FLOAT NULL,
    `content` LONGTEXT NOT NULL,
    `token_count` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON DELETE CASCADE,
    FULLTEXT KEY `ft_chunk_content` (`content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Meta Ads Research Library
CREATE TABLE IF NOT EXISTS `meta_ads_research` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NULL,
    `brand_name` VARCHAR(100) NOT NULL,
    `ad_library_url` VARCHAR(500) NULL,
    `date_checked` DATE NOT NULL,
    `hook_pattern` VARCHAR(200) NULL, -- e.g., "The Negative Frame ('Stop buying X')", "Curiosity Gap"
    `offer_format` VARCHAR(150) NULL, -- e.g., "Buy 1 Get 1 50% Off + Free Shipping"
    `video_format` VARCHAR(50) DEFAULT '9:16 UGC',
    `visual_patterns` TEXT NULL, -- Fast cuts, yellow captions, split screen
    `cta_used` VARCHAR(100) NULL,
    `observed_details` TEXT NOT NULL,
    `editor_notes` TEXT NULL,
    `creative_hypothesis` TEXT NULL, -- Hypotheses generated to test
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. FAQs and Custom Editor Instructions
CREATE TABLE IF NOT EXISTS `editor_faqs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL DEFAULT 1,
    `category` VARCHAR(50) DEFAULT 'Editing Rules', -- Hook Strategy, Brand Voice, Pacing, Sound Design
    `question_trigger` VARCHAR(255) NOT NULL,
    `answer_instruction` TEXT NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. System Configuration & Provider Secrets (Encrypted / Server-side)
CREATE TABLE IF NOT EXISTS `system_settings` (
    `setting_key` VARCHAR(60) PRIMARY KEY,
    `setting_value` TEXT NULL,
    `is_secret` TINYINT(1) DEFAULT 0,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data: Default Guest User & Essential FAQs
INSERT INTO `users` (`id`, `username`, `email`, `is_guest`, `preferred_language`)
VALUES (1, 'editor_guest', 'editor@localhost.local', 1, 'en')
ON DUPLICATE KEY UPDATE `username`=`username`;

INSERT INTO `editor_faqs` (`category`, `question_trigger`, `answer_instruction`, `is_active`) VALUES
('Hook Strategy', 'What is the 3-second hook rule for DTC TikTok/Reels?', 'The first 3 seconds must achieve 3 things: (1) Visual Pattern Interrupt (unexpected movement, high contrast, problem demo), (2) Problem/Curiosity Callout (target audience pain point), (3) No slow intros or logos. Cut every redundant frame.', 1),
('Language & Localization', 'How should Roman Urdu scripts be formatted?', 'Keep Roman Urdu conversational and natural, blending common Urdu words with universal e-commerce English terms (e.g., "Yeh viral product try karo jo apka skin texture improve kare"). Provide Hindi/Urdu phonetic clarity and matching on-screen English subtitles for conversion.', 1),
('VSL Pacing', 'What is the rhythm for high-converting VSLs?', 'First 60s: Hook + The Big Problem + Emotional Agitation. Min 1-3: The Flawed Solutions. Min 3-6: The Unique Mechanism discovery. Min 6-10: Social Proof & Clinical/Real Tests. Min 10+: The Irresistible Offer Stack + Urgency.', 1),
('Editor Checklist', 'What must be included before exporting a final draft?', 'Check: (1) Safe zones for TikTok/Reels UI (keep text within 150px top/bottom and 100px right), (2) Audio loudness normalized to -14 LUFS, (3) Captions have no spelling mistakes, (4) CTA has clear directional graphic, (5) Sound effects hit on beat.', 1);
