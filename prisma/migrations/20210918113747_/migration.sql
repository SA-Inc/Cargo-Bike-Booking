-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "end_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_duration" INTEGER NOT NULL,
    "actual_duration" INTEGER,
    "description" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_Order" ("actual_duration", "department", "description", "end_time", "expected_duration", "first_name", "from", "id", "last_name", "role", "start_time", "status", "to") SELECT "actual_duration", "department", "description", coalesce("end_time", CURRENT_TIMESTAMP) AS "end_time", "expected_duration", "first_name", "from", "id", "last_name", "role", "start_time", "status", "to" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
