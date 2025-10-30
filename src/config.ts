import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

/**
 * Configuración de la aplicación
 */
export interface Config {
  leantimeUrl: string;
  leantimeApiKey: string;
}

/**
 * Opciones de configuración que pueden ser proporcionadas directamente
 */
export interface ConfigOptions {
  leantimeUrl?: string;
  leantimeApiKey?: string;
}

/**
 * Valida y carga la configuración desde parámetros proporcionados o variables de entorno.
 * Los parámetros proporcionados tienen prioridad sobre las variables de entorno.
 *
 * @param options - Opciones de configuración opcionales
 * @throws Error si falta alguna configuración requerida
 */
export function loadConfig(options?: ConfigOptions): Config {
  // Prioridad: parámetros > variables de entorno
  const leantimeUrl = options?.leantimeUrl || process.env.LEANTIME_URL;
  const leantimeApiKey = options?.leantimeApiKey || process.env.LEANTIME_API_KEY;

  if (!leantimeUrl) {
    throw new Error(
      'LEANTIME_URL is not configured. Please provide it as a parameter or set it in your .env file or environment variables.'
    );
  }

  if (!leantimeApiKey) {
    throw new Error(
      'LEANTIME_API_KEY is not configured. Please provide it as a parameter or set it in your .env file or environment variables.'
    );
  }

  // Validar que la URL no termine con barra
  const normalizedUrl = leantimeUrl.endsWith('/') ? leantimeUrl.slice(0, -1) : leantimeUrl;

  return {
    leantimeUrl: normalizedUrl,
    leantimeApiKey,
  };
}
