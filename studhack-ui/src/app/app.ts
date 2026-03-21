import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';
import { filter, map, startWith } from 'rxjs';

import { AppFooterComponent, AppShellHeaderComponent } from '@shared/ui';

const FOOTER_ROUTES = new Set([
  '/',
  '/events',
  '/notifications',
  '/profile',
  '/profiles',
]);

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppFooterComponent, AppShellHeaderComponent, RouterOutlet, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
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
    FOOTER_ROUTES.has(this.normalizeUrl(this.currentUrl())),
  );

  private normalizeUrl(url: string): string {
    const [path] = url.split(/[?#]/);
    const normalizedPath = path || '/';

    return normalizedPath === '/' ? normalizedPath : normalizedPath.replace(/\/+$/, '');
  }
}
