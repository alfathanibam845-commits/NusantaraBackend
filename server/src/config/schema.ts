import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

// ====================
// USERS
// ====================

export const usersTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),

  username: varchar("username", {
    length: 100,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  })
    .notNull()
    .unique(),

  password: varchar("password", {
    length: 255,
  }).notNull(),

  role: varchar("role", {
    length: 50,
  }).default("user"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow(),
});

// ====================
// CATEGORIES
// ====================

export const categoriesTable = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow(),
});

// ====================
// POSTS
// ====================

export const postsTable = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),

  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),

  categoryId: int("category_id")
    .notNull()
    .references(() => categoriesTable.id),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  content: text("content").notNull(),

  imageUrl: varchar("image_url", {
    length: 255,
  }),

  imagePublicId: varchar("image_public_id", {
    length: 255,
  }),

  status: varchar("status", {
    length: 50,
  }).default("draft"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow(),
});