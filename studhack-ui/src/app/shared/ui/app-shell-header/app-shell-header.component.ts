import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
<<<<<<< HEAD
import { TuiButton, TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { TuiAvatar, TuiBadgeNotification, TuiBadgedContent, TuiProgressBar, TuiProgressSegmented } from '@taiga-ui/kit';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
=======
import {
  TuiButton,
  TuiDataList,
  TuiDropdown,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadgeNotification,
  TuiBadgedContent,
  TuiProgressBar,
  TuiProgressSegmented,
} from '@taiga-ui/kit';
import { TuiCard } from '@taiga-ui/layout';
import { catchError, forkJoin, of } from 'rxjs';
>>>>>>> 439482de (fix footer padding)

import { injectStudhackApiClient, type MyProfileDto } from '@core/api';
import { AuthService } from '@core/auth';
import { CurrentUserService, type CurrentUserDto } from '@core/current-user';
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
    TuiBadgeNotification,
    TuiBadgedContent,
    TuiButton,
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
  private readonly currentUserService = inject(CurrentUserService);
  private readonly router = inject(Router);

  private readonly publicNavItems: readonly HeaderNavItem[] = [
    {
      label: 'Поиск',
      path: '/profiles',
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
  protected readonly currentUser = this.currentUserService.currentUser;
  protected readonly hasAccount = this.currentUserService.hasAccount;
  protected readonly menuOpen = signal(false);
  protected readonly isCurrentUserLoading = signal(false);
  protected readonly profile = signal<MyProfileDto | null>(null);
  protected readonly navItems = computed<readonly HeaderNavItem[]>(() => [
    ...this.publicNavItems,
    ...(this.hasAccount()
      ? [
          {
            label: 'Мой профиль',
            path: '/profile',
            exact: true,
          } satisfies HeaderNavItem,
        ]
      : []),
  ]);
  protected readonly profileGrade = computed(() => {
    const profile = this.profile();

    return profile ? getProfileGrade(profile) : null;
  });
  protected readonly notificationCount = computed(() => {
    return 4;
  });
  protected readonly progressPercent = computed(() => {
    const grade = this.profileGrade();

    return grade ? Math.round((grade.value / grade.max) * 100) : 0;
  });
  protected readonly notificationBadge = computed(() => {
    const count = this.notificationCount();

    if (!count) {
      return '';
    }

    return count > 99 ? '99+' : String(count);
  });
  protected readonly avatarInitials = computed(() =>
    this.getInitials(this.currentUser()),
  );

  constructor() {
    effect((onCleanup) => {
      if (!this.isAuthenticated()) {
        this.menuOpen.set(false);
        this.isCurrentUserLoading.set(false);
        this.profile.set(null);

        return;
      }

      this.isCurrentUserLoading.set(true);

      const subscription = this.currentUserService
        .load()
        .pipe(
          switchMap((user) => (user.id ? this.api.getMe() : of(null))),
          catchError(() => of(null)),
          tap((profile) => {
            this.profile.set(profile);
          }),
          finalize(() => {
            this.isCurrentUserLoading.set(false);
          }),
        )
        .subscribe();

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

  protected openRegistration(): void {
    this.closeMenu();
    void this.router.navigate(['/register'], {
      queryParams: {
        returnUrl: '/profile',
      },
    });
  }

  protected logout(): void {
    this.closeMenu();
    this.currentUserService.clear();
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }

  private getInitials(
    profile: Pick<CurrentUserDto, 'displayName' | 'uniqueName'> | null,
  ): string {
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
