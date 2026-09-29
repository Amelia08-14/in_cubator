-- CreateTable
CREATE TABLE `events` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `summary` VARCHAR(280) NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('CONFERENCE', 'ATELIER', 'NETWORKING', 'MASTERCLASS', 'DEMO_DAY') NOT NULL,
    `origin` ENUM('IN_EVENT', 'EXTERNAL', 'CO_ORGANIZED') NOT NULL DEFAULT 'IN_EVENT',
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `location` VARCHAR(191) NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `coverImage` VARCHAR(1024) NULL,
    `videoUrl` VARCHAR(1024) NULL,
    `coOrganizerName` VARCHAR(191) NULL,
    `registrationsOpen` BOOLEAN NOT NULL DEFAULT true,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `events_slug_key`(`slug`),
    INDEX `events_status_startAt_idx`(`status`, `startAt`),
    INDEX `events_startAt_idx`(`startAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_registrations` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `organization` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `status` ENUM('REGISTERED', 'ATTENDED', 'CANCELLED') NOT NULL DEFAULT 'REGISTERED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `event_registrations_eventId_status_idx`(`eventId`, `status`),
    UNIQUE INDEX `event_registrations_eventId_email_key`(`eventId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event_registrations` ADD CONSTRAINT `event_registrations_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
