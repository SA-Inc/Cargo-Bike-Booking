-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "end_time" DATETIME,
    "expected_duration" INTEGER NOT NULL,
    "actual_duration" INTEGER,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "department" TEXT,
    "role" TEXT,
    "star_rating" INTEGER NOT NULL DEFAULT 0,
    "feedback" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Order" ("actual_duration", "department", "description", "email", "end_time", "expected_duration", "feedback", "first_name", "from", "id", "last_name", "role", "star_rating", "start_time", "status", "to") SELECT "actual_duration", "department", "description", "email", "end_time", "expected_duration", "feedback", "first_name", "from", "id", "last_name", "role", "star_rating", "start_time", "status", "to" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
