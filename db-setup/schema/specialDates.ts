import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { customersTable } from "./customers";

export const specialDatesTable = pgTable("special_dates", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // birthday, anniversary, custom
  label: text("label").notNull(),
  date: text("date").notNull(), // MM-DD format
  year: integer("year"), // null = annual reminder, set = one-time specific year
  seenAt: timestamp("seen_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSpecialDateSchema = createInsertSchema(specialDatesTable).omit({ id: true, seenAt: true, createdAt: true });
export type InsertSpecialDate = z.infer<typeof insertSpecialDateSchema>;
export type SpecialDate = typeof specialDatesTable.$inferSelect;
