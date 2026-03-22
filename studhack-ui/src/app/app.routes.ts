import { Routes } from '@angular/router';

import { registeredUserGuard, unregisteredUserGuard } from '@core/auth';

export const routes: Routes = [
  {
    path: '',
    title: 'StudHack',
    loadComponent: () =>
      import('@features/landing').then((module) => module.LandingPageComponent),
  },
  {
    path: 'profiles/:userId',
    title: 'Профиль участника',
    loadComponent: () =>
      import('@features/profile').then((module) => module.UserProfilePageComponent),
  },
  {
    path: 'login',
    title: 'Вход',
    loadComponent: () =>
      import('@features/login').then((module) => module.LoginPageComponent),
  },
  {
    path: 'register',
    title: 'Регистрация',
    canActivate: [unregisteredUserGuard],
    loadComponent: () =>
      import('@features/register').then((module) => module.RegisterPageComponent),
  },
  {
    path: 'notifications',
    title: 'Уведомления',
    canActivate: [registeredUserGuard],
    loadComponent: () =>
      import('@features/notifications').then(
        (module) => module.NotificationsPageComponent,
      ),
  },
  {
    path: 'profiles',
    title: 'Профили',
    loadComponent: () =>
      import('@features/profiles').then((module) => module.ProfilesPageComponent),
  },
  {
    path: 'events/:eventId',
    title: 'Мероприятие',
    loadComponent: () =>
      import('@features/events').then((module) => module.EventDetailsPageComponent),
  },
  {
    path: 'events',
    title: 'События',
    loadComponent: () =>
      import('@features/events').then((module) => module.EventsPageComponent),
  },
  {
    path: 'profile',
    title: 'Мой профиль',
    canActivate: [registeredUserGuard],
    loadComponent: () =>
      import('@features/profile').then((module) => module.ProfilePageComponent),
  },
  {
    path: 'teams/create',
    title: 'Создание команды',
    canActivate: [registeredUserGuard],
    loadComponent: () =>
      import('@features/team-creation').then(
        (module) => module.CreateTeamPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
