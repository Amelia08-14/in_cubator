-- AlterTable
ALTER TABLE `users` ADD COLUMN `fullName` VARCHAR(120) NULL,
    ADD COLUMN `permissions` JSON NULL;
