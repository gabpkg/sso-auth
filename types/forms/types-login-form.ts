import { z } from 'zod';

export const emailSchema = z.object({
  email: z.email({ message: 'Por favor, informe seu e-mail corporativo' }),
});

export const passwordSchema = z.object({
  password: z.string().min(1, { message: 'Por favor, informe sua senha' }),
});

export type EmailFormData = z.infer<typeof emailSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;