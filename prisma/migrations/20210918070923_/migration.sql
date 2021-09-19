/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `user_id` on the `Order` table. All the data in the column will be lost.
  - Added the required column `department` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" DATETIME,
    "expected_duration" INTEGER NOT NULL,
    "actual_duration" INTEGER,
    "description" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_Order" ("actual_duration", "description", "end_time", "expected_duration", "from", "id", "start_time", "to") SELECT "actual_duration", "description", "end_time", "expected_duration", "from", "id", "start_time", "to" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
