/*
  Warnings:

  - A unique constraint covering the columns `[name,section_id]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Chapter_name_key` ON `Chapter`;

-- CreateIndex
CREATE UNIQUE INDEX `Chapter_name_section_id_key` ON `Chapter`(`name`, `section_id`);
