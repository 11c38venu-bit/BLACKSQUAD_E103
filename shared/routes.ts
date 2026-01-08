import { z } from 'zod';
import { insertLessonSchema, lessons, generateLessonSchema } from './schema';

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
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  lessons: {
    generate: {
      method: 'POST' as const,
      path: '/api/lessons/generate',
      input: generateLessonSchema,
      responses: {
        200: z.custom<typeof lessons.$inferSelect>(), // Returns the saved lesson
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/lessons',
      responses: {
        200: z.array(z.custom<typeof lessons.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/lessons/:id',
      responses: {
        200: z.custom<typeof lessons.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/lessons/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    }
  },
};

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

export type GenerateLessonInput = z.infer<typeof api.lessons.generate.input>;
export type LessonResponse = z.infer<typeof api.lessons.generate.responses[200]>;
