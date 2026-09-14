import { z } from "zod";

export const createPostSchema = z.object({
  userId: z.coerce.number().int().positive(),

  categoryId: z.coerce.number().int().positive(),

  title: z
    .string()
    .min(3, "Title minimal 3 karakter")
    .max(255, "Maksimal 255 karakter"),

  content: z
    .string()
    .min(10, "Minimal 10 karakter"),

  status: z
    .string()
    .optional(),
});

export const userIdSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

export const userPostParamsSchema = z.object({
  userId: z.coerce.number().int().positive(),
  postId: z.coerce.number().int().positive(),
});

export const postIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});