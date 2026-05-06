import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wordpressSettingsTable = pgTable("wordpress_settings", {
  id: serial("id").primaryKey(),
  siteUrl: text("site_url"),
  consumerKey: text("consumer_key"),
  consumerSecret: text("consumer_secret"),
  syncPrices: boolean("sync_prices").notNull().default(true),
  syncStock: boolean("sync_stock").notNull().default(false),
  syncImages: boolean("sync_images").notNull().default(false),
  lastSyncAt: timestamp("last_sync_at"),
  lastSyncResult: text("last_sync_result"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertWordpressSettingsSchema = createInsertSchema(wordpressSettingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWordpressSettings = z.infer<typeof insertWordpressSettingsSchema>;
export type WordpressSettings = typeof wordpressSettingsTable.$inferSelect;
