import { computed, inject, Injectable, signal } from '@angular/core';
import { map, switchMap } from 'rxjs';

import {
  type EventFullDto,
  type TeamFullDto,
  type UpsertEventRequest,
  type UpsertTeamRequest,
} from '@core/api';
import { getErrorMessage } from '@shared';

import { TeamCreationService, type TeamCreationData } from '../services/team-creation.service';

export interface TeamCreationSaveResult {
  readonly team: TeamFullDto;
  readonly event: EventFullDto | null;
}

@Injectable()
export class TeamCreationStore {
  private readonly service = inject(TeamCreationService);

  readonly data = signal<TeamCreationData | null>(null);
  readonly createdTeam = signal<TeamFullDto | null>(null);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly events = computed(() => this.data()?.events ?? []);
  readonly me = computed(() => this.data()?.bootstrap.me ?? null);
  readonly specializations = computed(
    () => this.data()?.bootstrap.dictionaries.specializations ?? [],
  );
  readonly skills = computed(() => this.data()?.bootstrap.dictionaries.skills ?? []);

  constructor() {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.getData().subscribe({
      next: (data) => {
        this.data.set(data);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(
          getErrorMessage(error, 'Не удалось загрузить данные для создания команды'),
        );
        this.isLoading.set(false);
      },
    });
  }

  save(
    payload: UpsertTeamRequest,
    options?: {
      readonly customEvent?: UpsertEventRequest;
      readonly onSuccess?: (result: TeamCreationSaveResult) => void;
    },
  ): void {
    this.isSaving.set(true);
    this.error.set(null);
    this.success.set(null);

    const save$ = options?.customEvent
      ? this.service.createEvent(options.customEvent).pipe(
          switchMap((event) =>
            this.service.createTeam({ ...payload, eventId: event.id }).pipe(
              map((team) => ({ team, event })),
            ),
          ),
        )
      : this.service.createTeam(payload).pipe(
          map((team) => ({
            team,
            event: this.events().find((event) => event.id === team.event.id) ?? null,
          })),
        );

    save$.subscribe({
      next: (result) => {
        this.createdTeam.set(result.team);
        this.success.set(`Команда «${result.team.name}» сохранена`);
        this.data.update((data) => {
          if (!data || !result.event) {
            return data;
          }

          const hasEvent = data.events.some((event) => event.id === result.event!.id);

          if (hasEvent) {
            return data;
          }

          return {
            ...data,
            events: [...data.events, result.event].sort((left, right) =>
              left.startsAt.localeCompare(right.startsAt),
            ),
          };
        });
        this.isSaving.set(false);
        options?.onSuccess?.(result);
      },
      error: (error: unknown) => {
        this.error.set(
          getErrorMessage(error, 'Не удалось сохранить команду'),
        );
        this.isSaving.set(false);
      },
    });
  }
}
