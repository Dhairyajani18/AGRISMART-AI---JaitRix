/**
 * Central API Client Configuration for AGRISMART AI
 * Isolates all HTTP requests and base configuration so the Python ML backend
 * can be plugged in seamlessly via VITE_API_BASE_URL.
 */

export const API_BASE_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? (import.meta.env.VITE_API_BASE_URL as string)
    : 'http://localhost:8000';

/**
 * Configurable Backend Endpoint Placeholders.
 * Modify these constants to match the exact routes exposed by your Python FastAPI / Flask backend.
 */
export const CROP_PREDICTION_ENDPOINT = '/predict/crop';
export const DISEASE_PREDICTION_ENDPOINT = '/predict/disease';

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export class AppApiError extends Error {
  statusCode?: number;
  details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'AppApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Central request wrapper
 */
export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
    defaultHeaders['Accept'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `Server returned ${response.status} ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson && errorJson.message) {
          errorMessage = errorJson.message;
        } else if (errorJson && errorJson.detail) {
          errorMessage = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch {
        // Fallback to text or status text
      }
      throw new AppApiError(errorMessage, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AppApiError) {
      throw error;
    }
    const err = error as Error;
    throw new AppApiError(
      err.message || 'Network connection failed. Could not reach agricultural ML backend.',
      0,
      err
    );
  }
}
