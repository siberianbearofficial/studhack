import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { AUTH_RUNTIME_CONFIG } from '@core/auth';

import { STUDHACK_API_CLIENT } from './api.client';
import { HttpStudhackApiClient } from './http-studhack-api.client';
import { MockStudhackApiClient } from './mock/mock-studhack-api.client';

export type ApiClientMode = 'mock' | 'real';

export const API_CLIENT_MODE = new InjectionToken<ApiClientMode>(
  'API_CLIENT_MODE',
  {
    factory: () => inject(AUTH_RUNTIME_CONFIG).apiMode,
  },
);

export const API_MOCK_LATENCY_MS = new InjectionToken<number>(
  'API_MOCK_LATENCY_MS',
  {
    factory: () => inject(AUTH_RUNTIME_CONFIG).apiMockLatencyMs,
  },
);

export const provideStudhackApiClient = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    HttpStudhackApiClient,
    MockStudhackApiClient,
    {
      provide: STUDHACK_API_CLIENT,
      useFactory: () =>
        inject(API_CLIENT_MODE) === 'mock'
          ? inject(MockStudhackApiClient)
          : inject(HttpStudhackApiClient),
    },
  ]);
