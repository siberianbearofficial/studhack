import { computed, inject, Injectable, signal } from '@angular/core';
import { map, switchMap } from 'rxjs';

import {
  DictionariesStore,
  MyProfileStore,
  PublicDataStore,
} from '@core/data';
import {
  type EventFullDto,
  type TeamFullDto,
  type UpsertEventRequest,
  type UpsertTeamRequest,
} from '@core/api';
import { getErrorMessage } from '@shared';

import { TeamCreationService } from '../services/team-creation.service';

export interface TeamCreationSaveResult {
  readonly team: TeamFullDto;
  readonly event: EventFullDto | null;
}

@Injectable()
export class TeamCreationStore {
  private readonly service = inject(TeamCreationService);
  private readonly dictionariesStore = inject(DictionariesStore);
  private readonly myProfileStore = inject(MyProfileStore);
  private readonly publicDataStore = inject(PublicDataStore);
  private readonly localError = signal<string | null>(null);

  readonly createdTeam = signal<TeamFullDto | null>(null);
  readonly isLoading = computed(
    () =>
      this.publicDataStore.isLoading() || this.dictionariesStore.isLoading(),
  );
  readonly isSaving = signal(false);
  readonly error = computed(
    () =>
      this.localError() ??
      this.publicDataStore.error() ??
      this.dictionariesStore.error(),
  );
  readonly success = signal<string | null>(null);
  readonly events = computed(() => this.publicDataStore.events());
  readonly me = computed(() => this.myProfileStore.me());
  readonly specializations = computed(
    () => this.dictionariesStore.data()?.specializations ?? [],
  );
  readonly skills = computed(() => this.dictionariesStore.data()?.skills ?? []);

  load(): void {
    this.localError.set(null);
    this.dictionariesStore.load();
    this.publicDataStore.load();
  }

  save(
    payload: UpsertTeamRequest,
    options?: {
      readonly customEvent?: UpsertEventRequest;
      readonly onSuccess?: (result: TeamCreationSaveResult) => void;
    },
  ): void {
    this.isSaving.set(true);
    this.localError.set(null);
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
        this.publicDataStore.load();
        this.myProfileStore.load();
        this.isSaving.set(false);
        options?.onSuccess?.(result);
      },
      error: (error: unknown) => {
        this.localError.set(
          getErrorMessage(error, 'Не удалось сохранить команду'),
        );
        this.isSaving.set(false);
      },
    });
  }
}
