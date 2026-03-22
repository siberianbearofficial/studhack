import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

import {
  injectStudhackApiClient,
  type MyProfileDto,
  type UpsertMyProfileRequest,
} from '@core/api';
import { AuthService } from '@core/auth';
import { getErrorMessage } from '@shared';

import { PublicDataStore } from './public-data.store';

@Injectable({
  providedIn: 'root',
})
export class MyProfileStore {
  private readonly api = injectStudhackApiClient();
  private readonly auth = inject(AuthService);
  private readonly publicDataStore = inject(PublicDataStore);

  readonly me = signal<MyProfileDto | null>(null);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly hasProfile = computed(() => this.me() !== null);

  constructor() {
    effect(() => {
      if (!this.auth.isAuthenticated()) {
        this.clear();

        return;
      }

      this.load();
    });
  }

  load(): void {
    if (!this.auth.isAuthenticated()) {
      this.clear();

      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.api.getMe().pipe(catchError(() => of(null))).subscribe({
      next: (me) => {
        this.me.set(me);

        if (me) {
          this.publicDataStore.upsertUser(me);
        }

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

    this.api.upsertMe(payload).subscribe({
      next: (profile) => {
        this.me.set(profile);
        this.publicDataStore.upsertUser(profile);
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

  clear(): void {
    this.me.set(null);
    this.isLoading.set(false);
    this.isSaving.set(false);
    this.error.set(null);
    this.success.set(null);
  }
}
