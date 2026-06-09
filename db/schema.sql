CREATE DATABASE IF NOT EXISTS ps3d
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'pc3d'@'%' IDENTIFIED BY '012345678';
GRANT ALL PRIVILEGES ON ps3d.* TO 'pc3d'@'%';
FLUSH PRIVILEGES;

USE ps3d;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token VARCHAR(512) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sessions_token (token),
  KEY idx_sessions_user_id (user_id),
  KEY idx_sessions_expires_at (expires_at),
  CONSTRAINT fk_sessions_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_runs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME NULL,
  score INT NOT NULL DEFAULT 0,
  current_view ENUM('landing', 'assembly', 'quiz', 'complete') NOT NULL DEFAULT 'landing',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  KEY idx_game_runs_user_id (user_id),
  KEY idx_game_runs_started_at (started_at),
  CONSTRAINT fk_game_runs_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_run_parts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  game_run_id BIGINT UNSIGNED NOT NULL,
  part_id VARCHAR(100) NOT NULL,
  part_order INT NOT NULL,
  placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_game_run_parts_run_part (game_run_id, part_id),
  KEY idx_game_run_parts_game_run_id (game_run_id),
  CONSTRAINT fk_game_run_parts_game_run_id
    FOREIGN KEY (game_run_id) REFERENCES game_runs (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  game_run_id BIGINT UNSIGNED NOT NULL,
  question_key VARCHAR(100) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_quiz_answers_run_question (game_run_id, question_key),
  KEY idx_quiz_answers_game_run_id (game_run_id),
  CONSTRAINT fk_quiz_answers_game_run_id
    FOREIGN KEY (game_run_id) REFERENCES game_runs (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tables to store API request/response data
CREATE TABLE IF NOT EXISTS api_calls (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  headers JSON NULL,
  request_body JSON NULL,
  response_body JSON NULL,
  status_code INT NULL,
  latency_ms INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_api_calls_endpoint (endpoint),
  KEY idx_api_calls_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS api_metrics (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  metric_key VARCHAR(100) NOT NULL,
  metric_value DOUBLE NOT NULL,
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_api_metrics_key (metric_key),
  KEY idx_api_metrics_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create a dedicated limited DB user for API operations
-- NOTE: replace the password below if you prefer a different one.
CREATE USER IF NOT EXISTS 'api_user'@'%' IDENTIFIED BY 'W8k9s!f3NqP2rT6vZxY4uB1L';
GRANT SELECT, INSERT, UPDATE, DELETE ON ps3d.* TO 'api_user'@'%';
FLUSH PRIVILEGES;