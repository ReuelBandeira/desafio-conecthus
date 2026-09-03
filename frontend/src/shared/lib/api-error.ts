export type UserFieldName = 'name' | 'registration' | 'email' | 'password';

interface KnownMessage {
  field?: UserFieldName;
  message: string;
}

// The backend's "simple" error messages (conflicts, not-found, inactive-user)
// are already in Portuguese — this table's job is just to tie the known
// ones to the form field they should highlight (falls back to a plain
// toast, using the backend's own message as-is, for anything unmapped).
const KNOWN_MESSAGES: Record<string, KnownMessage> = {
  'Já existe um usuário cadastrado com esta matrícula.': {
    field: 'registration',
    message: 'Essa matrícula já está cadastrada.',
  },
  'Esta matrícula já está em uso.': {
    field: 'registration',
    message: 'Essa matrícula já está cadastrada.',
  },
  'Já existe um usuário cadastrado com este e-mail.': {
    field: 'email',
    message: 'Esse e-mail já está cadastrado.',
  },
  'Este e-mail já está em uso.': {
    field: 'email',
    message: 'Esse e-mail já está cadastrado.',
  },
  'Usuário não encontrado.': { message: 'Usuário não encontrado.' },
  'Usuário não encontrado para exclusão.': {
    message: 'Usuário não encontrado.',
  },
  'Usuário inativo.': {
    message: 'Usuário inativo não pode ser atualizado.',
  },
};

export function translateApiMessage(rawMessage: string): KnownMessage {
  return KNOWN_MESSAGES[rawMessage] ?? { message: rawMessage };
}

export class ApiError extends Error {
  readonly status: number;
  readonly field?: UserFieldName;

  constructor(status: number, message: string, field?: UserFieldName) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.field = field;
  }
}
