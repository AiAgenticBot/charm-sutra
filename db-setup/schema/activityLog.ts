import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const activityLogTable = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  entityId: integer("entity_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
