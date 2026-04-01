CREATE DATABASE IF NOT EXISTS  security_awareness;

USE security_awareness;

CREATE TABLE posts (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

ALTER TABLE posts ADD `availability` INT NOT NULL DEFAULT 0;

ALTER TABLE posts ADD `url_questions` VARCHAR(255) NOT NULL DEFAULT "not-url";

CREATE TABLE videos (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `cover` VARCHAR (255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `availability` INT NOT NULL DEFAULT 0,
  `url_questions` VARCHAR(255) NOT NULL DEFAULT "not-url",
  PRIMARY KEY (`id`)
);

CREATE TABLE newsletters (
  `id` INT AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `cover` VARCHAR (255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `availability` DATE NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE videos_temporada3 (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `cover` VARCHAR (255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `availability` DATE NOT NULL,
  `url_questions` VARCHAR(255) NOT NULL DEFAULT "not-url",
  PRIMARY KEY (`id`)
);

CREATE TABLE videos_psswrd (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `cover` VARCHAR (255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `availability` DATE NOT NULL,
  `url_questions` VARCHAR(255) NOT NULL DEFAULT "not-url",
  PRIMARY KEY (`id`)
);

CREATE TABLE videos_temporada4 (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `cover` VARCHAR (255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `availability` DATE NOT NULL,
  `url_questions` VARCHAR(255) NOT NULL DEFAULT "not-url",
  PRIMARY KEY (`id`)
);

CREATE TABLE videos_temporada5 (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `cover` VARCHAR (255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `availability` DATE NOT NULL,
  `url_questions` VARCHAR(255) NOT NULL DEFAULT "not-url",
  PRIMARY KEY (`id`)
);

-- ─────────────────────────────────────────────
-- CMS tables (admin panel)
-- ─────────────────────────────────────────────

CREATE TABLE admin_users (
  `id`            INT AUTO_INCREMENT,
  `username`      VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Default credentials: admin / admin123  (change after first login!)
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$TcrOyI0O03rTei17/AsYReM5zd7SlqFM4OiFeIRDbrXu7ae0bdVnS');

CREATE TABLE sections (
  `id`             INT AUTO_INCREMENT,
  `name`           VARCHAR(255) NOT NULL,
  `slug`           VARCHAR(255) NOT NULL UNIQUE,
  `icon`           VARCHAR(100) NOT NULL DEFAULT 'Clapperboard',
  `type`           ENUM('video','podcast','newsletter','custom') NOT NULL DEFAULT 'video',
  `layout`         ENUM('grid','flex') NOT NULL DEFAULT 'grid',
  `card_style`     ENUM('default','date-badge','wide') NOT NULL DEFAULT 'default',
  `bg_image`       VARCHAR(255) DEFAULT NULL,
  `section_logo`   VARCHAR(255) DEFAULT NULL,
  `color_theme`    VARCHAR(20) NOT NULL DEFAULT '#000d04',
  `items_per_page` INT DEFAULT NULL,
  `sort_order`     INT NOT NULL DEFAULT 0,
  `visible`        TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`     DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO sections (name, slug, icon, type, layout, card_style, bg_image, section_logo, color_theme, items_per_page, sort_order) VALUES
  ('Inicio',      'home',       'Home',          'custom',     'flex', 'default',    NULL,                        NULL,                    '#000d04', NULL, 1),
  ('Seg. Informa','information','ScrollText',     'custom',     'flex', 'default',    NULL,                        NULL,                    '#00092e', NULL, 2),
  ('Temporada 1', 'temporada-1','AudioWaveform',  'podcast',    'flex', 'default',    NULL,                        'podcast-footer.png',    '#000d04', NULL, 3),
  ('Temporada 2', 'temporada-2','Clapperboard',   'video',      'grid', 'default',    'temporada2-fondo.jpg',      'logo-temporada2.png',   '#010302', NULL, 4),
  ('Oct SI',      'oct-si',     'Newspaper',      'newsletter', 'grid', 'default',    'newsletter-fondo.jpg',      'logo-newsletter.png',   '#00252e', NULL, 5),
  ('Temporada 3', 'temporada-3','Clapperboard',   'video',      'grid', 'date-badge', 'temporada3-fondo.jpg',      'logo-temporada3.png',   '#004fa1', NULL, 6),
  ('PSSWRD',      'psswrd',     'Lock',           'video',      'grid', 'date-badge', 'psswrd-fondo.jpg',          'logo-psswrd.png',       '#013d83', NULL, 7),
  ('Temporada 4', 'temporada-4','Clapperboard',   'video',      'flex', 'wide',       'temporada4-fondo.jpg',      'logo-temporada4.png',   '#001449', NULL, 8),
  ('Temporada 5', 'temporada-5','Clapperboard',   'video',      'flex', 'wide',       'temporada5-fondo.jpg',      'logo-temporada5.png',   '#002a58', 4,    9);

CREATE TABLE content_items (
  `id`            INT AUTO_INCREMENT,
  `section_id`    INT NOT NULL,
  `title`         VARCHAR(255) DEFAULT NULL,
  `filename`      VARCHAR(255) NOT NULL,
  `cover`         VARCHAR(255) DEFAULT NULL,
  `availability`  DATE NOT NULL DEFAULT '2000-01-01',
  `url_questions` VARCHAR(255) NOT NULL DEFAULT 'not-url',
  `content_type`  ENUM('video','audio','image','pdf') NOT NULL DEFAULT 'video',
  `sort_order`    INT NOT NULL DEFAULT 0,
  `visible`       TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`section_id`) REFERENCES sections(`id`) ON DELETE CASCADE
);

-- Migrate existing data into content_items
INSERT INTO content_items (section_id, title, filename, cover, availability, url_questions, content_type, sort_order)
SELECT (SELECT id FROM sections WHERE slug = 'temporada-1'), p.title, p.filename, NULL,
  CASE WHEN p.availability = 1 THEN '2000-01-01' ELSE '2099-12-31' END,
  p.url_questions, 'audio', p.id FROM posts p;

INSERT INTO content_items (section_id, title, filename, cover, availability, url_questions, content_type, sort_order)
SELECT (SELECT id FROM sections WHERE slug = 'temporada-2'), v.title, v.filename, v.cover,
  CASE WHEN v.availability = 1 THEN '2000-01-01' ELSE '2099-12-31' END,
  v.url_questions, 'video', v.id FROM videos v;

INSERT INTO content_items (section_id, title, filename, cover, availability, url_questions, content_type, sort_order)
SELECT (SELECT id FROM sections WHERE slug = 'oct-si'), NULL, n.filename, n.cover,
  n.availability, 'not-url', 'pdf', n.id FROM newsletters n;

INSERT INTO content_items (section_id, title, filename, cover, availability, url_questions, content_type, sort_order)
SELECT (SELECT id FROM sections WHERE slug = 'temporada-3'), v.title, v.filename, v.cover,
  v.availability, v.url_questions, 'video', v.id FROM videos_temporada3 v;

INSERT INTO content_items (section_id, title, filename, cover, availability, url_questions, content_type, sort_order)
SELECT (SELECT id FROM sections WHERE slug = 'psswrd'), v.title, v.filename, v.cover,
  v.availability, v.url_questions, 'video', v.id FROM videos_psswrd v;

INSERT INTO content_items (section_id, title, filename, cover, availability, url_questions, content_type, sort_order)
SELECT (SELECT id FROM sections WHERE slug = 'temporada-4'), v.title, v.filename, v.cover,
  v.availability, v.url_questions, 'video', v.id FROM videos_temporada4 v;

INSERT INTO content_items (section_id, title, filename, cover, availability, url_questions, content_type, sort_order)
SELECT (SELECT id FROM sections WHERE slug = 'temporada-5'), v.title, v.filename, v.cover,
  v.availability, v.url_questions, 'video', v.id FROM videos_temporada5 v;