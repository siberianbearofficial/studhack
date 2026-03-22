import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { CurrentUserService } from '@core/current-user';

import { AuthService } from './auth.service';

const getLoginRedirectTree = (router: Router, returnUrl: string) =>
  router.createUrlTree(['/login'], {
    queryParams: { returnUrl },
  });

export const registeredUserGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const currentUser = inject(CurrentUserService);

  if (!auth.isAuthenticated()) {
    return getLoginRedirectTree(router, state.url);
  }

  return currentUser.load().pipe(
    map((user) =>
      user.id
        ? true
        : router.createUrlTree(['/register'], {
            queryParams: { returnUrl: state.url },
          }),
    ),
    catchError(() => of(getLoginRedirectTree(router, state.url))),
  );
};
