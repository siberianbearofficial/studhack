import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import {
  API_CLIENT_MODE,
  HttpStudhackApiClient,
  MockStudhackApiClient,
} from '@core/api';
import { AuthService } from '@core/auth';

import {
  type CurrentUserApiAdapter,
  type CurrentUserDto,
  type SaveCurrentUserInput,
} from './current-user.models';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly apiMode = inject(API_CLIENT_MODE);
  private readonly auth = inject(AuthService);
  private readonly httpApi = inject(HttpStudhackApiClient);
  private readonly mockApi = inject(MockStudhackApiClient);

  private readonly currentUserState = signal<CurrentUserDto | null>(null);

  readonly currentUser = computed(() => this.currentUserState());
  readonly hasAccount = computed(() => Boolean(this.currentUserState()?.id));

  constructor() {
    effect(() => {
      if (!this.auth.isAuthenticated()) {
        this.clear();
      }
    });
  }

  load(options?: { readonly force?: boolean }): Observable<CurrentUserDto> {
    const cached = this.currentUserState();

    if (cached && !options?.force) {
      return of(cached);
    }

    return this.adapter.getCurrentUser().pipe(
      tap((user) => {
        this.currentUserState.set(user);
      }),
    );
  }

  save(payload: SaveCurrentUserInput): Observable<CurrentUserDto> {
    return this.adapter.saveCurrentUser(payload).pipe(
      tap((user) => {
        this.currentUserState.set(user);
      }),
    );
  }

  clear(): void {
    this.currentUserState.set(null);
  }

  private get adapter(): CurrentUserApiAdapter {
    return this.apiMode === 'mock' ? this.mockApi : this.httpApi;
  }
}
