import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { TuiButton, TuiDataList, TuiDropdown } from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadgeNotification,
  TuiBadgedContent,
  TuiProgressBar,
  TuiProgressSegmented,
} from '@taiga-ui/kit';

import { MyProfileStore } from '@core/data';
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
  private readonly auth = inject(AuthService);
  private readonly myProfileStore = inject(MyProfileStore);
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
  protected readonly hasAccount = computed(
    () => this.currentUserService.hasAccount() || this.myProfileStore.hasProfile(),
  );
  protected readonly menuOpen = signal(false);
  protected readonly isCurrentUserLoading = this.myProfileStore.isLoading;

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
    const profile = this.myProfileStore.me();
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
    this.getInitials(this.myProfileStore.me() ?? this.currentUser()),
  );

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
