import { users, lessons, quizzes, type User, type InsertUser, type Lesson, type InsertLesson, type Quiz, type InsertQuiz } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User (from auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Lessons
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLessons(userId: string): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  
  // Quizzes
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuiz(id: number): Promise<Quiz | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods (Auth integration handles most of this, but we implement interface)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Note: Replit auth uses email/id, this is a fallback if needed
    // Assuming 'email' is the closest mapping or we might not need this for Replit auth
    return undefined; 
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Replit auth handles creation
    throw new Error("User creation is handled by Replit Auth");
  }

  // Lessons
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  async getLessons(userId: string): Promise<Lesson[]> {
    return await db.select()
      .from(lessons)
      .where(eq(lessons.userId, userId))
      .orderBy(desc(lessons.createdAt));
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  // Quizzes
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }
}

export const storage = new DatabaseStorage();
