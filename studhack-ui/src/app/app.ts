<<<<<<< HEAD
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
=======
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
>>>>>>> 439482de (fix footer padding)
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';
import { filter, map, startWith } from 'rxjs';

import { AppFooterComponent, AppShellHeaderComponent } from '@shared/ui';
<<<<<<< HEAD
import { AuthService } from '@core/auth';
=======
>>>>>>> 439482de (fix footer padding)

const FOOTER_ROUTES = new Set([
  '/',
  '/events',
  '/notifications',
  '/profile',
  '/profiles',
]);
<<<<<<< HEAD
const FOOTER_ROUTE_PREFIXES = ['/events/'];
=======
>>>>>>> 439482de (fix footer padding)

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppFooterComponent, AppShellHeaderComponent, RouterOutlet, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
<<<<<<< HEAD
  private readonly auth = inject(AuthService);
=======
>>>>>>> 439482de (fix footer padding)
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
  protected readonly showFooter = computed(() =>
<<<<<<< HEAD
    FOOTER_ROUTES.has(this.normalizeUrl(this.currentUrl())) ||
    FOOTER_ROUTE_PREFIXES.some((prefix) =>
      this.normalizeUrl(this.currentUrl()).startsWith(prefix),
    ),
  );

  constructor() {
    effect(() => {
      const currentUrl = this.normalizeUrl(this.currentUrl());

      if (
        !this.auth.isAuthenticated() ||
        !this.auth.hasPendingLoginFlow() ||
        currentUrl === '/login' ||
        currentUrl === '/register'
      ) {
        return;
      }

      queueMicrotask(() => {
        void this.router.navigate(['/login']);
      });
    });
  }

=======
    FOOTER_ROUTES.has(this.normalizeUrl(this.currentUrl())),
  );

>>>>>>> 439482de (fix footer padding)
  private normalizeUrl(url: string): string {
    const [path] = url.split(/[?#]/);
    const normalizedPath = path || '/';

    return normalizedPath === '/' ? normalizedPath : normalizedPath.replace(/\/+$/, '');
  }
}
