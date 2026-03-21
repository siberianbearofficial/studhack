import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { OAuthStorage, provideOAuthClient } from 'angular-oauth2-oidc';
import { firstValueFrom } from 'rxjs';

import {
  AUTH_RUNTIME_CONFIG,
  AUTH_STORAGE,
  AuthService,
  authRuntimeConfig,
} from '@core/auth';
import { provideStudhackApiClient } from '@core/api';
import { authInterceptor } from '@core/interceptors';
import { routes } from '@app/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (authService: AuthService) => () =>
        firstValueFrom(authService.initialize$()),
      deps: [AuthService],
    },
    { provide: AUTH_RUNTIME_CONFIG, useValue: authRuntimeConfig },
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStudhackApiClient(),
    provideOAuthClient(),
    { provide: OAuthStorage, useExisting: AUTH_STORAGE },
    provideRouter(routes),
    provideEventPlugins(),
  ],
};
