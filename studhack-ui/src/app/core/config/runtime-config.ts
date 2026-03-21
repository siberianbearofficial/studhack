export interface AuthProviderOption {
  readonly id: string;
  readonly label: string;
}

export type ApiMode = 'mock' | 'real';

interface RuntimeConfigOverride {
  readonly issuer?: string;
  readonly clientId?: string;
  readonly clientSecret?: string;
  readonly apiBaseUrl?: string;
  readonly apiMode?: ApiMode;
  readonly apiMockLatencyMs?: number;
  readonly redirectUri?: string;
  readonly postLogoutRedirectUri?: string;
  readonly disableNonceCheck?: boolean;
  readonly disableOAuth2StateCheck?: boolean;
  readonly providers?: readonly AuthProviderOption[];
}

export interface RuntimeConfig {
  readonly issuer: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly apiBaseUrl: string;
  readonly apiMode: ApiMode;
  readonly apiMockLatencyMs: number;
  readonly redirectUri: string;
  readonly postLogoutRedirectUri: string;
  readonly disableNonceCheck: boolean;
  readonly disableOAuth2StateCheck: boolean;
  readonly providers: readonly AuthProviderOption[];
}

type RuntimeConfigGlobal = typeof globalThis & {
  __STUDHACK_RUNTIME_CONFIG__?: RuntimeConfigOverride;
};

const DEFAULT_ORIGIN = 'http://localhost:4200';

const DEFAULT_RUNTIME_CONFIG: Omit<
  RuntimeConfig,
  'redirectUri' | 'postLogoutRedirectUri'
> = {
  issuer: 'https://auth.nachert.art/api/v1',
  clientId: '5caecabfac74b7709d102315ca3abc9b',
  // Наш OAuth провайдер пока требует client secret даже для SPA.
  clientSecret: '0f756a3707762ec4d04df5625adcac6a',
  apiBaseUrl: 'http://localhost:5000',
  apiMode: 'real',
  apiMockLatencyMs: 200,
  disableNonceCheck: false,
  disableOAuth2StateCheck: false,
  providers: [
    { id: 'password', label: 'Логин / пароль' },
    { id: 'yandex', label: 'Яндекс' },
    { id: 'github', label: 'GitHub' },
    { id: 'gitlab', label: 'GitLab' },
    { id: 'google', label: 'Google' },
  ],
};

const getBrowserOrigin = (): string =>
  globalThis.location?.origin ?? DEFAULT_ORIGIN;

const getRuntimeConfigOverride = (): RuntimeConfigOverride =>
  (globalThis as RuntimeConfigGlobal).__STUDHACK_RUNTIME_CONFIG__ ?? {};

export const getRuntimeConfig = (): RuntimeConfig => {
  const override = getRuntimeConfigOverride();
  const redirectUri = override.redirectUri ?? getBrowserOrigin();

  return {
    ...DEFAULT_RUNTIME_CONFIG,
    ...override,
    redirectUri,
    postLogoutRedirectUri: override.postLogoutRedirectUri ?? redirectUri,
  };
};
