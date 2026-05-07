import { z } from 'zod';

export const competitionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nombre es requerido"),
  year: z.number().int().min(2000).max(2100),
  was_held: z.boolean(),
  status: z.enum(['active', 'archived']).default('archived'),
  assignments_state: z.array(z.any()).optional()
});

export type CompetitionInput = z.infer<typeof competitionSchema>;
