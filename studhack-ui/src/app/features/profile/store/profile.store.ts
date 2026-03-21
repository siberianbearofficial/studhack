import { computed, inject, Injectable, signal } from '@angular/core';

import {
  type BootstrapDto,
  type MyProfileDto,
  type UpsertMyProfileRequest,
} from '@core/api';
import { getErrorMessage } from '@shared';

import { ProfileService } from '../services/profile.service';

@Injectable()
export class ProfileStore {
  private readonly service = inject(ProfileService);

  readonly bootstrap = signal<BootstrapDto | null>(null);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly me = computed(() => this.bootstrap()?.me ?? null);
  readonly cities = computed(
    () => this.bootstrap()?.dictionaries.cities ?? [],
  );
  readonly specializations = computed(
    () => this.bootstrap()?.dictionaries.specializations ?? [],
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.getBootstrap().subscribe({
      next: (bootstrap) => {
        this.bootstrap.set(bootstrap);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(getErrorMessage(error, 'Не удалось загрузить профиль'));
        this.isLoading.set(false);
      },
    });
  }

  save(
    payload: UpsertMyProfileRequest,
    onSuccess?: (profile: MyProfileDto) => void,
  ): void {
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
