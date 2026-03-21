import { inject, InjectionToken } from '@angular/core';

import { AUTH_RUNTIME_CONFIG } from '@core/auth';

const getBrowserOrigin = (): string =>
  globalThis.location?.origin ?? 'http://localhost:4200';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  factory: () => inject(AUTH_RUNTIME_CONFIG).apiBaseUrl,
});

export const resolveApiUrl = (url: string): string =>
  new URL(url, getBrowserOrigin()).toString();
