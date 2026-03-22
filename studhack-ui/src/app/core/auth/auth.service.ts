import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginOptions, OAuthService } from 'angular-oauth2-oidc';
import {
  catchError,
  EMPTY,
  finalize,
  from,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

import { AUTH_STORAGE } from './auth.storage';
import { AUTH_RUNTIME_CONFIG, OAUTH_CONFIG } from './auth.config';

const PENDING_LOGIN_RETURN_URL_KEY = 'studhack.auth.pendingReturnUrl';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authRuntimeConfig = inject(AUTH_RUNTIME_CONFIG);
  private readonly oauthConfig = inject(OAUTH_CONFIG);
  private readonly oauthService = inject(OAuthService);
  private readonly storage = inject(AUTH_STORAGE);
  private readonly accessTokenState = signal<string | null>(null);
  private readonly pendingLoginReturnUrlState = signal<string | null>(
    this.readPendingLoginReturnUrl(),
  );

  private refreshing$?: Observable<string | null>;
  private configured = false;

  readonly accessToken = computed(() => this.accessTokenState());
  readonly isAuthenticated = computed(() => this.accessTokenState() !== null);
  readonly hasPendingLoginFlow = computed(
    () => this.pendingLoginReturnUrlState() !== null,
  );

  constructor() {
    this.oauthService.events.subscribe(() => {
      this.syncTokenState();
    });
  }

  initialize$(): Observable<string | null> {
    this.configure();

    return this.ensureDiscoveryDocumentLoaded$().pipe(
      switchMap(() => this.completeLoginFromRedirect$()),
      switchMap((token) => (token ? of(token) : this.refresh$())),
      catchError(() => of(this.syncTokenState())),
    );
  }

  startOrContinueLogin$(
    provider?: string,
    returnUrl?: string,
  ): Observable<string | null> {
    this.configure();

    return this.ensureDiscoveryDocumentLoaded$().pipe(
      switchMap(() => this.completeLoginFromRedirect$()),
      switchMap((token) =>
        token ? of(token) : this.refreshOrLogin$(provider, returnUrl),
      ),
    );
  }

  token(): string | null {
    return this.syncTokenState();
  }

  logout(): void {
    this.oauthService.logOut();
    this.accessTokenState.set(null);
    this.clearPendingLoginFlow();
  }

  refreshOrLogin$(provider?: string, returnUrl?: string): Observable<string | null> {
    const existingToken = this.token();

    if (existingToken) {
      return of(existingToken);
    }

    return this.refresh$().pipe(
      switchMap((newToken) =>
        newToken ? of(newToken) : this.login$(provider, returnUrl),
      ),
    );
  }

  pendingLoginReturnUrl(defaultUrl = '/profile'): string {
    return this.normalizeReturnUrl(this.pendingLoginReturnUrlState()) ?? defaultUrl;
  }

  completePendingLoginFlow(): void {
    this.clearPendingLoginFlow();
  }

  private login$(provider?: string, returnUrl?: string): Observable<never> {
    this.storePendingLoginReturnUrl(returnUrl);
    this.oauthService.initLoginFlow('', provider ? { provider } : undefined);

    return EMPTY;
  }

  private refresh$(): Observable<string | null> {
    if (!this.oauthService.getRefreshToken()) {
      return of(null);
    }

    if (this.refreshing$) {
      return this.refreshing$;
    }

    this.refreshing$ = from(this.oauthService.refreshToken()).pipe(
      switchMap(() => of(this.syncTokenState())),
      catchError(() => of(null)),
      finalize(() => {
        this.refreshing$ = undefined;
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    return this.refreshing$;
  }

  private ensureDiscoveryDocumentLoaded$(): Observable<void> {
    if (this.oauthService.discoveryDocumentLoaded) {
      return of(undefined);
    }

    return from(this.oauthService.loadDiscoveryDocument()).pipe(
      map(() => undefined),
    );
  }

  private completeLoginFromRedirect$(): Observable<string | null> {
    if (!this.hasLoginCallbackInUrl()) {
      return of(this.syncTokenState());
    }

    return from(this.oauthService.tryLoginCodeFlow(this.getLoginOptions())).pipe(
      switchMap(() => of(this.syncTokenState())),
      catchError(() => of(null)),
    );
  }

  private configure(): void {
    if (this.configured) {
      return;
    }

    this.oauthService.configure(this.oauthConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.configured = true;
  }

  private syncTokenState(): string | null {
    const token = this.oauthService.hasValidAccessToken()
      ? this.oauthService.getAccessToken()
      : null;

    this.accessTokenState.set(token);

    return token;
  }

  private hasLoginCallbackInUrl(): boolean {
    if (!globalThis.location) {
      return false;
    }

    const query = new URLSearchParams(globalThis.location.search);

    return ['code', 'state', 'session_state', 'error'].some((key) =>
      query.has(key),
    );
  }

  private getLoginOptions(): LoginOptions {
    return {
      disableNonceCheck: this.authRuntimeConfig.disableNonceCheck,
      disableOAuth2StateCheck: this.authRuntimeConfig.disableOAuth2StateCheck,
    };
  }

  private storePendingLoginReturnUrl(returnUrl?: string): void {
    const nextUrl = this.normalizeReturnUrl(returnUrl) ?? this.getCurrentLocationUrl();

    this.pendingLoginReturnUrlState.set(nextUrl);
    this.storage.setItem(PENDING_LOGIN_RETURN_URL_KEY, nextUrl);
  }

  private clearPendingLoginFlow(): void {
    this.pendingLoginReturnUrlState.set(null);
    this.storage.removeItem(PENDING_LOGIN_RETURN_URL_KEY);
  }

  private readPendingLoginReturnUrl(): string | null {
    return this.normalizeReturnUrl(
      this.storage.getItem(PENDING_LOGIN_RETURN_URL_KEY),
    );
  }

  private normalizeReturnUrl(returnUrl: string | null | undefined): string | null {
    if (!returnUrl?.startsWith('/')) {
      return null;
    }

    return returnUrl === '/login' ? '/profile' : returnUrl;
  }

  private getCurrentLocationUrl(): string {
    if (!globalThis.location) {
      return '/profile';
    }

    return `${globalThis.location.pathname}${globalThis.location.search}${globalThis.location.hash}`;
  }
}
