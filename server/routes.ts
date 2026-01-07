import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import OpenAI from "openai";

// Initialize OpenAI client for content generation
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register integration routes
  registerChatRoutes(app);
  registerImageRoutes(app);

  // --- API Routes ---

  // Generate Content
  app.post(api.content.generate.path, async (req, res) => {
    try {
      const input = api.content.generate.input.parse(req.body);

      // Construct prompt for the AI
      const prompt = `
        You are a Learning-Aware, Curriculum-Locked Generative AI System designed for formal education.
        
        INPUT PARAMETERS:
        Subject: ${input.subject}
        Topic: ${input.topic}
        Curriculum: ${input.curriculum}
        Learner Level: ${input.learnerLevel}
        Learning Objectives:
        ${input.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

        NON-NEGOTIABLE CONSTRAINTS:
        1. Use ONLY standard textbook-verified academic knowledge.
        2. Do NOT invent, assume, or hallucinate facts.
        3. Do NOT include material outside the stated curriculum.
        4. Explanation depth must match ${input.learnerLevel} level.
        5. Use neutral, inclusive, bias-free language.

        OUTPUT JSON STRUCTURE:
        {
          "topicOverview": "2-3 concise lines",
          "coreExplanation": "Level-appropriate explanation",
          "curriculumBasedExample": "Example relevant to curriculum",
          "practiceQuestion": "Question without solution",
          "keyTakeaways": ["Point 1", "Point 2", "Point 3"],
          "objectiveTraceability": {
            "Objective 1": "Addressed in section...",
            "Objective 2": "Addressed in section..."
          },
          "instructorReviewNotes": "Notes on statements requiring verification or 'No human verification required'",
          "safetyScores": {
            "factualCorrectness": number (1-10),
            "curriculumAlignment": number (1-10),
            "levelAppropriateness": number (1-10),
            "biasSafety": number (1-10)
          }
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const aiContent = JSON.parse(response.choices[0]?.message?.content || "{}");

      // Validate and save to DB
      const contentToSave = {
        subject: input.subject,
        topic: input.topic,
        curriculum: input.curriculum,
        learnerLevel: input.learnerLevel,
        learningObjectives: input.learningObjectives,
        
        topicOverview: aiContent.topicOverview || "",
        coreExplanation: aiContent.coreExplanation || "",
        curriculumBasedExample: aiContent.curriculumBasedExample || "",
        practiceQuestion: aiContent.practiceQuestion || "",
        keyTakeaways: aiContent.keyTakeaways || [],
        
        objectiveTraceability: aiContent.objectiveTraceability || {},
        instructorReviewNotes: aiContent.instructorReviewNotes || "",
        
        factualCorrectnessScore: aiContent.safetyScores?.factualCorrectness || 0,
        curriculumAlignmentScore: aiContent.safetyScores?.curriculumAlignment || 0,
        levelAppropriatenessScore: aiContent.safetyScores?.levelAppropriateness || 0,
        biasSafetyScore: aiContent.safetyScores?.biasSafety || 0,
      };

      const savedContent = await storage.createContentGeneration(contentToSave);
      res.status(201).json(savedContent);

    } catch (err) {
      console.error("Content generation error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Get History
  app.get(api.content.list.path, async (req, res) => {
    try {
      const history = await storage.getAllContentGenerations();
      res.json(history);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // Get Single Generation
  app.get(api.content.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const generation = await storage.getContentGeneration(id);
      if (!generation) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(generation);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  return httpServer;
}
