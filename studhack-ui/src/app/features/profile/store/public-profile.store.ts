import { computed, Injectable, signal, inject } from '@angular/core';

import { PublicDataStore } from '@core/data';

@Injectable()
export class PublicProfileStore {
  private readonly publicDataStore = inject(PublicDataStore);
  private readonly userId = signal<string | null>(null);

  readonly user = computed(() =>
    this.publicDataStore
      .users()
      .find((user) => user.id === this.userId()) ?? null,
  );
  readonly isLoading = computed(() => this.publicDataStore.isLoading());
  readonly error = computed(() => {
    const userId = this.userId();

    if (!userId) {
      return 'Профиль пользователя не найден';
    }

    return (
      this.publicDataStore.error() ??
      (!this.publicDataStore.isLoading() && !this.user()
        ? 'Профиль пользователя не найден'
        : null)
    );
  });

  load(userId: string | null): void {
    this.userId.set(userId?.trim() || null);
  }
}
