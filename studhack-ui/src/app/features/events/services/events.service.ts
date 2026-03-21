import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { injectStudhackApiClient, type EventFullDto } from '@core/api';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly api = injectStudhackApiClient();

  getEvents(): Observable<readonly EventFullDto[]> {
    return this.api.getEvents();
  }
}
