/*
  Warnings:

  - You are about to drop the `poduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `birthday` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `complement` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `birthday` DATETIME(3) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `complement` VARCHAR(191) NOT NULL,
    ADD COLUMN `district` VARCHAR(191) NULL,
    ADD COLUMN `number` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL,
    ADD COLUMN `street` VARCHAR(191) NOT NULL,
    ADD COLUMN `zipCode` VARCHAR(191) NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `poduct`;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
