import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

import { AuthService } from '@core/auth';
import {
  type CurrentUserApiAdapter,
  type CurrentUserDto,
  type SaveCurrentUserInput,
} from '@core/current-user/current-user.models';
import { withAuth } from '@core/interceptors';

import { API_BASE_URL } from './api.config';
import { type StudhackApiClient } from './api.client';
import {
  type ApiResponse,
  type CityDto,
  type CreateTeamRequestInput,
  type DictionariesDto,
  type EducationDegree,
  type DeleteResultDto,
  type EventFullDto,
  type EventSubscriptionDto,
  type MyProfileDto,
  type PortfolioLinkDto,
  type ResolveTeamRequestInput,
  type SetEventSubscriptionRequest,
  type SkillDto,
  type SpecializationDto,
  type TeamFullDto,
  type TeamRequestDto,
  type TeamRequestsFeedDto,
  type UpsertEventRequest,
  type UpsertMyProfileRequest,
  type UpsertTeamRequest,
  type UserEducationDto,
  type UserFullDto,
  type UserSkillDto,
  type UUID,
} from './api.models';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

type BackendEducationDegree = 0 | 1 | 2 | 3;

interface BackendEducationDto {
  readonly id: UUID;
  readonly universityId: UUID;
  readonly degree: BackendEducationDegree;
  readonly faculty?: string | null;
  readonly yearStart?: number | null;
  readonly yearEnd?: number | null;
}

interface BackendUserInfoDto {
  readonly id: UUID | null;
  readonly uniqueName?: string | null;
  readonly displayName?: string | null;
  readonly birthDate?: string | null;
  readonly available: boolean;
  readonly cityOfResidence?: CityDto | null;
  readonly avatarUrl?: string | null;
  readonly email?: string | null;
  readonly biography?: string | null;
  readonly skills: readonly SkillDto[];
  readonly specializations: readonly SpecializationDto[];
  readonly portfolioLinks: readonly PortfolioLinkDto[];
  readonly education: readonly BackendEducationDto[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

interface BackendUpdateUserInfoDto {
  readonly uniqueName: string;
  readonly displayName: string;
  readonly birthDate?: string | null;
  readonly available: boolean;
  readonly city: CityDto | null;
  readonly avatarUrl?: string | null;
  readonly email: string;
  readonly biography?: string | null;
  readonly skills: readonly SkillDto[];
  readonly specializations: readonly SpecializationDto[];
  readonly portfolioLinks: readonly PortfolioLinkDto[];
  readonly education: readonly BackendEducationDto[];
}

@Injectable()
export class HttpStudhackApiClient
  implements StudhackApiClient, CurrentUserApiAdapter
{
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly auth = inject(AuthService);
  private dictionaries$?: Observable<DictionariesDto>;

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
    return forkJoin({
      users: this.get<readonly BackendUserInfoDto[]>('/api/v1/users'),
      dictionaries: this.getDictionaries(),
    }).pipe(
      map(({ users, dictionaries }) =>
        users
          .filter((user): user is BackendUserInfoDto & { readonly id: UUID } => user.id !== null)
          .map((user) => this.toUserFull(user, dictionaries)),
      ),
    );
  }

  getUser(userId: UUID): Observable<UserFullDto> {
    return forkJoin({
      user: this.get<BackendUserInfoDto>(`/api/v1/users/${userId}`),
      dictionaries: this.getDictionaries(),
    }).pipe(
      map(({ user, dictionaries }) =>
        this.toUserFull(this.requireRegisteredUser(user), dictionaries),
      ),
    );
  }

  getMe(): Observable<MyProfileDto> {
    return this.getCurrentUser().pipe(
      map((user) => this.toMyProfile(this.requireRegisteredCurrentUser(user))),
    );
  }

  upsertMe(payload: UpsertMyProfileRequest): Observable<MyProfileDto> {
    return this.getCurrentUser().pipe(
      switchMap((currentUser) =>
        this.saveCurrentUser(this.toSaveCurrentUserInput(payload, currentUser)),
      ),
      map((user) => this.toMyProfile(this.requireRegisteredCurrentUser(user))),
    );
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

  getDictionaries(
    options?: { readonly force?: boolean },
  ): Observable<DictionariesDto> {
    if (options?.force) {
      this.dictionaries$ = undefined;
    }

    if (!this.dictionaries$) {
      this.dictionaries$ = this.get<DictionariesDto>('/api/v1/dictionaries').pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    }

    return this.dictionaries$;
  }

  getCurrentUser(): Observable<CurrentUserDto> {
    return forkJoin({
      user: this.get<BackendUserInfoDto>('/api/v1/users/me', true),
      dictionaries: this.getDictionaries(),
    }).pipe(
      map(({ user, dictionaries }) => this.toCurrentUser(user, dictionaries)),
    );
  }

  saveCurrentUser(payload: SaveCurrentUserInput): Observable<CurrentUserDto> {
    return this.getDictionaries().pipe(
      switchMap((dictionaries) =>
        this.put<BackendUpdateUserInfoDto, UUID>(
          '/api/v1/users/me',
          this.toBackendUpdateUserInfo(payload, dictionaries),
          true,
        ),
      ),
      switchMap(() => this.getCurrentUser()),
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

  private toCurrentUser(
    user: BackendUserInfoDto,
    dictionaries: DictionariesDto,
  ): CurrentUserDto {
    return {
      id: user.id ?? null,
      uniqueName: user.uniqueName ?? null,
      displayName: user.displayName ?? null,
      birthDate: user.birthDate ?? null,
      available: user.available,
      cityOfResidence: user.cityOfResidence ?? null,
      avatarUrl: user.avatarUrl ?? null,
      email: user.email ?? null,
      biography: user.biography ?? null,
      skills: [...user.skills],
      specializations: [...user.specializations],
      portfolioLinks: user.portfolioLinks.map((link) => ({
        id: link.id,
        url: link.url,
        description: link.description ?? null,
      })),
      educations: user.education.map((education) =>
        this.toCurrentUserEducation(education, dictionaries),
      ),
      createdAt: user.createdAt ?? null,
      updatedAt: user.updatedAt ?? null,
    };
  }

  private toCurrentUserEducation(
    education: BackendEducationDto,
    dictionaries: DictionariesDto,
  ): CurrentUserDto['educations'][number] {
    return {
      id: education.id,
      university: this.requireUniversity(education.universityId, dictionaries),
      degree: this.fromBackendEducationDegree(education.degree),
      faculty: education.faculty ?? null,
      yearStart: education.yearStart ?? null,
      yearEnd: education.yearEnd ?? null,
    };
  }

  private toUserFull(
    user: BackendUserInfoDto & { readonly id: UUID },
    dictionaries: DictionariesDto,
  ): UserFullDto {
    return this.toMyProfile(this.requireRegisteredCurrentUser(this.toCurrentUser(user, dictionaries)));
  }

  private toMyProfile(user: CurrentUserDto & { readonly id: UUID }): MyProfileDto {
    return {
      id: user.id,
      uniqueName: user.uniqueName ?? '',
      displayName: user.displayName ?? user.uniqueName ?? 'Новый пользователь',
      birthDate: user.birthDate ?? null,
      available: user.available,
      cityOfResidence: user.cityOfResidence ?? null,
      email: user.email ?? null,
      biography: user.biography ?? null,
      avatarUrl: user.avatarUrl ?? null,
      specializations: [...user.specializations],
      skills: user.skills.map(
        (skill): UserSkillDto => ({
          skill,
          // Бэкенд пока не возвращает уровень владения навыком.
          experienceLevel: 'junior',
        }),
      ),
      portfolioLinks: user.portfolioLinks.map((link) => ({
        id: link.id,
        url: link.url,
        description: link.description ?? null,
      })),
      educations: user.educations.map(
        (education): UserEducationDto => ({
          id: education.id,
          university: education.university,
          degree: education.degree,
          faculty: education.faculty ?? null,
          program: null,
          yearStart: education.yearStart ?? null,
          yearEnd: education.yearEnd ?? null,
        }),
      ),
      teams: [],
      createdAt: user.createdAt ?? new Date().toISOString(),
      updatedAt: user.updatedAt ?? user.createdAt ?? new Date().toISOString(),
    };
  }

  private toSaveCurrentUserInput(
    payload: UpsertMyProfileRequest,
    currentUser: CurrentUserDto,
  ): SaveCurrentUserInput {
    const email = payload.email?.trim() || currentUser.email?.trim() || '';
    const cityOfResidenceId = 'cityOfResidenceId' in payload
      ? payload.cityOfResidenceId ?? null
      : currentUser.cityOfResidence?.id ?? null;

    if (!email) {
      throw new Error('Для сохранения профиля требуется email');
    }

    return {
      uniqueName: payload.uniqueName.trim(),
      displayName: payload.displayName.trim(),
      birthDate: payload.birthDate ?? null,
      available: payload.available,
      cityOfResidenceId,
      avatarUrl: currentUser.avatarUrl ?? null,
      email,
      biography: payload.biography ?? null,
      skillIds: [...new Set(payload.skills.map((skill) => skill.skillId))],
      specializationIds: payload.specializationIds,
      portfolioLinks: payload.portfolioLinks.map((link) => ({
        id: link.id,
        url: link.url,
        description: link.description ?? null,
      })),
      educations: payload.educations.map((education) => ({
        id: education.id,
        universityId: education.universityId,
        degree: education.degree,
        faculty: education.faculty ?? null,
        yearStart: education.yearStart ?? null,
        yearEnd: education.yearEnd ?? null,
      })),
    };
  }

  private toBackendUpdateUserInfo(
    payload: SaveCurrentUserInput,
    dictionaries: DictionariesDto,
  ): BackendUpdateUserInfoDto {
    return {
      uniqueName: payload.uniqueName.trim(),
      displayName: payload.displayName.trim(),
      birthDate: payload.birthDate ?? null,
      available: payload.available,
      city: payload.cityOfResidenceId
        ? this.requireCity(payload.cityOfResidenceId, dictionaries)
        : null,
      avatarUrl: payload.avatarUrl ?? null,
      email: payload.email.trim(),
      biography: payload.biography ?? null,
      skills: this.resolveSkills(payload.skillIds, dictionaries),
      specializations: this.resolveSpecializations(
        payload.specializationIds,
        dictionaries,
      ),
      portfolioLinks: payload.portfolioLinks.map((link) => ({
        id: link.id ?? EMPTY_GUID,
        url: link.url.trim(),
        description: link.description ?? null,
      })),
      education: payload.educations.map((education) => ({
        id: education.id ?? EMPTY_GUID,
        universityId: education.universityId,
        degree: this.toBackendEducationDegree(education.degree),
        faculty: education.faculty ?? null,
        yearStart: this.requireEducationYear(education.yearStart),
        yearEnd: this.requireEducationYear(education.yearEnd),
      })),
    };
  }

  private resolveSkills(
    skillIds: readonly UUID[],
    dictionaries: DictionariesDto,
  ): readonly SkillDto[] {
    return [...new Set(skillIds)].map((skillId) => {
      const skill = dictionaries.skills.find((item) => item.id === skillId);

      if (!skill) {
        throw new Error('Не найден выбранный навык');
      }

      return skill;
    });
  }

  private resolveSpecializations(
    specializationIds: readonly UUID[],
    dictionaries: DictionariesDto,
  ): readonly SpecializationDto[] {
    return [...new Set(specializationIds)].map((specializationId) => {
      const specialization = dictionaries.specializations.find(
        (item) => item.id === specializationId,
      );

      if (!specialization) {
        throw new Error('Не найдена выбранная специализация');
      }

      return specialization;
    });
  }

  private requireCity(cityId: UUID, dictionaries: DictionariesDto): CityDto {
    const city = dictionaries.cities.find((item) => item.id === cityId);

    if (!city) {
      throw new Error('Не найден выбранный город');
    }

    return city;
  }

  private requireUniversity(universityId: UUID, dictionaries: DictionariesDto) {
    const university = dictionaries.universities.find(
      (item) => item.id === universityId,
    );

    if (!university) {
      throw new Error('Не найден выбранный университет');
    }

    return university;
  }

  private requireEducationYear(year: number | null | undefined): number {
    if (!year) {
      throw new Error('Для образования нужно указать год начала и окончания');
    }

    return year;
  }

  private requireRegisteredUser(
    user: BackendUserInfoDto,
  ): BackendUserInfoDto & { readonly id: UUID } {
    if (!user.id) {
      throw new Error('Профиль пользователя ещё не зарегистрирован');
    }

    return user as BackendUserInfoDto & { readonly id: UUID };
  }

  private requireRegisteredCurrentUser(
    user: CurrentUserDto,
  ): CurrentUserDto & { readonly id: UUID } {
    if (!user.id) {
      throw new Error('Профиль пользователя ещё не зарегистрирован');
    }

    return user as CurrentUserDto & { readonly id: UUID };
  }

  private fromBackendEducationDegree(degree: BackendEducationDegree): EducationDegree {
    switch (degree) {
      case 0:
        return 'bachelor';
      case 1:
        return 'master';
      case 2:
        return 'postgraduate';
      case 3:
        return 'specialist';
      default:
        return 'other';
    }
  }

  private toBackendEducationDegree(degree: EducationDegree): BackendEducationDegree {
    switch (degree) {
      case 'bachelor':
        return 0;
      case 'master':
        return 1;
      case 'postgraduate':
        return 2;
      case 'specialist':
        return 3;
      default:
        throw new Error('Текущий API не поддерживает выбранную степень образования');
    }
  }
}
