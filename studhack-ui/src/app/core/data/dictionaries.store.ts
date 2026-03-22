import { Injectable, inject, signal } from '@angular/core';

import { type DictionariesDto, injectStudhackApiClient } from '@core/api';
import { getErrorMessage } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class DictionariesStore {
  private readonly api = injectStudhackApiClient();

  readonly data = signal<DictionariesDto | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  load(options?: { readonly force?: boolean }): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.api.getDictionaries(options).subscribe({
      next: (dictionaries) => {
        this.data.set(dictionaries);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(
          getErrorMessage(error, 'Не удалось загрузить словари'),
        );
        this.isLoading.set(false);
      },
    });
  }
}
