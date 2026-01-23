export type AppErrorCode =
  | 'UNKNOWN'
  | 'VALIDATION'
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly originalError?: unknown;

  constructor(message: string, code: AppErrorCode = 'UNKNOWN', originalError?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.originalError = originalError;
  }

  static fromUnknown(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message, 'UNKNOWN', error);
    }

    return new AppError(String(error), 'UNKNOWN', error);
  }

  static validation(message: string): AppError {
    return new AppError(message, 'VALIDATION');
  }

  static network(message: string, originalError?: unknown): AppError {
    return new AppError(message, 'NETWORK', originalError);
  }

  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(message, 'UNAUTHORIZED');
  }

  static notFound(message: string): AppError {
    return new AppError(message, 'NOT_FOUND');
  }

  static hasCode(error: unknown): error is { code: string } {
    if (error === null || typeof error !== 'object' || !('code' in error)) {
      return false;
    }
    const { code } = error;
    return typeof code === 'string';
  }
}
