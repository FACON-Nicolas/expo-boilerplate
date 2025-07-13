import { z } from 'zod';
import i18n from '@/i18n';

type ValidationResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const validateWithI18n = <T>(
  t: (key: string) => string,
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> => {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const firstError = result.error.errors[0];

  let errorMessage: string;
  if (
    typeof firstError.message === 'string' &&
    firstError.message.startsWith('errors.')
  ) {
    errorMessage = t(firstError.message);
  } else {
    errorMessage = firstError.message;
  }

  return {
    success: false,
    error: errorMessage,
  };
};

export const validateWithI18nAsync = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> => {
  const result = validateWithI18n(i18n.t, schema, data);

  if (result.success) {
    return Promise.resolve(result.data!);
  }

  return Promise.reject(new Error(result.error!));
};
