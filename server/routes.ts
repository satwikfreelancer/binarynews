import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCategorySchema, insertBreakingNewsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const { categoryId, featured, limit, offset, search } = req.query;
      
      if (search && typeof search === "string") {
        const articles = await storage.searchArticles(search);
        res.json(articles);
        return;
      }

      const options = {
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        featured: featured === "true" ? true : undefined,
        published: true,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };

      const articles = await storage.getArticles(options);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementViews(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid article data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create article", error: error.message });
      }
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const article = await storage.updateArticle(id, updateData);
      
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteArticle(id);
      
      if (!success) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Breaking News
  app.get("/api/breaking-news", async (req, res) => {
    try {
      const breakingNews = await storage.getActiveBreakingNews();
      res.json(breakingNews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breaking news" });
    }
  });

  app.post("/api/breaking-news", async (req, res) => {
    try {
      const newsData = insertBreakingNewsSchema.parse(req.body);
      const breakingNews = await storage.createBreakingNews(newsData);
      res.status(201).json(breakingNews);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid breaking news data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create breaking news" });
      }
    }
  });

  app.put("/api/breaking-news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const breakingNews = await storage.updateBreakingNews(id, updateData);
      
      if (!breakingNews) {
        res.status(404).json({ message: "Breaking news not found" });
        return;
      }
      
      res.json(breakingNews);
    } catch (error) {
      res.status(500).json({ message: "Failed to update breaking news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
