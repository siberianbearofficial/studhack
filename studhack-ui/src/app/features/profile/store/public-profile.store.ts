import { inject, Injectable, signal } from '@angular/core';

import { type UserFullDto } from '@core/api';
import { getErrorMessage } from '@shared';

import { ProfileService } from '../services/profile.service';

@Injectable()
export class PublicProfileStore {
  private readonly service = inject(ProfileService);

  readonly user = signal<UserFullDto | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  load(userId: string | null): void {
    if (!userId) {
      this.user.set(null);
      this.error.set('Профиль пользователя не найден');
      this.isLoading.set(false);

      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.service.getUser(userId).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(getErrorMessage(error, 'Не удалось загрузить профиль'));
        this.isLoading.set(false);
      },
    });
  }
}
