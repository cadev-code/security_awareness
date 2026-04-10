/*
  Warnings:

  - Added the required column `section_id` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Chapter` ADD COLUMN `section_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
