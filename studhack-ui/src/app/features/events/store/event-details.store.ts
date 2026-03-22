import { computed, inject, Injectable, signal } from '@angular/core';

import {
  type EventFullDto,
  type TeamInEventDto,
  type TeamPositionDto,
  type TeamRequestDto,
  type TeamRequestShortDto,
} from '@core/api';
import { getErrorMessage } from '@shared';

import { EventsService } from '../services/events.service';

@Injectable()
export class EventDetailsStore {
  private readonly service = inject(EventsService);

  readonly event = signal<EventFullDto | null>(null);
  readonly isLoading = signal(true);
  readonly isSubscriptionPending = signal(false);
  readonly error = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);
  readonly actionSuccess = signal<string | null>(null);
  readonly requestedPositionIds = signal<readonly string[]>([]);
  readonly teams = computed(() => this.event()?.teams ?? []);

  load(eventId: string | null): void {
    if (!eventId) {
      this.event.set(null);
      this.error.set('Мероприятие не найдено');
      this.isLoading.set(false);
      this.isSubscriptionPending.set(false);
      this.actionError.set(null);
      this.actionSuccess.set(null);
      this.requestedPositionIds.set([]);

      return;
    }

    this.isLoading.set(true);
    this.isSubscriptionPending.set(false);
    this.error.set(null);
    this.actionError.set(null);
    this.actionSuccess.set(null);
    this.requestedPositionIds.set([]);

    this.service.getEvent(eventId).subscribe({
      next: (event) => {
        this.event.set(event);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.event.set(null);
        this.isSubscriptionPending.set(false);
        this.error.set(
          getErrorMessage(error, 'Не удалось загрузить карточку мероприятия'),
        );
        this.isLoading.set(false);
      },
    });
  }

  toggleSubscription(): void {
    const event = this.event();

    if (!event || this.isSubscriptionPending()) {
      return;
    }

    this.isSubscriptionPending.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    this.service
      .setSubscription(event.id, !event.subscription.isSubscribed)
      .subscribe({
        next: (subscription) => {
          this.event.update((current) =>
            current && current.id === event.id
              ? {
                  ...current,
                  subscription,
                }
              : current,
          );
          this.actionSuccess.set(
            subscription.isSubscribed
              ? 'Подписка на мероприятие оформлена'
              : 'Подписка на мероприятие отключена',
          );
          this.isSubscriptionPending.set(false);
        },
        error: (error: unknown) => {
          this.actionError.set(
            getErrorMessage(error, 'Не удалось обновить подписку'),
          );
          this.isSubscriptionPending.set(false);
        },
      });
  }

  registerTeamApplication(request: TeamRequestDto): void {
    const event = this.event();

    if (!event) {
      return;
    }

    this.requestedPositionIds.update((ids) =>
      ids.includes(request.teamPosition.id)
        ? ids
        : [...ids, request.teamPosition.id],
    );
    this.event.update((current) =>
      current && current.id === event.id
        ? {
            ...current,
            teams: current.teams.map((team) =>
              team.id === request.team.id
                ? {
                    ...team,
                    positions: team.positions.map((position) =>
                      position.id === request.teamPosition.id
                        ? {
                            ...position,
                            requests: [
                              this.toShortRequest(request),
                              ...position.requests,
                            ],
                          }
                        : position,
                    ),
                  }
                : team,
            ),
          }
        : current,
    );
    this.actionError.set(null);
    this.actionSuccess.set(
      `Запрос отправлен в команду «${request.team.name}» на роль «${request.teamPosition.title}»`,
    );
  }

  getPrimaryOpenPosition(team: TeamInEventDto): TeamPositionDto | null {
    return (
      team.positions.find(
        (position) => !position.user && !position.filledByExternal,
      ) ?? null
    );
  }

  hasRequestedPosition(positionId: string | null): boolean {
    return positionId ? this.requestedPositionIds().includes(positionId) : false;
  }

  private toShortRequest(request: TeamRequestDto): TeamRequestShortDto {
    return {
      id: request.id,
      type: request.type,
      status: request.status,
      message: request.message ?? null,
      user: request.user,
      createdAt: request.createdAt,
      resolvedAt: request.resolvedAt ?? null,
    };
  }
}
