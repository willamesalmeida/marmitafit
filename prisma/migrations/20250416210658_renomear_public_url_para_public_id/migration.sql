/*
  Warnings:

  - You are about to drop the column `publicUrl` on the `product` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `publicUrl`,
    ADD COLUMN `publicId` VARCHAR(255) NOT NULL DEFAULT '';
    