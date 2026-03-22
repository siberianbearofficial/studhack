import { Location, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  TuiButton,
  TuiLink,
  TuiLoader,
  TuiSurface,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiDialog } from '@taiga-ui/core/components/dialog';
import { TuiBadge, TuiButtonLoading, TuiProgress } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';
import { distinctUntilChanged, map } from 'rxjs';

import {
  type EventStageDto,
  type TeamInEventDto,
  type TeamPositionDto,
  type TeamRequestDto,
} from '@core/api';
import { TeamCreationModalComponent } from '@features/team-creation';
import { TeamRequestDialogComponent } from '@features/team-requests';
import {
  formatEventDateTimeLabel,
  formatEventTeamSizeRange,
  getEventCoverBackground,
  getEventDateSpanLabel,
  getEventDifficulty,
  getEventLocationDetailsLabel,
  getEventLocationLabel,
  getEventScheduleLabel,
  getEventStageScheduleLabel,
  getEventStartsInLabel,
  getEventTeamSizeBounds,
  getEventTypeLabel,
  getEventVenueLabel,
} from '@shared';

import { EventDetailsStore } from '../../store/event-details.store';

interface EventHeroBadge {
  readonly appearance: 'info' | 'primary' | 'success';
  readonly icon?: string;
  readonly label: string;
}

interface EventHeroMetric {
  readonly caption: string;
  readonly label: string;
  readonly value: string;
}

interface EventQuickFact {
  readonly label: string;
  readonly value: string;
}

interface EventOpenRole {
  readonly id: string;
  readonly skillsLabel: string;
  readonly teamName: string;
  readonly title: string;
}

@Component({
  selector: 'app-event-details-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TuiDialog,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiHeader,
    TuiLink,
    TuiLoader,
    TuiProgress,
    TuiSurface,
    TuiTitle,
    TuiButtonLoading,
    TeamCreationModalComponent,
    TeamRequestDialogComponent,
  ],
  providers: [EventDetailsStore],
  templateUrl: './event-details-page.component.html',
  styleUrl: './event-details-page.component.less',
})
export class EventDetailsPageComponent {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);

  protected readonly store = inject(EventDetailsStore);
  protected readonly teamCreationOpen = signal(false);
  protected readonly teamRequestDialogTeamId = signal<string | null>(null);
  protected readonly event = computed(() => this.store.event());
  protected readonly teamRequestDialogTeam = computed(() => {
    const teamId = this.teamRequestDialogTeamId();

    return teamId
      ? this.store.teams().find((team) => team.id === teamId) ?? null
      : null;
  });
  protected readonly teamRequestDialogPosition = computed(() => {
    const team = this.teamRequestDialogTeam();

    return team ? this.store.getPrimaryOpenPosition(team) : null;
  });
  protected readonly coverBackground = computed(() => {
    const event = this.event();

    return event ? getEventCoverBackground(event) : '';
  });
  protected readonly coverLabel = computed(() => {
    const event = this.event();

    return event ? getEventTypeLabel(event) : '';
  });
  protected readonly coverDate = computed(() => {
    const event = this.event();

    return event ? getEventDateSpanLabel(event) : '';
  });
  protected readonly venueLabel = computed(() => {
    const event = this.event();

    return event ? getEventVenueLabel(event) : '';
  });
  protected readonly scheduleLabel = computed(() => {
    const event = this.event();

    return event ? getEventScheduleLabel(event) : '';
  });
  protected readonly locationDetailsLabel = computed(() => {
    const event = this.event();

    return event ? getEventLocationDetailsLabel(event) : '';
  });
  protected readonly difficulty = computed(() => {
    const event = this.event();

    return event ? getEventDifficulty(event) : null;
  });
  protected readonly teamSizeLabel = computed(() => {
    const event = this.event();

    return event ? formatEventTeamSizeRange(getEventTeamSizeBounds(event)) : '';
  });
  protected readonly heroBadges = computed<readonly EventHeroBadge[]>(() => {
    const event = this.event();

    if (!event) {
      return [];
    }

    return [
      {
        appearance: 'primary',
        label: getEventTypeLabel(event),
      },
      {
        appearance: 'info',
        icon: '@tui.map-pin',
        label: getEventLocationLabel(event),
      },
      {
        appearance: 'success',
        icon: '@tui.calendar-clock',
        label: getEventStartsInLabel(event),
      },
    ];
  });
  protected readonly heroMetrics = computed<readonly EventHeroMetric[]>(() => {
    const event = this.event();

    if (!event) {
      return [];
    }

    const openRolesCount = event.teams.reduce(
      (total, team) => total + team.openPositionsCount,
      0,
    );

    return [
      {
        caption: 'Подписались на обновления',
        label: 'Подписчики',
        value: String(event.subscription.subscribersCount),
      },
      {
        caption: 'Собирают решения прямо сейчас',
        label: 'Команды',
        value: String(event.teams.length),
      },
      {
        caption: 'Можно откликнуться уже сегодня',
        label: 'Открытые роли',
        value: String(openRolesCount),
      },
    ];
  });
  protected readonly quickFacts = computed<readonly EventQuickFact[]>(() => {
    const event = this.event();

    if (!event) {
      return [];
    }

    return [
      {
        label: 'Площадка',
        value: this.locationDetailsLabel(),
      },
      {
        label: 'Расписание',
        value: this.scheduleLabel(),
      },
      {
        label: 'Командный размер',
        value: event.hackathon ? this.teamSizeLabel() : 'Свободный формат',
      },
      {
        label: 'Обновлено',
        value: formatEventDateTimeLabel(event.updatedAt),
      },
    ];
  });
  protected readonly mandatoryPositions = computed(
    () => this.event()?.hackathon?.mandatoryPositions ?? [],
  );
  protected readonly openRoles = computed<readonly EventOpenRole[]>(() =>
    this.store
      .teams()
      .flatMap((team) =>
        team.positions
          .filter((position) => !position.user && !position.filledByExternal)
          .map((position) => ({
            id: position.id,
            skillsLabel: position.requiredSkills.map((skill) => skill.name).join(', '),
            teamName: team.name,
            title: position.title,
          })),
      )
      .slice(0, 6),
  );
  protected readonly registrationLink = computed(
    () => this.event()?.registrationLink ?? null,
  );

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('eventId')),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((eventId) => this.store.load(eventId));
  }

  protected goBack(): void {
    this.location.back();
  }

  protected scrollToTeams(): void {
    this.viewportScroller.scrollToAnchor('event-teams');
  }

  protected toggleSubscription(): void {
    this.store.toggleSubscription();
  }

  protected openApplicationDialog(teamId: string): void {
    const team = this.store.teams().find((item) => item.id === teamId);
    const position = team ? this.store.getPrimaryOpenPosition(team) : null;

    if (!position) {
      this.store.actionError.set('В этой команде сейчас нет доступных ролей');

      return;
    }

    if (this.store.hasRequestedPosition(position.id)) {
      this.store.actionSuccess.set('Запрос на эту роль уже отправлен');

      return;
    }

    this.store.actionError.set(null);
    this.store.actionSuccess.set(null);
    this.teamRequestDialogTeamId.set(teamId);
  }

  protected closeApplicationDialog(): void {
    this.teamRequestDialogTeamId.set(null);
  }

  protected handleApplicationCreated(request: TeamRequestDto): void {
    this.store.registerTeamApplication(request);
    this.closeApplicationDialog();
  }

  protected getPrimaryOpenPosition(team: TeamInEventDto): TeamPositionDto | null {
    return this.store.getPrimaryOpenPosition(team);
  }

  protected hasRequestedPosition(positionId: string | null): boolean {
    return this.store.hasRequestedPosition(positionId);
  }

  protected getStageScheduleLabel(stage: EventStageDto): string {
    return getEventStageScheduleLabel(stage);
  }

  protected handleTeamCreated(): void {
    const eventId = this.event()?.id;

    this.teamCreationOpen.set(false);

    if (eventId) {
      this.store.load(eventId);
    }
  }
}
