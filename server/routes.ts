import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBookmarkSchema, 
  updateBookmarkSchema,
  type InsertBookmark,
  type UpdateBookmark
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for bookmarks
  const router = express.Router();
  
  // Get all bookmarks
  router.get("/bookmarks", async (req: Request, res: Response) => {
    try {
      const bookmarks = await storage.getAllBookmarks();
      res.json(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });
  
  // Get a single bookmark by ID
  router.get("/bookmarks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bookmark ID" });
      }
      
      const bookmark = await storage.getBookmarkById(id);
      if (!bookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      res.json(bookmark);
    } catch (error) {
      console.error("Error fetching bookmark:", error);
      res.status(500).json({ message: "Failed to fetch bookmark" });
    }
  });
  
  // Create a new bookmark
  router.post("/bookmarks", async (req: Request, res: Response) => {
    try {
      // Validate request body against schema
      const bookmarkData = insertBookmarkSchema.parse(req.body);
      
      // Make sure URL has proper format
      let url = bookmarkData.url;
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      
      // Create bookmark with properly formatted URL
      const bookmark = await storage.createBookmark({
        ...bookmarkData,
        url,
      });
      
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid bookmark data", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating bookmark:", error);
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });
  
  // Update a bookmark
  router.put("/bookmarks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bookmark ID" });
      }
      
      // Validate request body against schema
      const bookmarkData = updateBookmarkSchema.parse(req.body);
      
      // Make sure URL has proper format
      let url = bookmarkData.url;
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      
      // Update bookmark with properly formatted URL
      const updatedBookmark = await storage.updateBookmark(id, {
        ...bookmarkData,
        url,
      });
      
      if (!updatedBookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      res.json(updatedBookmark);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid bookmark data", 
          errors: error.errors 
        });
      }
      
      console.error("Error updating bookmark:", error);
      res.status(500).json({ message: "Failed to update bookmark" });
    }
  });
  
  // Delete a bookmark
  router.delete("/bookmarks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bookmark ID" });
      }
      
      const result = await storage.deleteBookmark(id);
      if (!result) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });
  
  // Register the router with the /api prefix
  app.use("/api", router);
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
