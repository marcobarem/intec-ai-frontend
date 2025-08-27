import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
      .max(100, { message: "O nome não pode exceder 100 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
      .max(20, { message: "A senha não pode exceder 20 caracteres." }),
    confirmPassword: z.string().min(6, {
      message: "A confirmação de senha deve ter pelo menos 6 caracteres.",
    }),
    cpf: z
      .string()
      .min(11, { message: "O CPF deve ter 11 dígitos." })
      .max(14, {
        message: "O CPF não pode exceder 14 caracteres (com formatação).",
      })
      .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
        message: "CPF inválido. Use o formato XXX.XXX.XXX-XX ou XXXXXXXXXXX.",
      }),
    phone: z.string().optional().or(z.literal("")).nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;
