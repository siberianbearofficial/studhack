import { Routes } from '@angular/router';

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
    path: 'notifications',
    title: 'Уведомления',
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
    path: 'events',
    title: 'События',
    loadComponent: () =>
      import('@features/events').then((module) => module.EventsPageComponent),
  },
  {
    path: 'profile',
    title: 'Мой профиль',
    loadComponent: () =>
      import('@features/profile').then((module) => module.ProfilePageComponent),
  },
  {
    path: 'teams/create',
    title: 'Создание команды',
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
