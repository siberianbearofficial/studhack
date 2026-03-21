import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { injectStudhackApiClient, type UserFullDto } from '@core/api';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private readonly api = injectStudhackApiClient();

  getUsers(): Observable<readonly UserFullDto[]> {
    return this.api.getUsers();
  }
}
