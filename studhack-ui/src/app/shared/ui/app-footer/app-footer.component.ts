import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppLogoComponent } from '../app-logo/app-logo.component';

interface FooterLinkItem {
  readonly label: string;
  readonly link: string;
}

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLogoComponent, RouterLink],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.less',
})
export class AppFooterComponent {
  protected readonly navigationItems: readonly FooterLinkItem[] = [
    {
      label: 'О сервисе',
      link: '/',
    },
    {
      label: 'Поиск участников',
      link: '/profiles',
    },
    {
      label: 'События',
      link: '/events',
    },
    {
      label: 'Мой профиль',
      link: '/profile',
    },
  ];

  protected readonly quickLinkItems: readonly FooterLinkItem[] = [
    {
      label: 'Уведомления',
      link: '/notifications',
    },
    {
      label: 'Создать команду',
      link: '/teams/create',
    },
  ];
}
