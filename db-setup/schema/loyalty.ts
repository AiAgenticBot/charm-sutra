import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { customersTable } from "./customers";
import { invoicesTable } from "./invoices";

export const loyaltyTransactionsTable = pgTable("loyalty_transactions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
  invoiceId: integer("invoice_id").references(() => invoicesTable.id, { onDelete: "set null" }),
  type: text("type").notNull(), // earn | redeem | manual | expire
  points: integer("points").notNull(),
  description: text("description"),
  balanceBefore: integer("balance_before").notNull().default(0),
  balanceAfter: integer("balance_after").notNull().default(0),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type LoyaltyTransaction = typeof loyaltyTransactionsTable.$inferSelect;
