import { inject, InjectionToken } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';

import {
  getRuntimeConfig,
  type AuthProviderOption,
  type RuntimeConfig,
} from '@core/config';

export type AuthRuntimeConfig = RuntimeConfig;

export const authRuntimeConfig: AuthRuntimeConfig = getRuntimeConfig();

export const AUTH_RUNTIME_CONFIG = new InjectionToken<AuthRuntimeConfig>(
  'AUTH_RUNTIME_CONFIG',
  {
    factory: () => authRuntimeConfig,
  },
);

export const AUTH_PROVIDERS = new InjectionToken<readonly AuthProviderOption[]>(
  'AUTH_PROVIDERS',
  {
    factory: () => inject(AUTH_RUNTIME_CONFIG).providers,
  },
);

export const OAUTH_CONFIG = new InjectionToken<AuthConfig>('OAUTH_CONFIG', {
  factory: () => {
    const config = inject(AUTH_RUNTIME_CONFIG);

    return {
      issuer: config.issuer,
      clientId: config.clientId,
      dummyClientSecret: config.clientSecret,
      responseType: 'code',
      redirectUri: config.redirectUri,
      postLogoutRedirectUri: config.postLogoutRedirectUri,
      showDebugInformation: true,
    };
  },
});
