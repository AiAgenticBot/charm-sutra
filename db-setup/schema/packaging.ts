import { pgTable, serial, text, numeric, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { invoicesTable } from "./invoices";

export const packagingItemsTable = pgTable("packaging_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // box, carry_bag, gift_packing, other
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  isComplementary: boolean("is_complementary").notNull().default(false),
  showPrice: boolean("show_price").notNull().default(true),
  imageUrl: text("image_url"),
  location: text("location"),
  tags: text("tags"),
  compatibleCategoryIds: text("compatible_category_ids"),
  compatibleProductIds: text("compatible_product_ids"),
  description: text("description"),
  quantity: integer("quantity").notNull().default(0),
  size: text("size"),
  lowStockLevel: integer("low_stock_level"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const invoicePackagingTable = pgTable("invoice_packaging", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoicesTable.id, { onDelete: "cascade" }),
  packagingItemId: integer("packaging_item_id"), // nullable – item may be deleted
  name: text("name").notNull(),
  type: text("type").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  isComplementary: boolean("is_complementary").notNull().default(false),
  qty: integer("qty").notNull().default(1),
});

export const insertPackagingItemSchema = createInsertSchema(packagingItemsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPackagingItem = z.infer<typeof insertPackagingItemSchema>;
export type PackagingItem = typeof packagingItemsTable.$inferSelect;
export type InvoicePackaging = typeof invoicePackagingTable.$inferSelect;
