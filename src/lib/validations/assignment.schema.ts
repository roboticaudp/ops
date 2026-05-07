import { z } from 'zod';

export const assignmentSchema = z.object({
  id: z.string().uuid().optional(),
  competition_id: z.string().uuid(),
  team_id: z.string().uuid(),
  tutor_id: z.string().uuid(),
  block_id: z.string(),
  is_fixed: z.boolean().default(false)
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;
