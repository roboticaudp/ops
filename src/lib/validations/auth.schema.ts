import { z } from 'zod';
import { AUTH_CONFIG } from '@/lib/constants';

export const allowedUserSchema = z.object({
  email: z.string()
    .email("Correo electrónico inválido")
    .trim()
    .toLowerCase()
    .refine((email) => {
      return AUTH_CONFIG.ALLOWED_DOMAINS.some(domain => email.endsWith(domain));
    }, {
      message: "El correo debe pertenecer a los dominios autorizados de la UDP"
    })
});

export type AllowedUserInput = z.infer<typeof allowedUserSchema>;
