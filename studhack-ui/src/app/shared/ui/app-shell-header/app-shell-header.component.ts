import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  TuiButton,
  TuiDataList,
  TuiDropdown,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadge,
  TuiBadgeNotification,
  TuiBadgedContent,
  TuiProgressBar,
  TuiProgressSegmented,
} from '@taiga-ui/kit';
import { TuiCard } from '@taiga-ui/layout';
import { catchError, forkJoin, of } from 'rxjs';

import {
  injectStudhackApiClient,
  type MyProfileDto,
  type TeamRequestsFeedDto,
} from '@core/api';
import { AuthService } from '@core/auth';
import { getProfileGrade } from '@shared';

import { AppLogoComponent } from '../app-logo/app-logo.component';

interface HeaderNavItem {
  readonly label: string;
  readonly path: string;
  readonly exact: boolean;
}

@Component({
  selector: 'app-shell-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppLogoComponent,
    RouterLink,
    RouterLinkActive,
    TuiAvatar,
    TuiBadge,
    TuiBadgeNotification,
    TuiBadgedContent,
    TuiButton,
    TuiCard,
    TuiDataList,
    TuiDropdown,
    TuiProgressBar,
    TuiProgressSegmented,
  ],
  templateUrl: './app-shell-header.component.html',
  styleUrl: './app-shell-header.component.less',
})
export class AppShellHeaderComponent {
  private readonly api = injectStudhackApiClient();
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navItems: readonly HeaderNavItem[] = [
    {
      label: 'Поиск',
      path: '/profiles',
      exact: true,
    },
    {
      label: 'Мой профиль',
      path: '/profile',
      exact: true,
    },
    {
      label: 'Для организаторов',
      path: '/events',
      exact: true,
    },
    {
      label: 'О сервисе',
      path: '/',
      exact: true,
    },
  ];
  protected readonly isAuthenticated = this.auth.isAuthenticated;
  protected readonly menuOpen = signal(false);
  protected readonly me = signal<MyProfileDto | null>(null);
  private readonly teamRequests = signal<TeamRequestsFeedDto | null>(null);
  protected readonly profileGrade = computed(() => {
    const me = this.me();

    return me ? getProfileGrade(me) : null;
  });
  protected readonly avatarInitials = computed(() => this.getInitials(this.me()));
  protected readonly notificationCount = computed(() => {
    const feed = this.teamRequests();

    if (!feed) {
      return 0;
    }

    return [...feed.inbox, ...feed.managedTeams].filter(
      (request) => request.status === 'pending',
    ).length;
  });
  protected readonly notificationBadge = computed(() => {
    const count = this.notificationCount();

    if (!count) {
      return '';
    }

    return count > 99 ? '99+' : String(count);
  });

  constructor() {
    effect((onCleanup) => {
      if (!this.isAuthenticated()) {
        this.me.set(null);
        this.teamRequests.set(null);
        this.menuOpen.set(false);

        return;
      }

      const subscription = forkJoin({
        me: this.api.getMe().pipe(catchError(() => of(null))),
        teamRequests: this.api
          .getTeamRequests()
          .pipe(catchError(() => of<TeamRequestsFeedDto | null>(null))),
      }).subscribe(({ me, teamRequests }) => {
        this.me.set(me);
        this.teamRequests.set(teamRequests);
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected openNotifications(): void {
    this.closeMenu();
    void this.router.navigateByUrl('/notifications');
  }

  protected openProfile(): void {
    this.closeMenu();
    void this.router.navigateByUrl('/profile');
  }

  protected logout(): void {
    this.closeMenu();
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }

  private getInitials(profile: MyProfileDto | null): string {
    const source = profile?.displayName?.trim() || profile?.uniqueName?.trim();

    if (!source) {
      return 'SH';
    }

    const initials = source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

    return initials || source.slice(0, 2).toUpperCase();
  }
}
