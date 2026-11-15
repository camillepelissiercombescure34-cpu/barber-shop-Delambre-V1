import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  barberId: text("barber_id").notNull(),
  serviceId: text("service_id").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  time: varchar("time", { length: 5 }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  notes: text("notes"),
  price: integer("price").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("pending"),
  provider: varchar("provider", { length: 40 }).notNull().default("internal"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shopOrders = pgTable("shop_orders", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  total: integer("total").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shopOrderItems = pgTable("shop_order_items", {
  id: serial("id").primaryKey(),
  orderReference: varchar("order_reference", { length: 32 }).notNull(),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
});
