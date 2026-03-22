import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

import { API_CLIENT_MODE, injectStudhackApiClient } from '@core/api';
import { CurrentUserService } from '@core/current-user';

import { AuthService } from './auth.service';

const getLoginRedirectTree = (router: Router, returnUrl: string) =>
  router.createUrlTree(['/login'], {
    queryParams: { returnUrl },
  });

export const registeredUserGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const apiMode = inject(API_CLIENT_MODE);
  const api = injectStudhackApiClient();
  const currentUser = inject(CurrentUserService);

  if (!auth.isAuthenticated()) {
    return getLoginRedirectTree(router, state.url);
  }

  return currentUser.load().pipe(
    switchMap((user) => {
      if (user.id) {
        return of(true);
      }

      if (apiMode !== 'mock') {
        return of(
          router.createUrlTree(['/register'], {
            queryParams: { returnUrl: state.url },
          }),
        );
      }

      return api.getMe().pipe(
        map(() => true),
        catchError(() =>
          of(
            router.createUrlTree(['/register'], {
              queryParams: { returnUrl: state.url },
            }),
          ),
        ),
      );
    }),
    catchError(() => of(getLoginRedirectTree(router, state.url))),
  );
};
