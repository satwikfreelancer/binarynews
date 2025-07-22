import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull().default("#3B82F6"),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  categoryId: integer("category_id").references(() => categories.id),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  views: integer("views").default(0),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  seoTitle: text("seo_title"),
  metaDescription: text("meta_description"),
  tags: text("tags").array(),
});

export const breakingNews = pgTable("breaking_news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  publishedAt: true,
  views: true,
});

export const insertBreakingNewsSchema = createInsertSchema(breakingNews).omit({
  id: true,
  createdAt: true,
});

export type Category = typeof categories.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type BreakingNews = typeof breakingNews.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertBreakingNews = z.infer<typeof insertBreakingNewsSchema>;
