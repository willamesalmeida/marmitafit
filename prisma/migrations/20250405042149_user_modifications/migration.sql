/*
  Warnings:

  - You are about to drop the column `birthday` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `complement` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `birthday`,
    DROP COLUMN `city`,
    DROP COLUMN `complement`,
    DROP COLUMN `district`,
    DROP COLUMN `number`,
    DROP COLUMN `state`,
    DROP COLUMN `street`,
    DROP COLUMN `zipCode`;
