/*
  Warnings:

  - Added the required column `publicUrl` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `publicUrl` VARCHAR(255) NOT NULL DEFAULT '';
