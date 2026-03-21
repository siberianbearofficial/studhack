import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiTitle, TuiSurface } from '@taiga-ui/core';
import { TuiBadge, TuiAvatar } from '@taiga-ui/kit';
import { TuiCard, TuiHeader, TuiCardLarge } from '@taiga-ui/layout';
import { TuiPlatform } from '@taiga-ui/cdk';
import { signal } from '@angular/core';

import { SketchfabEmbedComponent } from '@shared/ui';

import { LandingMetricCardComponent } from '../../components/landing-metric-card/landing-metric-card.component';
import { LandingStore } from '../../store/landing.store';

@Component({
  selector: 'app-landing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    LandingMetricCardComponent,
    RouterLink,
    SketchfabEmbedComponent,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiHeader,
    TuiTitle,

    TuiAvatar,
    TuiCardLarge,
    TuiPlatform,
    TuiSurface,
    
  ],
  providers: [LandingStore],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.less',
})
export class LandingPageComponent {
  protected readonly store = inject(LandingStore);



  protected readonly users = [
  {
    id: 1,
    photo: 'assets/Picture.png',
    status: 'Ищу команду',
    name: 'Анна Смирнова',
    role: 'Frontend Developer',
    skills: ['Angular', 'TypeScript', 'UI/UX'],
  },
  {
    id: 2,
    photo: 'assets/Picture.png',
    status: 'Открыт к мэтчу',
    name: 'Максим Волков',
    role: 'Backend Developer',
    skills: ['Node.js', 'NestJS', 'PostgreSQL'],
  },
  {
    id: 3,
    photo: 'assets/Picture.png',
    status: 'Собираю команду',
    name: 'Елизавета Орлова',
    role: 'Product Designer',
    skills: ['Figma', 'UX', 'Research'],
  },
];



  protected readonly metrics = computed(() => {
    const overview = this.store.overview();

    if (!overview) {
      return [];
    }

    

    return [
      {
        value: String(overview.usersCount),
        label: 'Профилей уже можно листать',
        detail: 'Страница профилей станет точкой входа для поиска сокомандников.',
        badge: 'Profiles',
      },
      {
        value: String(overview.eventsCount),
        label: 'Событий для проверки роутов',
        detail: 'Список событий готов под проработку карточек хакатонов.',
        badge: 'Events',
      },
      {
        value: String(overview.teamsCount),
        label: 'Команд в моковых данных',
        detail: 'Этого достаточно, чтобы накинуть стартовый контекст страниц.',
        badge: 'Teams',
      },
      {
        value: String(overview.openPositionsCount),
        label: 'Открытых ролей',
        detail: 'Флоу создания команды уже можно увязать с реальными данными.',
        badge: 'Flow',
      },
    ];
  });

  
}
