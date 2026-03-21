import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  injectStudhackApiClient,
  type EventFullDto,
  type EventSubscriptionDto,
  type TeamRequestDto,
} from '@core/api';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly api = injectStudhackApiClient();

  getEvents(): Observable<readonly EventFullDto[]> {
    return this.api.getEvents();
  }

  getEvent(eventId: string): Observable<EventFullDto> {
    return this.api.getEvent(eventId);
  }

  setSubscription(
    eventId: string,
    isSubscribed: boolean,
  ): Observable<EventSubscriptionDto> {
    return this.api.setEventSubscription(eventId, { subscribed: isSubscribed });
  }

  createTeamApplication(teamPositionId: string): Observable<TeamRequestDto> {
    return this.api.createTeamRequest({
      teamPositionId,
      type: 'application',
    });
  }
}
