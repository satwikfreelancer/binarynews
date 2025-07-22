import { categories, articles, breakingNews, type Category, type Article, type BreakingNews, type InsertCategory, type InsertArticle, type InsertBreakingNews } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, and, desc } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Articles
  getArticles(options?: { categoryId?: number; featured?: boolean; published?: boolean; limit?: number; offset?: number }): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticleById(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<Article>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  incrementViews(id: number): Promise<void>;
  searchArticles(query: string): Promise<Article[]>;

  // Breaking News
  getActiveBreakingNews(): Promise<BreakingNews | undefined>;
  createBreakingNews(news: InsertBreakingNews): Promise<BreakingNews>;
  updateBreakingNews(id: number, news: Partial<BreakingNews>): Promise<BreakingNews | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

async getArticles(options?: { categoryId?: number; featured?: boolean; published?: boolean; limit?: number; offset?: number }): Promise<Article[]> {
  const conditions = [];
  
  if (options?.categoryId) {
    conditions.push(eq(articles.categoryId, options.categoryId));
  }
  
  if (options?.featured !== undefined) {
    conditions.push(eq(articles.featured, options.featured));
  }
  
  if (options?.published !== undefined) {
    conditions.push(eq(articles.published, options.published));
  }
  
  let query = db.select().from(articles); // This should select all columns by default

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  query = query.orderBy(desc(articles.publishedAt));
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  if (options?.offset) {
    query = query.offset(options.offset);
  }
  
  return await query;
}

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article || undefined;
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db
      .insert(articles)
      .values(article)
      .returning();
    return newArticle;
  }

  async updateArticle(id: number, articleData: Partial<Article>): Promise<Article | undefined> {
    const [updated] = await db
      .update(articles)
      .set(articleData)
      .where(eq(articles.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async incrementViews(id: number): Promise<void> {
    // Get current views and increment by 1
    const [article] = await db
      .select({ views: articles.views })
      .from(articles)
      .where(eq(articles.id, id));
    
    if (article) {
      await db
        .update(articles)
        .set({ views: (article.views || 0) + 1 })
        .where(eq(articles.id, id));
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.published, true),
          or(
            ilike(articles.title, `%${query}%`),
            ilike(articles.excerpt, `%${query}%`),
            ilike(articles.content, `%${query}%`)
          )
        )
      )
      .orderBy(desc(articles.publishedAt));
  }

  async getActiveBreakingNews(): Promise<BreakingNews | undefined> {
    const [news] = await db
      .select()
      .from(breakingNews)
      .where(eq(breakingNews.active, true))
      .orderBy(desc(breakingNews.createdAt))
      .limit(1);
    return news || undefined;
  }

  async createBreakingNews(news: InsertBreakingNews): Promise<BreakingNews> {
    const [newNews] = await db
      .insert(breakingNews)
      .values(news)
      .returning();
    return newNews;
  }

  async updateBreakingNews(id: number, newsData: Partial<BreakingNews>): Promise<BreakingNews | undefined> {
    const [updated] = await db
      .update(breakingNews)
      .set(newsData)
      .where(eq(breakingNews.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
