import { computed, inject, Injectable } from '@angular/core';

import {
  DictionariesStore,
  MyProfileStore,
  PublicDataStore,
} from '@core/data';
import { type EventFullDto, type MyProfileDto } from '@core/api';

export interface LandingOverview {
  readonly me: MyProfileDto | null;
  readonly usersCount: number;
  readonly eventsCount: number;
  readonly teamsCount: number;
  readonly openPositionsCount: number;
  readonly nextEvent: EventFullDto | null;
  readonly topSpecializations: readonly string[];
}

@Injectable()
export class LandingStore {
  private readonly dictionariesStore = inject(DictionariesStore);
  private readonly myProfileStore = inject(MyProfileStore);
  private readonly publicDataStore = inject(PublicDataStore);

  readonly overview = computed<LandingOverview | null>(() => {
    const dictionaries = this.dictionariesStore.data();

    if (!dictionaries) {
      return null;
    }

    const users = this.publicDataStore.users();
    const events = this.publicDataStore.events();
    const teams = this.publicDataStore.teams();
    const nextEvent =
      events.find((event) => new Date(event.endsAt).getTime() >= Date.now()) ??
      events[0] ??
      null;

    return {
      me: this.myProfileStore.me(),
      usersCount: users.length,
      eventsCount: events.length,
      teamsCount: teams.length,
      openPositionsCount: teams.reduce(
        (total, team) => total + team.openPositionsCount,
        0,
      ),
      nextEvent,
      topSpecializations: dictionaries.specializations
        .slice(0, 4)
        .map((specialization) => specialization.name),
    };
  });
  readonly isLoading = computed(
    () =>
      this.dictionariesStore.isLoading() ||
      this.publicDataStore.isLoading() ||
      this.myProfileStore.isLoading(),
  );
  readonly error = computed(
    () =>
      this.dictionariesStore.error() ??
      this.publicDataStore.error() ??
      this.myProfileStore.error(),
  );
  readonly hasOverview = computed(() => this.overview() !== null);

  load(): void {
    this.dictionariesStore.load();
    this.publicDataStore.load();
    this.myProfileStore.load();
  }
}
