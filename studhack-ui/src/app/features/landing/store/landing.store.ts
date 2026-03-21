import { computed, inject, Injectable, signal } from '@angular/core';

import { getErrorMessage } from '@shared';

import {
  LandingService,
  type LandingOverview,
} from '../services/landing.service';

@Injectable()
export class LandingStore {
  private readonly service = inject(LandingService);

  readonly overview = signal<LandingOverview | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly hasOverview = computed(() => this.overview() !== null);

  constructor() {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.getOverview().subscribe({
      next: (overview) => {
        this.overview.set(overview);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(getErrorMessage(error, 'Не удалось загрузить лендинг'));
        this.isLoading.set(false);
      },
    });
  }
}
