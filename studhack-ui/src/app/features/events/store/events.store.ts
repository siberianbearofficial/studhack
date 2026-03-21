import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk/date-time';
import Fuse, { type IFuseOptions } from 'fuse.js';

import { type EventFullDto } from '@core/api';
import {
  EVENT_TEAM_SIZE_MAX,
  EVENT_TEAM_SIZE_MIN,
  getErrorMessage,
  getEventTeamSizeBounds,
  hasInPersonParticipation,
  isMultiDayEvent,
} from '@shared';

import { EventsService } from '../services/events.service';

const PAGE_SIZE = 4;
const SEARCH_OPTIONS = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'description', weight: 0.3 },
  ],
  threshold: 0.32,
  ignoreLocation: true,
  minMatchCharLength: 1,
} satisfies IFuseOptions<EventFullDto>;

@Injectable()
export class EventsStore {
  private readonly service = inject(EventsService);

  readonly events = signal<readonly EventFullDto[]>([]);
  readonly query = signal('');
  readonly dateRange = signal<TuiDayRange | null>(null);
  readonly teamSizeRange = signal<readonly [number, number]>([
    EVENT_TEAM_SIZE_MIN,
    EVENT_TEAM_SIZE_MAX,
  ]);
  readonly recommendedOnly = signal(false);
  readonly inPersonOnly = signal(false);
  readonly multiDayOnly = signal(false);
  readonly subscribedEventIds = signal<readonly string[]>([]);
  readonly currentPage = signal(0);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly recommendedEventIds = computed(() =>
    [...this.events()]
      .sort(
        (left, right) =>
          right.subscription.subscribersCount -
            left.subscription.subscribersCount ||
          new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
      )
      .slice(0, 2)
      .map((event) => event.id),
  );
  readonly recommendedEventsCount = computed(
    () => this.recommendedEventIds().length,
  );
  readonly inPersonEventsCount = computed(
    () => this.events().filter((event) => hasInPersonParticipation(event)).length,
  );
  readonly multiDayEventsCount = computed(
    () => this.events().filter((event) => isMultiDayEvent(event)).length,
  );
  private readonly searchIndex = computed(
    () => new Fuse([...this.events()], SEARCH_OPTIONS),
  );
  private readonly searchedEvents = computed(() => {
    const normalizedQuery = this.query().trim();

    if (!normalizedQuery) {
      return this.events();
    }

    return this.searchIndex()
      .search(normalizedQuery)
      .map(({ item }) => item);
  });
  readonly filteredEvents = computed(() => {
    const selectedDateRange = this.dateRange();
    const [selectedMinTeamSize, selectedMaxTeamSize] = this.teamSizeRange();

    return this.searchedEvents().filter((event) => {
      const [eventMinTeamSize, eventMaxTeamSize] = getEventTeamSizeBounds(event);
      const matchesDate =
        !selectedDateRange || this.eventMatchesDateRange(event, selectedDateRange);
      const matchesTeamSize =
        eventMaxTeamSize >= selectedMinTeamSize &&
        eventMinTeamSize <= selectedMaxTeamSize;
      const matchesRecommended =
        !this.recommendedOnly() || this.isRecommended(event.id);
      const matchesInPerson =
        !this.inPersonOnly() || hasInPersonParticipation(event);
      const matchesMultiDay =
        !this.multiDayOnly() || isMultiDayEvent(event);

      return (
        matchesDate &&
        matchesTeamSize &&
        matchesRecommended &&
        matchesInPerson &&
        matchesMultiDay
      );
    });
  });
  readonly pagedEvents = computed(() => {
    const start = this.currentPage() * PAGE_SIZE;

    return this.filteredEvents().slice(start, start + PAGE_SIZE);
  });
  readonly pageCount = computed(() =>
    Math.ceil(this.filteredEvents().length / PAGE_SIZE),
  );
  readonly activeFiltersCount = computed(() => {
    let count = this.query().trim() ? 1 : 0;

    if (this.dateRange()) {
      count += 1;
    }

    if (!this.isDefaultTeamSizeRange(this.teamSizeRange())) {
      count += 1;
    }

    if (this.recommendedOnly()) {
      count += 1;
    }

    if (this.inPersonOnly()) {
      count += 1;
    }

    if (this.multiDayOnly()) {
      count += 1;
    }

    return count;
  });

  constructor() {
    this.load();

    effect(() => {
      this.query();
      this.dateRange();
      this.teamSizeRange();
      this.recommendedOnly();
      this.inPersonOnly();
      this.multiDayOnly();
      this.currentPage.set(0);
    });

    effect(() => {
      const pageCount = this.pageCount();

      if (!pageCount && this.currentPage() !== 0) {
        this.currentPage.set(0);
      }

      if (pageCount && this.currentPage() > pageCount - 1) {
        this.currentPage.set(pageCount - 1);
      }
    });
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.getEvents().subscribe({
      next: (events) => {
        this.events.set(events);
        this.subscribedEventIds.set(
          events
            .filter((event) => event.subscription.isSubscribed)
            .map((event) => event.id),
        );
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

  setDateRange(dateRange: TuiDayRange | null): void {
    this.dateRange.set(dateRange);
  }

  setTeamSizeRange(range: readonly [number, number]): void {
    this.teamSizeRange.set(this.normalizeTeamSizeRange(range));
  }

  setRecommendedOnly(recommendedOnly: boolean): void {
    this.recommendedOnly.set(recommendedOnly);
  }

  setInPersonOnly(inPersonOnly: boolean): void {
    this.inPersonOnly.set(inPersonOnly);
  }

  setMultiDayOnly(multiDayOnly: boolean): void {
    this.multiDayOnly.set(multiDayOnly);
  }

  toggleSubscription(eventId: string): void {
    this.subscribedEventIds.update((eventIds) =>
      eventIds.includes(eventId)
        ? eventIds.filter((id) => id !== eventId)
        : [...eventIds, eventId],
    );
  }

  isSubscribed(eventId: string): boolean {
    return this.subscribedEventIds().includes(eventId);
  }

  isRecommended(eventId: string): boolean {
    return this.recommendedEventIds().includes(eventId);
  }

  setCurrentPage(index: number): void {
    this.currentPage.set(index);
  }

  clearFilters(): void {
    this.query.set('');
    this.dateRange.set(null);
    this.teamSizeRange.set([EVENT_TEAM_SIZE_MIN, EVENT_TEAM_SIZE_MAX]);
    this.recommendedOnly.set(false);
    this.inPersonOnly.set(false);
    this.multiDayOnly.set(false);
    this.currentPage.set(0);
  }

  private eventMatchesDateRange(
    event: EventFullDto,
    dateRange: TuiDayRange,
  ): boolean {
    const startsAt = TuiDay.fromLocalNativeDate(new Date(event.startsAt));
    const endsAt = TuiDay.fromLocalNativeDate(new Date(event.endsAt));

    return !endsAt.dayBefore(dateRange.from) && !startsAt.dayAfter(dateRange.to);
  }

  private normalizeTeamSizeRange(
    range: readonly [number, number],
  ): readonly [number, number] {
    const min = Math.max(
      EVENT_TEAM_SIZE_MIN,
      Math.min(range[0], range[1], EVENT_TEAM_SIZE_MAX),
    );
    const max = Math.min(
      EVENT_TEAM_SIZE_MAX,
      Math.max(range[0], range[1], EVENT_TEAM_SIZE_MIN),
    );

    return [min, max];
  }

  private isDefaultTeamSizeRange(
    [min, max]: readonly [number, number],
  ): boolean {
    return min === EVENT_TEAM_SIZE_MIN && max === EVENT_TEAM_SIZE_MAX;
  }
}
