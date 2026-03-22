import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import {
  injectStudhackApiClient,
  type BootstrapDto,
  type EventFullDto,
  type TeamFullDto,
  type UpsertEventRequest,
  type UpsertTeamRequest,
} from '@core/api';

export interface TeamCreationData {
  readonly bootstrap: BootstrapDto;
  readonly events: readonly EventFullDto[];
}

@Injectable({
  providedIn: 'root',
})
export class TeamCreationService {
  private readonly api = injectStudhackApiClient();

  getData(): Observable<TeamCreationData> {
    return forkJoin({
      bootstrap: this.api.getBootstrap(),
      events: this.api.getEvents(),
    });
  }

  createTeam(payload: UpsertTeamRequest): Observable<TeamFullDto> {
    return this.api.upsertTeam(payload);
  }

  createEvent(payload: UpsertEventRequest): Observable<EventFullDto> {
    return this.api.upsertEvent(payload);
  }
}
