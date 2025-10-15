-- DropForeignKey
ALTER TABLE `refreshtoken` DROP FOREIGN KEY `RefreshToken_userId_fkey`;

-- DropIndex
DROP INDEX `RefreshToken_userId_key` ON `refreshtoken`;

-- AlterTable
ALTER TABLE `refreshtoken` ADD COLUMN `deviceId` VARCHAR(191) NULL;


