import { pgTable, text, serial, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export Auth and Chat models
export * from "./models/auth";
export * from "./models/chat";

// === LESSONS ===
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth.users.id
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  level: text("level").notNull(),
  content: jsonb("content").notNull(), // Structured content (sections, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLessonSchema = createInsertSchema(lessons).omit({ 
  id: true, 
  createdAt: true 
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

// === QUIZZES ===
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  questions: jsonb("questions").notNull(), // Array of questions
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({ 
  id: true, 
  createdAt: true 
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

// === GENERATION REQUEST TYPES ===
export const generateLessonSchema = z.object({
  subject: z.string(),
  topic: z.string(),
  curriculum: z.string(),
  level: z.string(),
  objectives: z.array(z.string()).min(3),
  additionalContext: z.string().optional(),
});

export type GenerateLessonRequest = z.infer<typeof generateLessonSchema>;

// Response type for the generated content structure
export interface GeneratedContent {
  overview: string;
  explanation: string;
  example: string;
  practiceQuestion: string;
  keyTakeaways: string[];
  animationCode: string; // HTML/JS/CSS string for the animation
  visuals: Array<{ type: string; content: string }>; // Interactive visuals
  quiz: any[]; // JSON structure for the quiz
  audit: {
    factualCorrectness: number;
    curriculumAlignment: number;
    levelAppropriateness: number;
    biasSafety: number;
    notes: string;
  };
}
