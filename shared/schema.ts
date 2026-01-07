import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";

// === TABLE DEFINITIONS ===
export const contentGenerations = pgTable("content_generations", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  curriculum: text("curriculum").notNull(),
  learnerLevel: text("learner_level").notNull(), // Beginner, Intermediate, Advanced
  learningObjectives: text("learning_objectives").array().notNull(),
  
  // Generated Content Structure
  topicOverview: text("topic_overview").notNull(),
  coreExplanation: text("core_explanation").notNull(),
  curriculumBasedExample: text("curriculum_based_example").notNull(),
  practiceQuestion: text("practice_question").notNull(),
  keyTakeaways: text("key_takeaways").array().notNull(),
  
  // Advanced Features
  objectiveTraceability: json("objective_traceability").notNull(),
  instructorReviewNotes: text("instructor_review_notes").notNull(),
  
  // Safety Scores
  factualCorrectnessScore: integer("factual_correctness_score").notNull(),
  curriculumAlignmentScore: integer("curriculum_alignment_score").notNull(),
  levelAppropriatenessScore: integer("level_appropriateness_score").notNull(),
  biasSafetyScore: integer("bias_safety_score").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat Schema from blueprint
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// === BASE SCHEMAS ===
export const insertContentGenerationSchema = createInsertSchema(contentGenerations).omit({ 
  id: true, 
  createdAt: true 
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// === EXPLICIT API CONTRACT TYPES ===
export type ContentGeneration = typeof contentGenerations.$inferSelect;
export type InsertContentGeneration = z.infer<typeof insertContentGenerationSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type CreateContentGenerationRequest = {
  subject: string;
  topic: string;
  curriculum: string;
  learnerLevel: "Beginner" | "Intermediate" | "Advanced";
  learningObjectives: string[];
};

export type ContentGenerationResponse = ContentGeneration;

// Error schemas
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};
