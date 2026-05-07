import { z } from 'zod';

export const tutorSchema = z.object({
  id: z.string().uuid().optional(),
  competition_id: z.string().uuid(),
  name: z.string().min(1, "Nombre es requerido"),
  email: z.string().email("Email inválido").optional().nullable(),
  max_sessions: z.number().int().min(1).max(20),
  availability: z.array(z.string())
});

export type TutorInput = z.infer<typeof tutorSchema>;
