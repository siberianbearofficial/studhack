import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  injectStudhackApiClient,
  type EventFullDto,
  type TeamFullDto,
  type UpsertEventRequest,
  type UpsertTeamRequest,
} from '@core/api';

@Injectable({
  providedIn: 'root',
})
export class TeamCreationService {
  private readonly api = injectStudhackApiClient();

  createTeam(payload: UpsertTeamRequest): Observable<TeamFullDto> {
    return this.api.upsertTeam(payload);
  }

  createEvent(payload: UpsertEventRequest): Observable<EventFullDto> {
    return this.api.upsertEvent(payload);
  }
}
