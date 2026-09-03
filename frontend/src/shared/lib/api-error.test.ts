import { describe, expect, it } from 'vitest';
import { ApiError, translateApiMessage } from './api-error';

describe('translateApiMessage', () => {
  it('maps a known registration conflict to the registration field', () => {
    const result = translateApiMessage(
      'Já existe um usuário cadastrado com esta matrícula.',
    );
    expect(result.field).toBe('registration');
    expect(result.message).toBe('Essa matrícula já está cadastrada.');
  });

  it('maps a known email conflict to the email field', () => {
    const result = translateApiMessage(
      'Já existe um usuário cadastrado com este e-mail.',
    );
    expect(result.field).toBe('email');
    expect(result.message).toBe('Esse e-mail já está cadastrado.');
  });

  it('maps the update-time conflict variants too', () => {
    expect(
      translateApiMessage('Esta matrícula já está em uso.').field,
    ).toBe('registration');
    expect(translateApiMessage('Este e-mail já está em uso.').field).toBe(
      'email',
    );
  });

  it('falls back to the raw message with no field for unknown messages', () => {
    const result = translateApiMessage('Something totally unexpected');
    expect(result.field).toBeUndefined();
    expect(result.message).toBe('Something totally unexpected');
  });
});

describe('ApiError', () => {
  it('carries the status and optional field', () => {
    const error = new ApiError(409, 'Essa matrícula já está cadastrada.', 'registration');
    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(409);
    expect(error.field).toBe('registration');
    expect(error.message).toBe('Essa matrícula já está cadastrada.');
  });
});
