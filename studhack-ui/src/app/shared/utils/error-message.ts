import { HttpErrorResponse } from '@angular/common/http';

import { type ApiError } from '@core/api';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const hasMessage = (value: unknown): value is { message: string } =>
  isRecord(value) && typeof value['message'] === 'string';

const hasDetail = (value: unknown): value is { detail: string } =>
  isRecord(value) && typeof value['detail'] === 'string';

const hasApiError = (value: unknown): value is ApiError =>
  isRecord(value) &&
  isRecord(value['error']) &&
  typeof value['error']['message'] === 'string';

export function getErrorMessage(
  error: unknown,
  fallback = 'Не удалось выполнить запрос',
): string {
  if (error instanceof HttpErrorResponse) {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error.trim();
    }

    if (hasApiError(error.error)) {
      return error.error.error.message;
    }

    if (hasDetail(error.error)) {
      return error.error.detail;
    }

    if (hasMessage(error.error)) {
      return error.error.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (hasApiError(error)) {
    return error.error.message;
  }

  if (hasDetail(error)) {
    return error.detail;
  }

  if (hasMessage(error)) {
    return error.message;
  }

  return fallback;
}
