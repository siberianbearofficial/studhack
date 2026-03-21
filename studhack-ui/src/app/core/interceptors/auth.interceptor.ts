import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

import { API_BASE_URL, resolveApiUrl } from '@core/api';
import { AuthService, isAuthError } from '@core/auth';

export const AUTH_REQUIRED = new HttpContextToken<boolean>(() => false);

export const withAuth = (context = new HttpContext()): HttpContext =>
  context.set(AUTH_REQUIRED, true);

const isApiRequest = (requestUrl: string, apiBaseUrl: string): boolean => {
  const request = new URL(resolveApiUrl(requestUrl));
  const api = new URL(resolveApiUrl(apiBaseUrl));
  const apiPath = api.pathname.replace(/\/$/, '');

  return (
    request.origin === api.origin &&
    (request.pathname === apiPath || request.pathname.startsWith(`${apiPath}/`))
  );
};

const withBearerAuthHeader = (
  req: HttpRequest<unknown>,
  token: string | null,
): HttpRequest<unknown> =>
  token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const apiUrl = inject(API_BASE_URL);

  if (!isApiRequest(req.url, apiUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const authRequired = req.context.get(AUTH_REQUIRED);
  const currentToken = auth.token();

  if (authRequired && !currentToken) {
    return auth.refreshOrLogin$().pipe(
      switchMap((newToken) => {
        if (!newToken) {
          return throwError(() => new Error('Authentication required'));
        }

        return next(withBearerAuthHeader(req, newToken));
      }),
    );
  }

  return next(withBearerAuthHeader(req, currentToken)).pipe(
    catchError((err: unknown) => {
      if (!authRequired || !isAuthError(err as HttpErrorResponse)) {
        return throwError(() => err);
      }

      return auth.refreshOrLogin$().pipe(
        switchMap((newToken) => {
          if (!newToken) {
            return throwError(() => err);
          }

          return next(withBearerAuthHeader(req, newToken));
        }),
      );
    }),
  );
};
