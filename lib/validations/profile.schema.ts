import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/),
  bio: z.string().max(160).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
