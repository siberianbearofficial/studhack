import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TuiButton, TuiRoot, TuiTitle } from '@taiga-ui/core';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';
import { filter, map, startWith } from 'rxjs';

import { AuthService } from '@core/auth';

interface AppNavItem {
  readonly label: string;
  readonly path: string;
  readonly exact: boolean;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterOutlet,
    TuiButton,
    TuiCard,
    TuiHeader,
    TuiRoot,
    TuiTitle,
  ],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly navItems: readonly AppNavItem[] = [
    {
      label: 'Лендинг',
      path: '/',
      exact: true,
    },
    {
      label: 'Профили',
      path: '/profiles',
      exact: true,
    },
    {
      label: 'События',
      path: '/events',
      exact: true,
    },
    {
      label: 'Мой профиль',
      path: '/profile',
      exact: true,
    },
    {
      label: 'Создание команды',
      path: '/teams/create',
      exact: true,
    },
  ];
  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected loginWithGithub(): void {
    this.auth.startOrContinueLogin$('github').subscribe();
  }

  protected logout(): void {
    this.auth.logout();
  }

  protected isActive(path: string, exact: boolean): boolean {
    const currentUrl = this.currentUrl();

    if (path === '/') {
      return currentUrl === '/';
    }

    return exact ? currentUrl === path : currentUrl.startsWith(path);
  }
}
