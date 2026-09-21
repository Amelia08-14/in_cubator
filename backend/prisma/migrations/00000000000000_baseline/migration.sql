-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('PORTEUR_STARTUP', 'MENTOR_EXPERT', 'INVESTISSEUR', 'PARTENAIRE', 'GESTIONNAIRE', 'ADMIN') NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `startup_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `secteurs` JSON NOT NULL,
    `stade` ENUM('IDEE', 'PROTOTYPE', 'EARLY_TRACTION', 'SCALE') NOT NULL,
    `description` TEXT NOT NULL,
    `pitchResume` TEXT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `siteWeb` VARCHAR(191) NULL,
    `besoins` JSON NOT NULL,
    `cohorteId` VARCHAR(191) NULL,
    `visiblePublic` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `startup_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mentor_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nomComplet` VARCHAR(191) NOT NULL DEFAULT 'Mentor Inconnu',
    `expertise` JSON NOT NULL,
    `secteurs` JSON NOT NULL,
    `langues` JSON NOT NULL,
    `bio` TEXT NOT NULL,
    `titreFonction` VARCHAR(191) NULL,
    `linkedinUrl` VARCHAR(191) NULL,
    `tarifIndicatif` VARCHAR(191) NULL,
    `noteMoyenne` DOUBLE NOT NULL DEFAULT 0,
    `actif` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `mentor_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investor_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `organisation` VARCHAR(191) NULL,
    `typeInvestisseur` VARCHAR(191) NULL,
    `siteWeb` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `secteursCibles` JSON NOT NULL,
    `stadesCibles` JSON NOT NULL,
    `ticketMin` INTEGER NULL,
    `ticketMax` INTEGER NULL,
    `zoneGeographique` VARCHAR(191) NULL,
    `emailAlerts` BOOLEAN NOT NULL DEFAULT true,
    `watchlistAlerts` BOOLEAN NOT NULL DEFAULT true,
    `logoUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `investor_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partner_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `organisation` VARCHAR(191) NOT NULL,
    `typePartenaire` ENUM('HOPITAL', 'INDUSTRIEL', 'UNIVERSITE', 'INSTITUTION', 'AUTRE') NOT NULL,
    `besoinsExprimes` TEXT NULL,

    UNIQUE INDEX `partner_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cohortes` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `dateDebut` DATETIME(3) NOT NULL,
    `dateFin` DATETIME(3) NOT NULL,
    `statut` ENUM('OUVERTE_CANDIDATURES', 'EN_COURS', 'TERMINEE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidatures` (
    `id` VARCHAR(191) NOT NULL,
    `startupId` VARCHAR(191) NOT NULL,
    `cohorteId` VARCHAR(191) NOT NULL,
    `reponses` JSON NOT NULL,
    `statut` ENUM('SOUMISE', 'EN_EVALUATION', 'ENTRETIEN_PLANIFIE', 'ACCEPTEE', 'LISTE_ATTENTE', 'REFUSEE') NOT NULL DEFAULT 'SOUMISE',
    `score` INTEGER NULL,
    `evaluateurId` VARCHAR(191) NULL,
    `motifDecision` TEXT NULL,
    `rapportPdfUrl` VARCHAR(191) NULL,
    `dateDecision` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `candidatures_startupId_key`(`startupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_members` (
    `id` VARCHAR(191) NOT NULL,
    `startupId` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `linkedin` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `objectifs` (
    `id` VARCHAR(191) NOT NULL,
    `startupId` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `dateEcheance` DATETIME(3) NULL,
    `statut` ENUM('A_FAIRE', 'EN_COURS', 'TERMINE', 'EN_RETARD') NOT NULL DEFAULT 'A_FAIRE',
    `creePar` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taches` (
    `id` VARCHAR(191) NOT NULL,
    `startupId` VARCHAR(191) NOT NULL,
    `objectifId` VARCHAR(191) NULL,
    `titre` VARCHAR(191) NOT NULL,
    `statut` ENUM('A_FAIRE', 'EN_COURS', 'TERMINE', 'EN_RETARD') NOT NULL DEFAULT 'A_FAIRE',
    `assigneA` VARCHAR(191) NULL,
    `creePar` VARCHAR(191) NOT NULL,
    `dateEcheance` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disponibilites` (
    `id` VARCHAR(191) NOT NULL,
    `mentorId` VARCHAR(191) NOT NULL,
    `dateDebut` DATETIME(3) NOT NULL,
    `dateFin` DATETIME(3) NOT NULL,
    `format` VARCHAR(191) NOT NULL DEFAULT 'Visioconférence',
    `type` VARCHAR(191) NOT NULL DEFAULT 'Individuel',
    `capacity` INTEGER NULL,
    `reservee` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meetings` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('MENTORAT', 'INVESTISSEUR', 'AUTRE') NOT NULL,
    `startupId` VARCHAR(191) NOT NULL,
    `mentorId` VARCHAR(191) NULL,
    `investisseurId` VARCHAR(191) NULL,
    `disponibiliteId` VARCHAR(191) NULL,
    `demandeParId` VARCHAR(191) NOT NULL,
    `statut` ENUM('DEMANDE', 'CONFIRME', 'ANNULE', 'TERMINE') NOT NULL DEFAULT 'DEMANDE',
    `notes` TEXT NULL,
    `noteMentorat` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meetings_disponibiliteId_key`(`disponibiliteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `startupId` VARCHAR(191) NOT NULL,
    `type` ENUM('PITCH_DECK', 'BUSINESS_PLAN', 'KPI_REPORT', 'FINANCIER', 'CANDIDATURE', 'AUTRE') NOT NULL,
    `fichierUrl` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `visibleInvestisseurs` BOOLEAN NOT NULL DEFAULT false,
    `uploadeParId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acces_deal_room` (
    `id` VARCHAR(191) NOT NULL,
    `startupId` VARCHAR(191) NOT NULL,
    `investisseurId` VARCHAR(191) NOT NULL,
    `statut` ENUM('DEMANDE', 'ACCORDE', 'REVOQUE', 'REFUSE') NOT NULL DEFAULT 'DEMANDE',
    `accordeParId` VARCHAR(191) NULL,
    `dateAcces` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `acces_deal_room_startupId_investisseurId_key`(`startupId`, `investisseurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `watchlists` (
    `id` VARCHAR(191) NOT NULL,
    `investisseurId` VARCHAR(191) NOT NULL,
    `startupId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `watchlists_investisseurId_startupId_key`(`investisseurId`, `startupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ressources` (
    `id` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `categorie` ENUM('BUSINESS_PLAN', 'PITCH_DECK', 'JURIDIQUE', 'FINANCIER', 'REGLEMENTAIRE', 'AUTRE') NOT NULL,
    `fichierUrl` VARCHAR(191) NOT NULL,
    `tags` JSON NOT NULL,
    `nbTelechargements` INTEGER NOT NULL DEFAULT 0,
    `publieLe` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `lienUrl` VARCHAR(191) NULL,
    `lu` BOOLEAN NOT NULL DEFAULT false,
    `canal` ENUM('IN_APP', 'EMAIL') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `contenu` TEXT NOT NULL,
    `publieLe` DATETIME(3) NULL,
    `misAJourParId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pages_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entite` VARCHAR(191) NOT NULL,
    `entiteId` VARCHAR(191) NOT NULL,
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `startup_profiles` ADD CONSTRAINT `startup_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `startup_profiles` ADD CONSTRAINT `startup_profiles_cohorteId_fkey` FOREIGN KEY (`cohorteId`) REFERENCES `cohortes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mentor_profiles` ADD CONSTRAINT `mentor_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investor_profiles` ADD CONSTRAINT `investor_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `partner_profiles` ADD CONSTRAINT `partner_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidatures` ADD CONSTRAINT `candidatures_startupId_fkey` FOREIGN KEY (`startupId`) REFERENCES `startup_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidatures` ADD CONSTRAINT `candidatures_cohorteId_fkey` FOREIGN KEY (`cohorteId`) REFERENCES `cohortes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_startupId_fkey` FOREIGN KEY (`startupId`) REFERENCES `startup_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `objectifs` ADD CONSTRAINT `objectifs_startupId_fkey` FOREIGN KEY (`startupId`) REFERENCES `startup_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taches` ADD CONSTRAINT `taches_startupId_fkey` FOREIGN KEY (`startupId`) REFERENCES `startup_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taches` ADD CONSTRAINT `taches_objectifId_fkey` FOREIGN KEY (`objectifId`) REFERENCES `objectifs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taches` ADD CONSTRAINT `taches_assigneA_fkey` FOREIGN KEY (`assigneA`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taches` ADD CONSTRAINT `taches_creePar_fkey` FOREIGN KEY (`creePar`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disponibilites` ADD CONSTRAINT `disponibilites_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `mentor_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_startupId_fkey` FOREIGN KEY (`startupId`) REFERENCES `startup_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `mentor_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_investisseurId_fkey` FOREIGN KEY (`investisseurId`) REFERENCES `investor_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_disponibiliteId_fkey` FOREIGN KEY (`disponibiliteId`) REFERENCES `disponibilites`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_demandeParId_fkey` FOREIGN KEY (`demandeParId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_startupId_fkey` FOREIGN KEY (`startupId`) REFERENCES `startup_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_uploadeParId_fkey` FOREIGN KEY (`uploadeParId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acces_deal_room` ADD CONSTRAINT `acces_deal_room_startupId_fkey` FOREIGN KEY (`startupId`) REFERENCES `startup_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acces_deal_room` ADD CONSTRAINT `acces_deal_room_investisseurId_fkey` FOREIGN KEY (`investisseurId`) REFERENCES `investor_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acces_deal_room` ADD CONSTRAINT `acces_deal_room_accordeParId_fkey` FOREIGN KEY (`accordeParId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `watchlists` ADD CONSTRAINT `watchlists_investisseurId_fkey` FOREIGN KEY (`investisseurId`) REFERENCES `investor_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `watchlists` ADD CONSTRAINT `watchlists_startupId_fkey` FOREIGN KEY (`startupId`) REFERENCES `startup_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
