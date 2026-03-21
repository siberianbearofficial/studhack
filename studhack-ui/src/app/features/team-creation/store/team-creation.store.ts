import { computed, inject, Injectable, signal } from '@angular/core';

import { type TeamFullDto, type UpsertTeamRequest } from '@core/api';
import { getErrorMessage } from '@shared';

import { TeamCreationService, type TeamCreationData } from '../services/team-creation.service';

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
    onSuccess?: (team: TeamFullDto) => void,
  ): void {
    this.isSaving.set(true);
    this.error.set(null);
    this.success.set(null);

    this.service.createTeam(payload).subscribe({
      next: (team) => {
        this.createdTeam.set(team);
        this.success.set(`Команда «${team.name}» сохранена`);
        this.isSaving.set(false);
        onSuccess?.(team);
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
