import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import {
  type BootstrapDto,
  type EventFullDto,
  type MyProfileDto,
  type TeamRequestsFeedDto,
  type UpsertMyProfileRequest,
  type UserFullDto,
} from '@core/api';
import { getErrorMessage } from '@shared';

import { ProfileService } from '../services/profile.service';

@Injectable()
export class ProfileStore {
  private readonly service = inject(ProfileService);

  readonly bootstrap = signal<BootstrapDto | null>(null);
  readonly events = signal<readonly EventFullDto[]>([]);
  readonly users = signal<readonly UserFullDto[]>([]);
  readonly teamRequests = signal<TeamRequestsFeedDto | null>(null);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly me = computed(() => this.bootstrap()?.me ?? null);
  readonly cities = computed(() => this.bootstrap()?.dictionaries.cities ?? []);
  readonly skills = computed(() => this.bootstrap()?.dictionaries.skills ?? []);
  readonly specializations = computed(() => this.bootstrap()?.dictionaries.specializations ?? []);

  constructor() {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      bootstrap: this.service.getBootstrap(),
      events: this.service.getEvents(),
      users: this.service.getUsers(),
      teamRequests: this.service.getTeamRequests(),
    }).subscribe({
      next: ({ bootstrap, events, users, teamRequests }) => {
        this.bootstrap.set(bootstrap);
        this.events.set(events);
        this.users.set(users);
        this.teamRequests.set(teamRequests);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(getErrorMessage(error, 'Не удалось загрузить профиль'));
        this.isLoading.set(false);
      },
    });
  }

  save(payload: UpsertMyProfileRequest, onSuccess?: (profile: MyProfileDto) => void): void {
    this.isSaving.set(true);
    this.error.set(null);
    this.success.set(null);

    this.service.saveProfile(payload).subscribe({
      next: (profile) => {
        this.bootstrap.update((bootstrap) =>
          bootstrap
            ? {
                ...bootstrap,
                me: profile,
              }
            : null,
        );
        this.users.update((users) =>
          users.map((user) => (user.id === profile.id ? profile : user)),
        );
        this.success.set('Профиль сохранен');
        this.isSaving.set(false);
        onSuccess?.(profile);
      },
      error: (error: unknown) => {
        this.error.set(getErrorMessage(error, 'Не удалось сохранить профиль'));
        this.isSaving.set(false);
      },
    });
  }
}
