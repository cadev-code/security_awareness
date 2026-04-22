-- DropForeignKey
ALTER TABLE `Chapter` DROP FOREIGN KEY `Chapter_section_id_fkey`;

-- DropIndex
DROP INDEX `Chapter_section_id_fkey` ON `Chapter`;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
