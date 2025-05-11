import { bookmarks, type Bookmark, type InsertBookmark, type UpdateBookmark } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllBookmarks(): Promise<Bookmark[]>;
  getBookmarkById(id: number): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  updateBookmark(id: number, bookmark: UpdateBookmark): Promise<Bookmark | undefined>;
  deleteBookmark(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getAllBookmarks(): Promise<Bookmark[]> {
    return await db.select().from(bookmarks).orderBy(bookmarks.createdAt);
  }

  async getBookmarkById(id: number): Promise<Bookmark | undefined> {
    const results = await db.select().from(bookmarks).where(eq(bookmarks.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createBookmark(bookmarkData: InsertBookmark): Promise<Bookmark> {
    const insertedBookmarks = await db.insert(bookmarks).values({
      name: bookmarkData.name,
      url: bookmarkData.url,
      iconType: bookmarkData.iconType || "fas fa-globe",
      iconColor: bookmarkData.iconColor || "bg-primary",
    }).returning();
    
    return insertedBookmarks[0];
  }

  async updateBookmark(id: number, bookmarkData: UpdateBookmark): Promise<Bookmark | undefined> {
    const bookmark = await this.getBookmarkById(id);
    
    if (!bookmark) {
      return undefined;
    }
    
    const updatedBookmarks = await db.update(bookmarks)
      .set({
        name: bookmarkData.name,
        url: bookmarkData.url,
        iconType: bookmarkData.iconType || bookmark.iconType,
        iconColor: bookmarkData.iconColor || bookmark.iconColor,
      })
      .where(eq(bookmarks.id, id))
      .returning();
    
    return updatedBookmarks.length > 0 ? updatedBookmarks[0] : undefined;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    const deletedBookmarks = await db.delete(bookmarks)
      .where(eq(bookmarks.id, id))
      .returning();
    
    return deletedBookmarks.length > 0;
  }
}

// For backwards compatibility with existing app code, we'll keep the class name as 'storage'
export const storage = new DatabaseStorage();
