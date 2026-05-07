import { logger } from '@/lib/logger';

export type ErrorType = 'DATABASE_ERROR' | 'VALIDATION_ERROR' | 'AUTH_ERROR' | 'UNKNOWN_ERROR';

export class AppError extends Error {
  constructor(
    public message: string,
    public type: ErrorType = 'UNKNOWN_ERROR',
    public originalError?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleServiceError(error: any): never {
  logger.error(error.message || 'Service Error', {
    code: error.code,
    details: error.details,
    hint: error.hint,
    stack: error.stack
  });

  // Errores de Supabase
  if (error.code) {
    switch (error.code) {
      case '23505':
        throw new AppError('Este registro ya existe (duplicado).', 'DATABASE_ERROR', error);
      case '23503':
        throw new AppError('No se puede realizar la operación por una restricción de integridad.', 'DATABASE_ERROR', error);
      case '42P01':
        throw new AppError('Error de configuración: Tabla no encontrada.', 'DATABASE_ERROR', error);
      default:
        throw new AppError(error.message || 'Error inesperado en la base de datos.', 'DATABASE_ERROR', error);
    }
  }

  // Errores de Zod (Validación)
  if (error.name === 'ZodError') {
    const firstError = error.errors[0]?.message || 'Datos inválidos';
    throw new AppError(`Error de validación: ${firstError}`, 'VALIDATION_ERROR', error);
  }

  // Otros errores
  throw new AppError(
    error.message || 'Ha ocurrido un error inesperado.',
    'UNKNOWN_ERROR',
    error
  );
}
