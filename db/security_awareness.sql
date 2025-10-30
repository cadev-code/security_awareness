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

CREATE TABLE videos_temporada2 (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `cover` VARCHAR (255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `availability` DATE NOT NULL,
  `url_questions` VARCHAR(255) NOT NULL DEFAULT "not-url",
  PRIMARY KEY (`id`)
);