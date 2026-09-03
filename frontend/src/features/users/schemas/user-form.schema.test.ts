import { describe, expect, it } from 'vitest';
import { createUserSchema, editUserSchema } from './user-form.schema';

const validPayload = {
  name: 'Joao Silva',
  registration: '12345678',
  email: 'joao@email.com',
  password: 'Ab1c2d',
  confirmPassword: 'Ab1c2d',
};

describe('createUserSchema', () => {
  it('accepts a fully valid payload', () => {
    const result = createUserSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('rejects a name containing digits', () => {
    const result = createUserSchema.safeParse({ ...validPayload, name: 'Jo4o' });
    expect(result.success).toBe(false);
  });

  it('rejects a registration containing letters', () => {
    const result = createUserSchema.safeParse({
      ...validPayload,
      registration: 'abc123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a registration shorter than 4 digits', () => {
    const result = createUserSchema.safeParse({ ...validPayload, registration: '12' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = createUserSchema.safeParse({ ...validPayload, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a password that is not exactly 6 alphanumeric characters', () => {
    expect(
      createUserSchema.safeParse({ ...validPayload, password: 'Ab1c', confirmPassword: 'Ab1c' })
        .success,
    ).toBe(false);
    expect(
      createUserSchema.safeParse({
        ...validPayload,
        password: 'Ab1c2d3e',
        confirmPassword: 'Ab1c2d3e',
      }).success,
    ).toBe(false);
    expect(
      createUserSchema.safeParse({
        ...validPayload,
        password: 'Ab1c2!',
        confirmPassword: 'Ab1c2!',
      }).success,
    ).toBe(false);
  });

  it('rejects mismatched password confirmation', () => {
    const result = createUserSchema.safeParse({
      ...validPayload,
      confirmPassword: 'Zx9k2m',
    });
    expect(result.success).toBe(false);
  });

  it('requires a password on create', () => {
    const result = createUserSchema.safeParse({
      ...validPayload,
      password: '',
      confirmPassword: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('editUserSchema', () => {
  it('allows an empty password (keep current)', () => {
    const result = editUserSchema.safeParse({
      ...validPayload,
      password: '',
      confirmPassword: '',
    });
    expect(result.success).toBe(true);
  });

  it('still validates password format when one is provided', () => {
    const result = editUserSchema.safeParse({
      ...validPayload,
      password: 'bad',
      confirmPassword: 'bad',
    });
    expect(result.success).toBe(false);
  });

  it('still enforces name/registration/email rules', () => {
    const result = editUserSchema.safeParse({
      ...validPayload,
      registration: 'not-numeric',
      password: '',
      confirmPassword: '',
    });
    expect(result.success).toBe(false);
  });
});
