import { pgTable, serial, text, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  whatsapp: text("whatsapp"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  gstNumber: text("gst_number"),
  photo: text("photo"),
  notes: text("notes"),
  spouseName: text("spouse_name"),
  spouseBirthday: text("spouse_birthday"), // MM-DD format
  spousePhone: text("spouse_phone"),
  spouseWhatsapp: text("spouse_whatsapp"),
  totalPurchases: numeric("total_purchases", { precision: 12, scale: 2 }).notNull().default("0"),
  invoiceCount: integer("invoice_count").notNull().default(0),
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
  lastPurchaseDate: timestamp("last_purchase_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, code: true, totalPurchases: true, invoiceCount: true, createdAt: true, updatedAt: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
