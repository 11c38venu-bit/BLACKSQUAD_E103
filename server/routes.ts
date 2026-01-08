import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import OpenAI from "openai";

const SYSTEM_ROLE = `
SYSTEM ROLE:
You are an Educational Web Application Intelligence Engine
designed strictly for formal education use
(schools, colleges, universities).

You are NOT a general-purpose chatbot.

You operate as a curriculum-locked instructional system
that generates structured educational content
and browser-based interactive learning components.

--------------------------------------------------
MISSION:
To generate syllabus-aligned, factually verified,
learner-level appropriate educational content
with interactive visualization, assessment,
and document-based topic learning
using ONLY free, browser-native technologies.

--------------------------------------------------
NON-NEGOTIABLE EDUCATIONAL CONSTRAINTS:
1. Use ONLY standard textbook-verified academic knowledge.
2. Follow the given curriculum strictly.
3. Match explanation depth exactly to learner level.
4. Do NOT invent, assume, or hallucinate facts, formulas, or examples.
5. If any information exceeds the syllabus, explicitly state:
   "Excluded to prevent factual or curriculum deviation."
6. Maintain neutral, inclusive, bias-free language.
7. Verify correctness before generating each section.
8. If verification is not possible, refuse that section.

--------------------------------------------------
MANDATORY OUTPUT STRUCTURE (STRICT JSON):
The output MUST be a valid JSON object with the following fields:
{
  "overview": "2-3 concise syllabus-aligned lines",
  "explanation": "Explanation depth must exactly match learner level",
  "example": "Curriculum-Based Example from standard textbooks",
  "practiceQuestion": "Question only, NO solution",
  "keyTakeaways": ["point 1", "point 2", "point 3"],
  "animationCode": "HTML/CSS/JS code string for Mathematical Animation Module. NO external libraries. Must be self-contained within a <div>.",
  "visuals": [{"type": "svg/html", "content": "interactive visual code"}],
  "quiz": [
    {
      "type": "mcq",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A", // Do not display to user initially
      "explanation": "Why it is correct"
    }
  ],
  "audit": {
    "factualCorrectness": 10,
    "curriculumAlignment": 10,
    "levelAppropriateness": 10,
    "biasSafety": 10,
    "notes": "Instructor review notes"
  }
}
`;

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Lesson Routes
  app.post(api.lessons.generate.path, async (req, res) => {
    // Check auth
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as any;
    const userId = user.claims.sub; // Replit auth user ID

    try {
      const input = api.lessons.generate.input.parse(req.body);

      // Construct prompt
      const prompt = `
        Subject: ${input.subject}
        Topic: ${input.topic}
        Curriculum: ${input.curriculum}
        Learner Level: ${input.level}
        Objectives: ${input.objectives.join(", ")}
        ${input.additionalContext ? `Additional Context: ${input.additionalContext}` : ""}
      `;

      // Call OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: SYSTEM_ROLE },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const contentStr = response.choices[0]?.message?.content || "{}";
      const content = JSON.parse(contentStr);

      // Save to DB
      const lesson = await storage.createLesson({
        userId,
        subject: input.subject,
        topic: input.topic,
        level: input.level,
        content: content,
      });

      res.json(lesson);

    } catch (err) {
      console.error("Generation error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to generate lesson" });
    }
  });

  app.get(api.lessons.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as any;
    const userId = user.claims.sub;

    const lessons = await storage.getLessons(userId);
    res.json(lessons);
  });

  app.get(api.lessons.get.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const id = Number(req.params.id);
    const lesson = await storage.getLesson(id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Verify ownership (optional but good practice)
    const user = req.user as any;
    if (lesson.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(lesson);
  });

  // Seeding (simple check on startup)
  // We don't have a specific user to seed for, but we can log that it's ready.
  // Or we could create a public demo lesson if we had a public lessons table.
  // For now, we'll just log.
  console.log("Database initialized. Ready to generate content.");

  return httpServer;
}
