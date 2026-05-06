import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";
import { suppliersTable } from "./suppliers";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
  supplierId: integer("supplier_id").references(() => suppliersTable.id, { onDelete: "set null" }),
  metalType: text("metal_type"), // silver, gold, platinum, copper, brass, none
  weightGrams: numeric("weight_grams", { precision: 8, scale: 3 }),
  purity: text("purity"),
  makingChargePercent: numeric("making_charge_percent", { precision: 5, scale: 2 }),
  makingChargeFixed: numeric("making_charge_fixed", { precision: 10, scale: 2 }),
  purchasePrice: numeric("purchase_price", { precision: 10, scale: 2 }),
  sellingPrice: numeric("selling_price", { precision: 10, scale: 2 }).notNull(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }),
  gstPercent: numeric("gst_percent", { precision: 5, scale: 2 }),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  minStockLevel: integer("min_stock_level"),
  barcode: text("barcode"),
  qrCode: text("qr_code"),
  location: text("location"),
  isActive: boolean("is_active").notNull().default(true),
  primaryImage: text("primary_image"),
  tags: text("tags"),
  suggestedPackagingIds: text("suggested_packaging_ids").default("[]"),
  packagingTags: text("packaging_tags"),
  wordpressSynced: boolean("wordpress_synced").notNull().default(false),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productImagesTable = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productPriceHistoryTable = pgTable("product_price_history", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
  newPrice: numeric("new_price", { precision: 10, scale: 2 }).notNull(),
  changeType: text("change_type"),        // manual | percent | flat_amount | metal_rate | making_charge | direct_price
  changeDetail: text("change_detail"),    // human-readable description e.g. "+10%" or "silver ₹95/g"
  changedBy: text("changed_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, wordpressSynced: true, lastSyncedAt: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
export type ProductImage = typeof productImagesTable.$inferSelect;
export type ProductPriceHistory = typeof productPriceHistoryTable.$inferSelect;
