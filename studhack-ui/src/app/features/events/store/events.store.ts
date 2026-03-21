import { computed, inject, Injectable, signal } from '@angular/core';

import { type EventFullDto } from '@core/api';
import { getErrorMessage } from '@shared';

import { EventsService } from '../services/events.service';

@Injectable()
export class EventsStore {
  private readonly service = inject(EventsService);

  readonly events = signal<readonly EventFullDto[]>([]);
  readonly query = signal('');
  readonly hackathonsOnly = signal(false);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filteredEvents = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();

    return this.events().filter((event) => {
      const matchesType = this.hackathonsOnly()
        ? event.type === 'hackathon'
        : true;
      const haystack = [
        event.name,
        event.description ?? '',
        event.location.city?.name ?? '',
        event.location.format,
      ]
        .join(' ')
        .toLowerCase();
      const matchesQuery = normalizedQuery ? haystack.includes(normalizedQuery) : true;

      return matchesType && matchesQuery;
    });
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.getEvents().subscribe({
      next: (events) => {
        this.events.set(events);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(getErrorMessage(error, 'Не удалось загрузить события'));
        this.isLoading.set(false);
      },
    });
  }

  setQuery(query: string): void {
    this.query.set(query);
  }

  setHackathonsOnly(hackathonsOnly: boolean): void {
    this.hackathonsOnly.set(hackathonsOnly);
  }
}
