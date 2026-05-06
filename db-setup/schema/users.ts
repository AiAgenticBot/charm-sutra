import { pgTable, serial, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role").notNull().default("staff"),
  isActive: boolean("is_active").notNull().default(true),
  permissions: jsonb("permissions").notNull().default({
    viewProducts: true,
    editProducts: false,
    viewCustomers: true,
    editCustomers: false,
    viewInvoices: true,
    createInvoices: true,
    viewReports: false,
    viewPurchasePrice: false,
    viewSuppliers: false,
    manageInventory: false,
    useScanner: true,
    exportData: false,
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
