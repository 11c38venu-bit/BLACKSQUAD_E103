import { db } from "./db";
import { 
  contentGenerations, 
  type InsertContentGeneration, 
  type ContentGeneration 
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createContentGeneration(content: InsertContentGeneration): Promise<ContentGeneration>;
  getAllContentGenerations(): Promise<ContentGeneration[]>;
  getContentGeneration(id: number): Promise<ContentGeneration | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createContentGeneration(content: InsertContentGeneration): Promise<ContentGeneration> {
    const [generation] = await db.insert(contentGenerations).values(content).returning();
    return generation;
  }

  async getAllContentGenerations(): Promise<ContentGeneration[]> {
    return db.select().from(contentGenerations).orderBy(desc(contentGenerations.createdAt));
  }

  async getContentGeneration(id: number): Promise<ContentGeneration | undefined> {
    const [generation] = await db.select().from(contentGenerations).where(eq(contentGenerations.id, id));
    return generation;
  }
}

export const storage = new DatabaseStorage();
