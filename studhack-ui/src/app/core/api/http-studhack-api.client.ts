import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { withAuth } from '@core/interceptors';

import { API_BASE_URL } from './api.config';
import { type StudhackApiClient } from './api.client';
import {
  type ApiResponse,
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

@Injectable()
export class HttpStudhackApiClient implements StudhackApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getBootstrap(): Observable<BootstrapDto> {
    return this.get('/api/v1/bootstrap');
  }

  getEvents(): Observable<readonly EventFullDto[]> {
    return this.get('/api/v1/events');
  }

  getEvent(eventId: UUID): Observable<EventFullDto> {
    return this.get(`/api/v1/events/${eventId}`);
  }

  upsertEvent(payload: UpsertEventRequest): Observable<EventFullDto> {
    return this.post('/api/v1/events/upsert', payload, true);
  }

  setEventSubscription(
    eventId: UUID,
    payload: SetEventSubscriptionRequest,
  ): Observable<EventSubscriptionDto> {
    return this.post(`/api/v1/events/${eventId}/subscription`, payload, true);
  }

  getTeams(): Observable<readonly TeamFullDto[]> {
    return this.get('/api/v1/teams');
  }

  getTeam(teamId: UUID): Observable<TeamFullDto> {
    return this.get(`/api/v1/teams/${teamId}`);
  }

  upsertTeam(payload: UpsertTeamRequest): Observable<TeamFullDto> {
    return this.post('/api/v1/teams/upsert', payload, true);
  }

  deleteTeam(teamId: UUID): Observable<DeleteResultDto> {
    return this.delete(`/api/v1/teams/${teamId}`, true);
  }

  getUsers(): Observable<readonly UserFullDto[]> {
    return this.get('/api/v1/users');
  }

  getUser(userId: UUID): Observable<UserFullDto> {
    return this.get(`/api/v1/users/${userId}`);
  }

  getMe(): Observable<MyProfileDto> {
    return this.get('/api/v1/me', true);
  }

  upsertMe(payload: UpsertMyProfileRequest): Observable<MyProfileDto> {
    return this.put('/api/v1/me', payload, true);
  }

  getTeamRequests(): Observable<TeamRequestsFeedDto> {
    return this.get('/api/v1/team-requests', true);
  }

  createTeamRequest(payload: CreateTeamRequestInput): Observable<TeamRequestDto> {
    return this.post('/api/v1/team-requests', payload, true);
  }

  resolveTeamRequest(
    requestId: UUID,
    payload: ResolveTeamRequestInput,
  ): Observable<TeamRequestDto> {
    return this.post(
      `/api/v1/team-requests/${requestId}/resolve`,
      payload,
      true,
    );
  }

  private get<T>(path: string, authRequired = false): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(this.resolvePath(path), this.getRequestOptions(authRequired))
      .pipe(map(({ data }) => data));
  }

  private post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    authRequired = false,
  ): Observable<TResponse> {
    return this.http
      .post<ApiResponse<TResponse>>(
        this.resolvePath(path),
        payload,
        this.getRequestOptions(authRequired),
      )
      .pipe(map(({ data }) => data));
  }

  private put<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    authRequired = false,
  ): Observable<TResponse> {
    return this.http
      .put<ApiResponse<TResponse>>(
        this.resolvePath(path),
        payload,
        this.getRequestOptions(authRequired),
      )
      .pipe(map(({ data }) => data));
  }

  private delete<T>(path: string, authRequired = false): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(
        this.resolvePath(path),
        this.getRequestOptions(authRequired),
      )
      .pipe(map(({ data }) => data));
  }

  private resolvePath(path: string): string {
    return new URL(path.replace(/^\//, ''), this.ensureTrailingSlash(this.baseUrl)).toString();
  }

  private ensureTrailingSlash(value: string): string {
    return value.endsWith('/') ? value : `${value}/`;
  }

  private getRequestOptions(authRequired: boolean) {
    return authRequired ? { context: withAuth() } : {};
  }
}
