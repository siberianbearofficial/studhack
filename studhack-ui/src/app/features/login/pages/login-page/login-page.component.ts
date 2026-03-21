import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { AuthService } from '@core/auth';

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
  imports: [TuiButton, TuiCard, TuiHeader, TuiTitle],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.less',
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);

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

  protected login(provider: LoginProviderId): void {
    this.auth.startOrContinueLogin$(provider).subscribe();
  }
}
