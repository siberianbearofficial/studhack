import { Injectable, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import {
  injectStudhackApiClient,
  type EventFullDto,
  type TeamFullDto,
  type UserFullDto,
} from '@core/api';
import { getErrorMessage } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class PublicDataStore {
  private readonly api = injectStudhackApiClient();

  readonly events = signal<readonly EventFullDto[]>([]);
  readonly teams = signal<readonly TeamFullDto[]>([]);
  readonly users = signal<readonly UserFullDto[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      events: this.api.getEvents(),
      teams: this.api.getTeams(),
      users: this.api.getUsers(),
    }).subscribe({
      next: ({ events, teams, users }) => {
        this.events.set(events);
        this.teams.set(teams);
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(
          getErrorMessage(error, 'Не удалось загрузить публичные данные'),
        );
        this.isLoading.set(false);
      },
    });
  }

  upsertEvent(event: EventFullDto): void {
    this.events.update((events) =>
      this.upsertById(events, event).sort((left, right) =>
        left.startsAt.localeCompare(right.startsAt),
      ),
    );
  }

  upsertTeam(team: TeamFullDto): void {
    this.teams.update((teams) =>
      this.upsertById(teams, team).sort((left, right) =>
        left.createdAt.localeCompare(right.createdAt),
      ),
    );
  }

  upsertUser(user: UserFullDto): void {
    this.users.update((users) =>
      this.upsertById(users, user).sort((left, right) =>
        left.displayName.localeCompare(right.displayName, 'ru'),
      ),
    );
  }

  private upsertById<T extends { readonly id: string }>(
    items: readonly T[],
    nextItem: T,
  ): T[] {
    const hasItem = items.some((item) => item.id === nextItem.id);

    return hasItem
      ? items.map((item) => (item.id === nextItem.id ? nextItem : item))
      : [...items, nextItem];
  }
}
