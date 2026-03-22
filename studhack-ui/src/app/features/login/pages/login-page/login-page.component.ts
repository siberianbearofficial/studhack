import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiButton, TuiLoader, TuiTitle } from '@taiga-ui/core';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';
import { finalize } from 'rxjs';

import { AuthService } from '@core/auth';
import { CurrentUserService } from '@core/current-user';
import { getErrorMessage } from '@shared';

type LoginProviderId = 'password' | 'yandex' | 'github' | 'gitlab' | 'google';

interface LoginProvider {
  readonly id: LoginProviderId;
  readonly label: string;
  readonly icon: string;
  readonly appearance: 'accent' | 'secondary';
}

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiButton, TuiCard, TuiHeader, TuiLoader, TuiTitle],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.less',
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isResolving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly providers: readonly LoginProvider[] = [
    {
      id: 'password',
      label: 'Логин / пароль',
      icon: '@tui.lock-keyhole',
      appearance: 'accent',
    },
    {
      id: 'yandex',
      label: 'Яндекс',
      icon: '@tui.earth',
      appearance: 'secondary',
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: '@tui.github',
      appearance: 'secondary',
    },
    {
      id: 'gitlab',
      label: 'GitLab',
      icon: '@tui.gitlab',
      appearance: 'secondary',
    },
    {
      id: 'google',
      label: 'Google',
      icon: '@tui.globe',
      appearance: 'secondary',
    },
  ];

  constructor() {
    if (this.auth.isAuthenticated()) {
      queueMicrotask(() => {
        this.finishLogin();
      });
    }
  }

  protected login(provider: LoginProviderId): void {
    this.error.set(null);

    this.auth
      .startOrContinueLogin$(provider, this.getRequestedReturnUrl())
      .subscribe({
        next: (token) => {
          if (token) {
            this.finishLogin();
          }
        },
        error: (error: unknown) => {
          this.error.set(getErrorMessage(error, 'Не удалось начать вход'));
        },
      });
  }

  protected goHome(): void {
    this.auth.completePendingLoginFlow();
    void this.router.navigateByUrl('/');
  }

  private finishLogin(): void {
    if (this.isResolving()) {
      return;
    }

    this.error.set(null);
    this.isResolving.set(true);

    this.currentUser
      .load({ force: true })
      .pipe(
        finalize(() => {
          this.isResolving.set(false);
        }),
      )
      .subscribe({
        next: (user) => {
          this.auth.completePendingLoginFlow();

          if (user.id) {
            void this.router.navigateByUrl(this.getRequestedReturnUrl());
            return;
          }

          void this.router.navigate(['/register'], {
            queryParams: {
              returnUrl: this.getRequestedReturnUrl(),
            },
          });
        },
        error: (error: unknown) => {
          this.error.set(
            getErrorMessage(error, 'Не удалось получить текущего пользователя'),
          );
        },
      });
  }

  private getRequestedReturnUrl(): string {
    const queryReturnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const fallback = this.auth.pendingLoginReturnUrl('/profile');
    const requested =
      queryReturnUrl && queryReturnUrl.startsWith('/') ? queryReturnUrl : fallback;

    if (requested === '/login' || requested === '/register') {
      return '/profile';
    }

    return requested;
  }
}
