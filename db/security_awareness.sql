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