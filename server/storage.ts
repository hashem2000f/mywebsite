import { bookmarks, type Bookmark, type InsertBookmark, type UpdateBookmark } from "@shared/schema";

export interface IStorage {
  getAllBookmarks(): Promise<Bookmark[]>;
  getBookmarkById(id: number): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  updateBookmark(id: number, bookmark: UpdateBookmark): Promise<Bookmark | undefined>;
  deleteBookmark(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private bookmarks: Map<number, Bookmark>;
  private currentId: number;

  constructor() {
    this.bookmarks = new Map();
    this.currentId = 1;
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values());
  }

  async getBookmarkById(id: number): Promise<Bookmark | undefined> {
    return this.bookmarks.get(id);
  }

  async createBookmark(bookmarkData: InsertBookmark): Promise<Bookmark> {
    const id = this.currentId++;
    const now = new Date();
    
    const bookmark: Bookmark = {
      id,
      name: bookmarkData.name,
      url: bookmarkData.url,
      iconType: bookmarkData.iconType || "fas fa-globe",
      iconColor: bookmarkData.iconColor || "bg-primary",
      createdAt: now,
    };
    
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async updateBookmark(id: number, bookmarkData: UpdateBookmark): Promise<Bookmark | undefined> {
    const bookmark = this.bookmarks.get(id);
    
    if (!bookmark) {
      return undefined;
    }
    
    const updatedBookmark: Bookmark = {
      ...bookmark,
      name: bookmarkData.name,
      url: bookmarkData.url,
      iconType: bookmarkData.iconType || bookmark.iconType,
      iconColor: bookmarkData.iconColor || bookmark.iconColor,
    };
    
    this.bookmarks.set(id, updatedBookmark);
    return updatedBookmark;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    return this.bookmarks.delete(id);
  }
}

export const storage = new MemStorage();
