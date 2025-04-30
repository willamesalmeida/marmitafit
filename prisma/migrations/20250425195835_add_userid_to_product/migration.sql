/*
  Warnings:

  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(512) NOT NULL;

-- AlterTable
ALTER TABLE `refreshtoken` MODIFY `token` VARCHAR(512) NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
