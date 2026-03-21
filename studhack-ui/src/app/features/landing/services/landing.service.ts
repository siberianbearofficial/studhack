import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import {
  injectStudhackApiClient,
  type BootstrapDto,
  type EventFullDto,
} from '@core/api';

export interface LandingOverview {
  readonly me: BootstrapDto['me'];
  readonly usersCount: number;
  readonly eventsCount: number;
  readonly teamsCount: number;
  readonly openPositionsCount: number;
  readonly nextEvent: EventFullDto | null;
  readonly topSpecializations: readonly string[];
}

@Injectable({
  providedIn: 'root',
})
export class LandingService {
  private readonly api = injectStudhackApiClient();

  getOverview(): Observable<LandingOverview> {
    return forkJoin({
      bootstrap: this.api.getBootstrap(),
      users: this.api.getUsers(),
      events: this.api.getEvents(),
      teams: this.api.getTeams(),
    }).pipe(
      map(({ bootstrap, users, events, teams }) => {
        const nextEvent =
          events.find((event) => new Date(event.endsAt).getTime() >= Date.now()) ??
          events[0] ??
          null;

        return {
          me: bootstrap.me,
          usersCount: users.length,
          eventsCount: events.length,
          teamsCount: teams.length,
          openPositionsCount: teams.reduce(
            (total, team) => total + team.openPositionsCount,
            0,
          ),
          nextEvent,
          topSpecializations: bootstrap.dictionaries.specializations
            .slice(0, 4)
            .map((specialization) => specialization.name),
        };
      }),
    );
  }
}
