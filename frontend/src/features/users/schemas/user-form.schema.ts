import { z } from 'zod';

// Mirrors the backend's domain value-objects exactly (see
// backend/conecthus-backend/src/modules/user/domain/value-objects) — the
// frontend must never be more permissive than the API it talks to.
export const NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/;
export const REGISTRATION_REGEX = /^[0-9]+$/;
export const PASSWORD_REGEX = /^[a-zA-Z0-9]{6}$/;

const nameSchema = z
  .string()
  .trim()
  .min(2, 'Nome deve ter pelo menos 2 caracteres.')
  .max(30, 'Nome deve ter no máximo 30 caracteres.')
  .regex(NAME_REGEX, 'Nome deve conter apenas letras.');

const registrationSchema = z
  .string()
  .trim()
  .min(4, 'Matrícula deve ter pelo menos 4 números.')
  .max(10, 'Matrícula deve ter no máximo 10 números.')
  .regex(REGISTRATION_REGEX, 'Matrícula deve conter apenas números.');

const emailSchema = z
  .string()
  .trim()
  .min(1, 'E-mail é obrigatório.')
  .max(40, 'E-mail deve ter no máximo 40 caracteres.')
  .email('E-mail inválido.');

const passwordSchema = z
  .string()
  .regex(PASSWORD_REGEX, 'Senha deve ter exatamente 6 caracteres alfanuméricos.');

const optionalPasswordSchema = z.union([z.literal(''), passwordSchema]);

export const createUserSchema = z
  .object({
    name: nameSchema,
    registration: registrationSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export const editUserSchema = z
  .object({
    name: nameSchema,
    registration: registrationSchema,
    email: emailSchema,
    password: optionalPasswordSchema,
    confirmPassword: optionalPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

// Both schemas above resolve to this same shape — only the strictness of
// `password`/`confirmPassword` differs between create and edit.
export interface UserFormValues {
  name: string;
  registration: string;
  email: string;
  password: string;
  confirmPassword: string;
}
