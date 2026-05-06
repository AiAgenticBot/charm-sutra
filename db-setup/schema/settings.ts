import { pgTable, serial, text, boolean, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storeSettingsTable = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeType: text("store_type").notNull().default("jewelry"),
  storeName: text("store_name").notNull().default("My Store"),
  storeEmail: text("store_email"),
  storePhone: text("store_phone"),
  storeAddress: text("store_address"),
  storeLogo: text("store_logo"),
  currency: text("currency").notNull().default("INR"),
  currencySymbol: text("currency_symbol").notNull().default("₹"),
  gstEnabled: boolean("gst_enabled").notNull().default(true),
  gstNumber: text("gst_number"),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull().default("3"),
  silverRatePerGram: numeric("silver_rate_per_gram", { precision: 10, scale: 2 }).notNull().default("0"),
  goldRatePerGram: numeric("gold_rate_per_gram", { precision: 10, scale: 2 }).notNull().default("0"),
  defaultMakingChargePercent: numeric("default_making_charge_percent", { precision: 5, scale: 2 }).notNull().default("0"),
  invoicePrefix: text("invoice_prefix").notNull().default("INV"),
  invoiceNextNumber: integer("invoice_next_number").notNull().default(1),
  wordpressSyncEnabled: boolean("wordpress_sync_enabled").notNull().default(false),
  whatsappBusinessNumber: text("whatsapp_business_number"),
  upiId: text("upi_id"),
  printSize: text("print_size").notNull().default("a4"),
  printStyle: text("print_style").notNull().default("classic"),
  loyaltyEnabled: boolean("loyalty_enabled").notNull().default(false),
  loyaltyPointsPerRupee: numeric("loyalty_points_per_rupee", { precision: 8, scale: 2 }).notNull().default("1"),
  loyaltyPointValue: numeric("loyalty_point_value", { precision: 8, scale: 2 }).notNull().default("1"),
  loyaltyMinRedeem: integer("loyalty_min_redeem").notNull().default(100),
  birthdayWaTemplate: text("birthday_wa_template"),
  anniversaryWaTemplate: text("anniversary_wa_template"),
  customWaTemplate: text("custom_wa_template"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertStoreSettingsSchema = createInsertSchema(storeSettingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStoreSettings = z.infer<typeof insertStoreSettingsSchema>;
export type StoreSettings = typeof storeSettingsTable.$inferSelect;
