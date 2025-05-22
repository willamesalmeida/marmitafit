-- AlterTable
ALTER TABLE `user` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `profileImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `profilePublicId` VARCHAR(191) NULL;
