import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  injectStudhackApiClient,
  type BootstrapDto,
  type MyProfileDto,
  type UpsertMyProfileRequest,
  type UserFullDto,
} from '@core/api';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly api = injectStudhackApiClient();

  getBootstrap(): Observable<BootstrapDto> {
    return this.api.getBootstrap();
  }

  getUser(userId: string): Observable<UserFullDto> {
    return this.api.getUser(userId);
  }

  saveProfile(payload: UpsertMyProfileRequest): Observable<MyProfileDto> {
    return this.api.upsertMe(payload);
  }
}
