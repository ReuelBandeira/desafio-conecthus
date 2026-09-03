import { ApiError, translateApiMessage } from './api-error';

const BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:5000/api/v1';

interface DomainErrorBody {
  statusCode: number;
  message: string;
  errors: Array<{ context: string; message: string }>;
}

interface DtoErrorBody {
  statusCode: number;
  message: string[];
  error: string;
}

interface SimpleErrorBody {
  statusCode: number;
  message: string;
}

type ErrorBody = DomainErrorBody | DtoErrorBody | SimpleErrorBody;

function isDomainError(body: ErrorBody): body is DomainErrorBody {
  return Array.isArray((body as DomainErrorBody).errors);
}

function isDtoError(body: ErrorBody): body is DtoErrorBody {
  return Array.isArray((body as DtoErrorBody).message);
}

async function toApiError(response: Response): Promise<ApiError> {
  let body: ErrorBody | undefined;
  try {
    body = (await response.json()) as ErrorBody;
  } catch {
    return new ApiError(
      response.status,
      'Não foi possível se comunicar com o servidor.',
    );
  }

  if (isDomainError(body)) {
    const message = body.errors.map((error) => error.message).join(' ');
    return new ApiError(body.statusCode, message || 'Alguns campos são inválidos.');
  }

  if (isDtoError(body)) {
    return new ApiError(body.statusCode, body.message.join(' '));
  }

  const { field, message } = translateApiMessage(body.message);
  return new ApiError(body.statusCode, message, field);
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  // Don't trust the status code alone to know whether there's a body to
  // parse (a 200 with an empty body is a real thing this API can return) —
  // check the actual response text first.
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
