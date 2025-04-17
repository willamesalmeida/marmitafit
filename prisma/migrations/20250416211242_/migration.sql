/*
  Warnings:

  - You are about to alter the column `publicId` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `publicId` VARCHAR(191) NOT NULL;
