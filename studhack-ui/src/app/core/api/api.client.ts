import { inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  type BootstrapDto,
  type CreateTeamRequestInput,
  type DeleteResultDto,
  type EventFullDto,
  type EventSubscriptionDto,
  type MyProfileDto,
  type ResolveTeamRequestInput,
  type SetEventSubscriptionRequest,
  type TeamFullDto,
  type TeamRequestDto,
  type TeamRequestsFeedDto,
  type UpsertEventRequest,
  type UpsertMyProfileRequest,
  type UpsertTeamRequest,
  type UserFullDto,
  type UUID,
} from './api.models';

export interface StudhackApiClient {
  getBootstrap(): Observable<BootstrapDto>;
  getEvents(): Observable<readonly EventFullDto[]>;
  getEvent(eventId: UUID): Observable<EventFullDto>;
  upsertEvent(payload: UpsertEventRequest): Observable<EventFullDto>;
  setEventSubscription(
    eventId: UUID,
    payload: SetEventSubscriptionRequest,
  ): Observable<EventSubscriptionDto>;
  getTeams(): Observable<readonly TeamFullDto[]>;
  getTeam(teamId: UUID): Observable<TeamFullDto>;
  upsertTeam(payload: UpsertTeamRequest): Observable<TeamFullDto>;
  deleteTeam(teamId: UUID): Observable<DeleteResultDto>;
  getUsers(): Observable<readonly UserFullDto[]>;
  getUser(userId: UUID): Observable<UserFullDto>;
  getMe(): Observable<MyProfileDto>;
  upsertMe(payload: UpsertMyProfileRequest): Observable<MyProfileDto>;
  getTeamRequests(): Observable<TeamRequestsFeedDto>;
  createTeamRequest(payload: CreateTeamRequestInput): Observable<TeamRequestDto>;
  resolveTeamRequest(
    requestId: UUID,
    payload: ResolveTeamRequestInput,
  ): Observable<TeamRequestDto>;
}

export const STUDHACK_API_CLIENT = new InjectionToken<StudhackApiClient>(
  'STUDHACK_API_CLIENT',
);

export const injectStudhackApiClient = (): StudhackApiClient =>
  inject(STUDHACK_API_CLIENT);
