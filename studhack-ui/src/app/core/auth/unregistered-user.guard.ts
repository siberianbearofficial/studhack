import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { CurrentUserService } from '@core/current-user';

import { AuthService } from './auth.service';

const getRequestedReturnUrl = (candidate: string | null | undefined): string =>
  candidate &&
  candidate.startsWith('/') &&
  candidate !== '/login' &&
  candidate !== '/register'
    ? candidate
    : '/profile';

export const unregisteredUserGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const currentUser = inject(CurrentUserService);
  const returnUrl = getRequestedReturnUrl(route.queryParamMap.get('returnUrl') ?? state.url);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl },
    });
  }

  return currentUser.load().pipe(
    map((user) => (user.id ? router.parseUrl(returnUrl) : true)),
    catchError(() =>
      of(
        router.createUrlTree(['/login'], {
          queryParams: { returnUrl },
        }),
      ),
    ),
  );
};
