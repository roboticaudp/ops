import { z } from 'zod';

export const teamSchema = z.object({
  id: z.string().uuid().optional(),
  competition_id: z.string().uuid(),
  name: z.string().min(1, "Nombre es requerido"),
  school: z.string().min(1, "Escuela es requerida"),
  professor: z.string().min(1, "Profesor es requerido"),
  availability: z.array(z.string())
});

export type TeamInput = z.infer<typeof teamSchema>;
