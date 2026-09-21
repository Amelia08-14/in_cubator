-- Refresh tokens are stored only as SHA-256 hashes and can be rotated or revoked.
CREATE TABLE `refresh_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `familyId` CHAR(36) NOT NULL,
    `replacedById` CHAR(36) NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `userAgent` VARCHAR(512) NULL,
    `ipAddress` VARCHAR(45) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `refresh_sessions_tokenHash_key`(`tokenHash`),
    INDEX `refresh_sessions_userId_revokedAt_idx`(`userId`, `revokedAt`),
    INDEX `refresh_sessions_familyId_revokedAt_idx`(`familyId`, `revokedAt`),
    INDEX `refresh_sessions_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `refresh_sessions`
    ADD CONSTRAINT `refresh_sessions_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
