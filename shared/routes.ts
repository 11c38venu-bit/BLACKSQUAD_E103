import { z } from 'zod';
import { insertContentGenerationSchema, contentGenerations } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  content: {
    generate: {
      method: 'POST' as const,
      path: '/api/content/generate',
      input: z.object({
        subject: z.string(),
        topic: z.string(),
        curriculum: z.string(),
        learnerLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
        learningObjectives: z.array(z.string()).min(1),
      }),
      responses: {
        201: z.custom<typeof contentGenerations.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/content/history',
      responses: {
        200: z.array(z.custom<typeof contentGenerations.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/content/:id',
      responses: {
        200: z.custom<typeof contentGenerations.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  }
};

// ============================================
// TYPE HELPERS
// ============================================
export type GenerateContentInput = z.infer<typeof api.content.generate.input>;
export type ContentResponse = z.infer<typeof api.content.generate.responses[201]>;
export type ContentListResponse = z.infer<typeof api.content.list.responses[200]>;

// ============================================
// URL HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
