-- CreateTable
CREATE TABLE `leads` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `contactName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NULL,
    `type` ENUM('STARTUP', 'INVESTISSEUR', 'PARTENAIRE', 'MENTOR', 'DIASPORA', 'AUTRE') NOT NULL DEFAULT 'STARTUP',
    `source` ENUM('SITE_WEB', 'CANDIDATURE', 'EVENEMENT', 'RECOMMANDATION', 'PARTENAIRE', 'RESEAUX_SOCIAUX', 'TELEPHONE', 'IN_NETWORK', 'AUTRE') NOT NULL DEFAULT 'AUTRE',
    `stage` ENUM('NOUVEAU', 'DIAGNOSTIC', 'ACCOMPAGNEMENT', 'TEST_TERRAIN', 'RESEAU', 'FORMATIONS', 'LANCEMENT') NOT NULL DEFAULT 'NOUVEAU',
    `status` ENUM('OUVERT', 'GAGNE', 'PERDU') NOT NULL DEFAULT 'OUVERT',
    `priority` INTEGER NOT NULL DEFAULT 0,
    `score` INTEGER NULL,
    `message` TEXT NULL,
    `lostReason` VARCHAR(191) NULL,
    `nextActivityAt` DATETIME(3) NULL,
    `candidatureId` VARCHAR(191) NULL,
    `assignedToId` VARCHAR(191) NULL,
    `stageChangedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `wonAt` DATETIME(3) NULL,
    `lostAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `leads_reference_key`(`reference`),
    UNIQUE INDEX `leads_candidatureId_key`(`candidatureId`),
    INDEX `leads_status_stage_idx`(`status`, `stage`),
    INDEX `leads_assignedToId_idx`(`assignedToId`),
    INDEX `leads_createdAt_idx`(`createdAt`),
    INDEX `leads_nextActivityAt_idx`(`nextActivityAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_activities` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NULL,
    `type` ENUM('NOTE', 'APPEL', 'EMAIL', 'REUNION', 'TACHE', 'SYSTEME') NOT NULL DEFAULT 'NOTE',
    `content` TEXT NOT NULL,
    `dueAt` DATETIME(3) NULL,
    `doneAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `lead_activities_leadId_createdAt_idx`(`leadId`, `createdAt`),
    INDEX `lead_activities_dueAt_doneAt_idx`(`dueAt`, `doneAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_activities` ADD CONSTRAINT `lead_activities_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_activities` ADD CONSTRAINT `lead_activities_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

