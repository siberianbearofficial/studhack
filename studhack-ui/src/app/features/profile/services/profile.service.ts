import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  type EventFullDto,
  injectStudhackApiClient,
  type BootstrapDto,
  type MyProfileDto,
  type TeamRequestsFeedDto,
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

  getEvents(): Observable<readonly EventFullDto[]> {
    return this.api.getEvents();
  }

  getUsers(): Observable<readonly UserFullDto[]> {
    return this.api.getUsers();
  }

  getUser(userId: string): Observable<UserFullDto> {
    return this.api.getUser(userId);
  }

  getTeamRequests(): Observable<TeamRequestsFeedDto> {
    return this.api.getTeamRequests();
  }

  saveProfile(payload: UpsertMyProfileRequest): Observable<MyProfileDto> {
    return this.api.upsertMe(payload);
  }
}
