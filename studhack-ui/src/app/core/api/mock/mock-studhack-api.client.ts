import { Injectable, inject } from '@angular/core';
import {
  Observable,
  defer,
  delay,
  mergeMap,
  of,
  throwError,
  timer,
} from 'rxjs';

import { type StudhackApiClient } from '../api.client';
import {
  type ApiErrorCode,
  type ApiFieldErrorMap,
  type BootstrapDto,
  type CityDto,
  type CreateTeamRequestInput,
  type DeleteResultDto,
  type EventFullDto,
  type EventShortDto,
  type EventSubscriptionDto,
  type MandatoryCoverageDto,
  type MandatoryPositionDto,
  type MyProfileDto,
  type PortfolioLinkDto,
  type ResolveTeamRequestInput,
  type SetEventSubscriptionRequest,
  type SkillDto,
  type SpecializationDto,
  type TeamFullDto,
  type TeamInEventDto,
  type TeamMemberDto,
  type TeamPositionDto,
  type TeamPositionSummaryDto,
  type TeamRequestDto,
  type TeamRequestShortDto,
  type TeamRequestsFeedDto,
  type TeamShortDto,
  type Timestamp,
  type UpsertEducationInput,
  type UpsertEventRequest,
  type UpsertMandatoryPositionInput,
  type UpsertMyProfileRequest,
  type UpsertPortfolioLinkInput,
  type UpsertTeamPositionInput,
  type UpsertTeamRequest,
  type UserEducationDto,
  type UserFullDto,
  type UserShortDto,
  type UserSkillDto,
  type UserTeamMembershipDto,
  type UUID,
} from '../api.models';
import { API_MOCK_LATENCY_MS } from '../api.providers';
import {
  type MockDatabaseState,
  type MockEventEntity,
  type MockMandatoryPositionEntity,
  type MockTeamEntity,
  type MockTeamPositionEntity,
  type MockTeamRequestEntity,
  type MockUserEntity,
  createMockDatabaseState,
} from './mock-data';

class MockApiClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly fields?: ApiFieldErrorMap,
  ) {
    super(message);
    this.name = 'MockApiClientError';
  }
}

@Injectable()
export class MockStudhackApiClient implements StudhackApiClient {
  private readonly latencyMs = inject(API_MOCK_LATENCY_MS);
  private readonly state: MockDatabaseState = createMockDatabaseState();
  private idCounter = 0;

  getBootstrap(): Observable<BootstrapDto> {
    return this.respond(() => ({
      me: this.buildMyProfile(),
      dictionaries: this.clone(this.state.dictionaries),
    }));
  }

  getEvents(): Observable<readonly EventFullDto[]> {
    return this.respond(() =>
      this.state.events
        .slice()
        .sort((left, right) => left.startsAt.localeCompare(right.startsAt))
        .map((event) => this.buildEventFull(event.id)),
    );
  }

  getEvent(eventId: UUID): Observable<EventFullDto> {
    return this.respond(() => this.buildEventFull(this.requireEvent(eventId).id));
  }

  upsertEvent(payload: UpsertEventRequest): Observable<EventFullDto> {
    return this.respond(() => {
      this.validateEventPayload(payload);

      const now = this.now();
      const existingEvent = payload.id ? this.requireEvent(payload.id) : undefined;
      const event: MockEventEntity =
        existingEvent ??
        {
          id: this.nextId('event'),
          name: '',
          type: 'other',
          description: null,
          registrationLink: null,
          location: {
            format: 'offline',
            cityId: null,
            addressText: null,
            venueName: null,
            latitude: null,
            longitude: null,
          },
          startsAt: now,
          endsAt: now,
          stages: [],
          hackathon: null,
          subscriptions: [],
          createdAt: now,
          updatedAt: now,
        };

      event.name = payload.name.trim();
      event.type = payload.type;
      event.description = payload.description ?? null;
      event.registrationLink = payload.registrationLink ?? null;
      event.location = {
        format: payload.location.format,
        cityId: payload.location.cityId ?? null,
        addressText: payload.location.addressText ?? null,
        venueName: payload.location.venueName ?? null,
        latitude: payload.location.latitude ?? null,
        longitude: payload.location.longitude ?? null,
      };
      event.startsAt = payload.startsAt;
      event.endsAt = payload.endsAt;
      event.stages = payload.stages
        .map((stage) => ({
          id: stage.id ?? this.nextId('event-stage'),
          code: stage.code,
          title: stage.title,
          description: stage.description ?? null,
          startsAt: stage.startsAt ?? null,
          endsAt: stage.endsAt ?? null,
          order: stage.order,
        }))
        .sort((left, right) => left.order - right.order);
      event.hackathon =
        payload.type === 'hackathon'
          ? {
              minTeamSize: payload.hackathon!.minTeamSize,
              maxTeamSize: payload.hackathon!.maxTeamSize,
              mandatoryPositions: payload.hackathon!.mandatoryPositions.map(
                (position) =>
                  this.toMandatoryPositionEntity(position),
              ),
            }
          : null;
      event.updatedAt = now;

      if (!existingEvent) {
        this.state.events.push(event);
      }

      return this.buildEventFull(event.id);
    });
  }

  setEventSubscription(
    eventId: UUID,
    payload: SetEventSubscriptionRequest,
  ): Observable<EventSubscriptionDto> {
    return this.respond(() => {
      const event = this.requireEvent(eventId);
      const existingIndex = event.subscriptions.findIndex(
        (subscription) => subscription.userId === this.state.meUserId,
      );

      if (payload.subscribed && existingIndex === -1) {
        event.subscriptions.push({
          userId: this.state.meUserId,
          subscribedAt: this.now(),
        });
      }

      if (!payload.subscribed && existingIndex !== -1) {
        event.subscriptions.splice(existingIndex, 1);
      }

      event.updatedAt = this.now();

      return this.buildEventSubscription(event);
    });
  }

  getTeams(): Observable<readonly TeamFullDto[]> {
    return this.respond(() =>
      this.state.teams
        .slice()
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
        .map((team) => this.buildTeamFull(team.id)),
    );
  }

  getTeam(teamId: UUID): Observable<TeamFullDto> {
    return this.respond(() => this.buildTeamFull(this.requireTeam(teamId).id));
  }

  upsertTeam(payload: UpsertTeamRequest): Observable<TeamFullDto> {
    return this.respond(() => {
      const event = this.requireEvent(payload.eventId);
      const existingTeam = payload.id ? this.requireTeam(payload.id) : undefined;
      const team: MockTeamEntity =
        existingTeam ??
        {
          id: this.nextId('team'),
          eventId: payload.eventId,
          name: '',
          description: null,
          creatorUserId: this.state.meUserId,
          captainUserId: this.state.meUserId,
          createdAt: this.now(),
          updatedAt: this.now(),
          positions: [],
        };

      const nextCaptainId =
        payload.captainUserId === undefined
          ? (existingTeam?.captainUserId ?? this.state.meUserId)
          : (payload.captainUserId ?? null);

      if (nextCaptainId) {
        this.requireUser(nextCaptainId);
      }

      const nextPositions = payload.positions.map((position) =>
        this.toTeamPositionEntity(event, position, team.id),
      );
      const occupiedUserIds = new Set<UUID>();

      for (const position of nextPositions) {
        if (position.userId) {
          if (occupiedUserIds.has(position.userId)) {
            this.validation(
              'Один и тот же пользователь не может занимать несколько позиций в одной команде',
            );
          }

          occupiedUserIds.add(position.userId);
          this.assertUserCanJoinEvent(payload.eventId, position.userId, team.id);
        }
      }

      this.assertTeamCapacity(
        event,
        nextPositions.filter((position) => position.userId || position.filledByExternal)
          .length,
      );

      const nextPositionIds = new Set(nextPositions.map((position) => position.id));
      this.state.teamRequests = this.state.teamRequests.filter(
        (request) =>
          request.teamId !== team.id || nextPositionIds.has(request.teamPositionId),
      );

      team.eventId = payload.eventId;
      team.name = payload.name.trim();
      team.description = payload.description ?? null;
      team.captainUserId = nextCaptainId;
      team.positions = nextPositions;
      team.updatedAt = this.now();

      if (!existingTeam) {
        this.state.teams.push(team);
      }

      return this.buildTeamFull(team.id);
    });
  }

  deleteTeam(teamId: UUID): Observable<DeleteResultDto> {
    return this.respond(() => {
      const teamIndex = this.state.teams.findIndex((team) => team.id === teamId);

      if (teamIndex === -1) {
        throw this.notFound('Команда не найдена');
      }

      this.state.teams.splice(teamIndex, 1);
      this.state.teamRequests = this.state.teamRequests.filter(
        (request) => request.teamId !== teamId,
      );

      return {
        id: teamId,
        deleted: true,
      };
    });
  }

  getUsers(): Observable<readonly UserFullDto[]> {
    return this.respond(() =>
      this.state.users
        .slice()
        .sort((left, right) => left.displayName.localeCompare(right.displayName))
        .map((user) => this.buildUserFull(user.id)),
    );
  }

  getUser(userId: UUID): Observable<UserFullDto> {
    return this.respond(() => this.buildUserFull(this.requireUser(userId).id));
  }

  getMe(): Observable<MyProfileDto> {
    return this.respond(() => this.buildMyProfile());
  }

  upsertMe(payload: UpsertMyProfileRequest): Observable<MyProfileDto> {
    return this.respond(() => {
      this.validateProfilePayload(payload);

      const me = this.requireUser(this.state.meUserId);
      const duplicateUser = this.state.users.find(
        (user) =>
          user.uniqueName === payload.uniqueName.trim() && user.id !== this.state.meUserId,
      );

      if (duplicateUser) {
        throw this.conflict('uniqueName уже занят', {
          uniqueName: 'Это имя уже используется другим пользователем',
        });
      }

      me.uniqueName = payload.uniqueName.trim();
      me.displayName = payload.displayName.trim();
      me.birthDate = payload.birthDate ?? null;
      me.available = payload.available;
      me.cityOfResidenceId = payload.cityOfResidenceId ?? null;
      me.email = payload.email ?? null;
      me.biography = payload.biography ?? null;
      me.specializationIds = [...payload.specializationIds];
      me.skills = payload.skills.map((skill) => ({
        skillId: skill.skillId,
        experienceLevel: skill.experienceLevel,
      }));
      me.portfolioLinks = payload.portfolioLinks.map((item) =>
        this.toPortfolioLinkEntity(item),
      );
      me.educations = payload.educations.map((item) => this.toEducationEntity(item));
      me.updatedAt = this.now();

      return this.buildMyProfile();
    });
  }

  getTeamRequests(): Observable<TeamRequestsFeedDto> {
    return this.respond(() => this.buildTeamRequestsFeed());
  }

  createTeamRequest(payload: CreateTeamRequestInput): Observable<TeamRequestDto> {
    return this.respond(() => {
      const { team, position } = this.requireTeamPosition(payload.teamPositionId);
      const now = this.now();
      const userId =
        payload.type === 'application'
          ? this.state.meUserId
          : payload.invitedUserId ?? this.validation('Для invitation нужен invitedUserId');

      this.requireUser(userId);

      if (payload.type === 'invitation' && !this.canManageTeam(team, this.state.meUserId)) {
        throw this.forbidden('Приглашения может создавать только captain или creator команды');
      }

      if (position.userId || position.filledByExternal) {
        throw this.conflict('Позиция уже занята');
      }

      if (
        this.state.teamRequests.some(
          (request) =>
            request.teamPositionId === position.id &&
            request.userId === userId &&
            request.status === 'pending',
        )
      ) {
        throw this.conflict('Для этого пользователя уже есть активный запрос по позиции');
      }

      if (payload.type === 'application') {
        this.assertUserCanJoinEvent(team.eventId, this.state.meUserId, team.id);
      }

      const request: MockTeamRequestEntity = {
        id: this.nextId('team-request'),
        type: payload.type,
        status: 'pending',
        message: payload.message ?? null,
        userId,
        createdByUserId: this.state.meUserId,
        teamId: team.id,
        teamPositionId: position.id,
        createdAt: now,
      };

      this.state.teamRequests.push(request);
      team.updatedAt = now;

      return this.buildTeamRequest(request.id);
    });
  }

  resolveTeamRequest(
    requestId: UUID,
    payload: ResolveTeamRequestInput,
  ): Observable<TeamRequestDto> {
    return this.respond(() => {
      const request = this.requireTeamRequest(requestId);
      const team = this.requireTeam(request.teamId);

      if (
        !this.canManageTeam(team, this.state.meUserId) &&
        request.userId !== this.state.meUserId &&
        request.createdByUserId !== this.state.meUserId
      ) {
        throw this.forbidden('Недостаточно прав для изменения этого запроса');
      }

      if (request.status !== 'pending') {
        throw this.conflict('Запрос уже был обработан');
      }

      const now = this.now();

      if (payload.status === 'approved') {
        const position = this.requireTeamPositionInTeam(team, request.teamPositionId);
        const occupiedSlots = team.positions.filter(
          (item) => item.userId || item.filledByExternal,
        ).length;
        const event = this.requireEvent(team.eventId);

        if (position.userId || position.filledByExternal) {
          throw this.conflict('Позиция уже занята');
        }

        this.assertUserCanJoinEvent(team.eventId, request.userId, team.id);
        this.assertTeamCapacity(event, occupiedSlots + 1);

        position.userId = request.userId;
        position.filledByExternal = false;
        team.updatedAt = now;

        for (const siblingRequest of this.state.teamRequests) {
          if (
            siblingRequest.id !== request.id &&
            siblingRequest.teamPositionId === request.teamPositionId &&
            siblingRequest.status === 'pending'
          ) {
            siblingRequest.status = 'rejected';
            siblingRequest.resolvedAt = now;
          }
        }
      }

      request.status = payload.status;
      request.resolvedAt = now;

      return this.buildTeamRequest(request.id);
    });
  }

  private respond<T>(producer: () => T): Observable<T> {
    return defer(() => {
      try {
        return of(producer()).pipe(delay(this.latencyMs));
      } catch (error) {
        return timer(this.latencyMs).pipe(
          mergeMap(() => throwError(() => error)),
        );
      }
    });
  }

  private buildMyProfile(): MyProfileDto {
    return this.buildUserFull(this.state.meUserId);
  }

  private buildUserFull(userId: UUID): UserFullDto {
    const user = this.requireUser(userId);

    return {
      id: user.id,
      uniqueName: user.uniqueName,
      displayName: user.displayName,
      birthDate: user.birthDate ?? null,
      available: user.available,
      cityOfResidence: user.cityOfResidenceId
        ? this.requireCity(user.cityOfResidenceId)
        : null,
      email: user.email ?? null,
      biography: user.biography ?? null,
      avatarUrl: user.avatarUrl ?? null,
      specializations: user.specializationIds.map((id) =>
        this.requireSpecialization(id),
      ),
      skills: user.skills.map((skill) => this.buildUserSkill(skill.skillId, skill.experienceLevel)),
      portfolioLinks: user.portfolioLinks.map((item): PortfolioLinkDto => ({
        id: item.id,
        url: item.url,
        description: item.description ?? null,
      })),
      educations: user.educations.map((item): UserEducationDto => ({
        id: item.id,
        university: this.requireUniversity(item.universityId),
        degree: item.degree,
        faculty: item.faculty ?? null,
        program: item.program ?? null,
        yearStart: item.yearStart ?? null,
        yearEnd: item.yearEnd ?? null,
      })),
      teams: this.buildUserMemberships(user.id),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private buildUserShort(userId: UUID): UserShortDto {
    const user = this.requireUser(userId);

    return {
      id: user.id,
      uniqueName: user.uniqueName,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl ?? null,
      available: user.available,
      cityOfResidence: user.cityOfResidenceId
        ? this.requireCity(user.cityOfResidenceId)
        : null,
      specializations: user.specializationIds.map((id) =>
        this.requireSpecialization(id),
      ),
    };
  }

  private buildUserSkill(skillId: UUID, experienceLevel: UserSkillDto['experienceLevel']): UserSkillDto {
    return {
      skill: this.requireSkill(skillId),
      experienceLevel,
    };
  }

  private buildUserMemberships(userId: UUID): readonly UserTeamMembershipDto[] {
    return this.state.teams.flatMap((team) =>
      team.positions
        .filter((position) => position.userId === userId)
        .map((position): UserTeamMembershipDto => ({
          team: this.buildTeamShort(team.id),
          event: this.buildEventShort(team.eventId),
          roleTitle: position.title,
          isCaptain: team.captainUserId === userId,
          isMandatoryRole: position.isMandatory,
        })),
    );
  }

  private buildEventShort(eventId: UUID): EventShortDto {
    const event = this.requireEvent(eventId);

    return {
      id: event.id,
      name: event.name,
      type: event.type,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      format: event.location.format,
      city: event.location.cityId ? this.requireCity(event.location.cityId) : null,
    };
  }

  private buildEventFull(eventId: UUID): EventFullDto {
    const event = this.requireEvent(eventId);

    return {
      id: event.id,
      name: event.name,
      type: event.type,
      description: event.description ?? null,
      registrationLink: event.registrationLink ?? null,
      location: {
        format: event.location.format,
        city: event.location.cityId ? this.requireCity(event.location.cityId) : null,
        addressText: event.location.addressText ?? null,
        venueName: event.location.venueName ?? null,
        latitude: event.location.latitude ?? null,
        longitude: event.location.longitude ?? null,
      },
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      stages: event.stages
        .slice()
        .sort((left, right) => left.order - right.order)
        .map((stage) => ({
          id: stage.id,
          code: stage.code,
          title: stage.title,
          description: stage.description ?? null,
          startsAt: stage.startsAt ?? null,
          endsAt: stage.endsAt ?? null,
          order: stage.order,
        })),
      hackathon: event.hackathon
        ? {
            eventId: event.id,
            minTeamSize: event.hackathon.minTeamSize,
            maxTeamSize: event.hackathon.maxTeamSize,
            mandatoryPositions: event.hackathon.mandatoryPositions.map((position) =>
              this.buildMandatoryPosition(position),
            ),
          }
        : null,
      subscription: this.buildEventSubscription(event),
      teams: this.state.teams
        .filter((team) => team.eventId === event.id)
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((team) => this.buildTeamInEvent(team.id)),
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

  private buildMandatoryPosition(
    position: MockMandatoryPositionEntity,
  ): MandatoryPositionDto {
    return {
      id: position.id,
      title: position.title,
      specialization: this.requireSpecialization(position.specializationId),
      requiredSkills: position.requiredSkillIds.map((skillId) =>
        this.requireSkill(skillId),
      ),
    };
  }

  private buildEventSubscription(event: MockEventEntity): EventSubscriptionDto {
    const current = event.subscriptions.find(
      (subscription) => subscription.userId === this.state.meUserId,
    );

    return {
      isSubscribed: current !== undefined,
      subscribedAt: current?.subscribedAt ?? null,
      subscribersCount: event.subscriptions.length,
    };
  }

  private buildTeamShort(teamId: UUID): TeamShortDto {
    const team = this.requireTeam(teamId);

    return {
      id: team.id,
      eventId: team.eventId,
      name: team.name,
      description: team.description ?? null,
      captain: team.captainUserId ? this.buildUserShort(team.captainUserId) : null,
      memberCount: this.countTeamMembers(team),
      openPositionsCount: this.countOpenPositions(team),
    };
  }

  private buildTeamInEvent(teamId: UUID): TeamInEventDto {
    const team = this.requireTeam(teamId);

    return {
      id: team.id,
      name: team.name,
      description: team.description ?? null,
      creator: this.buildUserShort(team.creatorUserId),
      captain: team.captainUserId ? this.buildUserShort(team.captainUserId) : null,
      memberCount: this.countTeamMembers(team),
      openPositionsCount: this.countOpenPositions(team),
      mandatoryCoverage: this.buildMandatoryCoverage(team),
      members: this.buildTeamMembers(team),
      positions: this.buildTeamPositions(team),
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  private buildTeamFull(teamId: UUID): TeamFullDto {
    const team = this.requireTeam(teamId);

    return {
      id: team.id,
      event: this.buildEventShort(team.eventId),
      name: team.name,
      description: team.description ?? null,
      creator: this.buildUserShort(team.creatorUserId),
      captain: team.captainUserId ? this.buildUserShort(team.captainUserId) : null,
      memberCount: this.countTeamMembers(team),
      openPositionsCount: this.countOpenPositions(team),
      mandatoryCoverage: this.buildMandatoryCoverage(team),
      members: this.buildTeamMembers(team),
      positions: this.buildTeamPositions(team),
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  private buildMandatoryCoverage(team: MockTeamEntity): MandatoryCoverageDto {
    const event = this.requireEvent(team.eventId);
    const mandatoryIds = new Set(
      event.hackathon?.mandatoryPositions.map((position) => position.id) ?? [],
    );
    const filledIds = new Set(
      team.positions
        .filter(
          (position) =>
            position.mandatoryPositionId &&
            (position.userId !== null && position.userId !== undefined || position.filledByExternal),
        )
        .map((position) => position.mandatoryPositionId!),
    );
    const filled = [...mandatoryIds].filter((id) => filledIds.has(id)).length;
    const total = mandatoryIds.size;

    return {
      total,
      filled,
      allFilled: total === 0 || filled === total,
    };
  }

  private buildTeamMembers(team: MockTeamEntity): readonly TeamMemberDto[] {
    return team.positions
      .filter(
        (position): position is MockTeamPositionEntity & { userId: UUID } =>
          position.userId !== null && position.userId !== undefined,
      )
      .map((position): TeamMemberDto => ({
        positionId: position.id,
        title: position.title,
        isCaptain: team.captainUserId === position.userId,
        isMandatoryRole: position.isMandatory,
        user: this.buildUserShort(position.userId),
      }));
  }

  private buildTeamPositions(team: MockTeamEntity): readonly TeamPositionDto[] {
    return team.positions.map((position) => this.buildTeamPosition(team, position));
  }

  private buildTeamPosition(
    team: MockTeamEntity,
    position: MockTeamPositionEntity,
  ): TeamPositionDto {
    return {
      id: position.id,
      title: position.title,
      description: position.description ?? null,
      specialization: this.requireSpecialization(position.specializationId),
      requiredSkills: position.requiredSkillIds.map((skillId) =>
        this.requireSkill(skillId),
      ),
      mandatoryPositionId: position.mandatoryPositionId ?? null,
      isMandatory: position.isMandatory,
      filledByExternal: position.filledByExternal,
      user:
        position.userId !== null && position.userId !== undefined
          ? this.buildUserShort(position.userId)
          : null,
      requests: this.state.teamRequests
        .filter((request) => request.teamPositionId === position.id)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .map((request) => this.buildTeamRequestShort(team, request)),
    };
  }

  private buildTeamRequestShort(
    team: MockTeamEntity,
    request: MockTeamRequestEntity,
  ): TeamRequestShortDto {
    this.requireTeamPositionInTeam(team, request.teamPositionId);

    return {
      id: request.id,
      type: request.type,
      status: request.status,
      message: request.message ?? null,
      user: this.buildUserShort(request.userId),
      createdAt: request.createdAt,
      resolvedAt: request.resolvedAt ?? null,
    };
  }

  private buildTeamRequest(requestId: UUID): TeamRequestDto {
    const request = this.requireTeamRequest(requestId);
    const team = this.requireTeam(request.teamId);

    return {
      id: request.id,
      type: request.type,
      status: request.status,
      message: request.message ?? null,
      user: this.buildUserShort(request.userId),
      team: this.buildTeamShort(team.id),
      teamPosition: this.buildTeamPositionSummary(team, request.teamPositionId),
      createdAt: request.createdAt,
      resolvedAt: request.resolvedAt ?? null,
    };
  }

  private buildTeamPositionSummary(
    team: MockTeamEntity,
    positionId: UUID,
  ): TeamPositionSummaryDto {
    const position = this.requireTeamPositionInTeam(team, positionId);

    return {
      id: position.id,
      title: position.title,
      specialization: this.requireSpecialization(position.specializationId),
      isMandatory: position.isMandatory,
    };
  }

  private buildTeamRequestsFeed(): TeamRequestsFeedDto {
    const managedTeamIds = new Set(
      this.state.teams
        .filter((team) => this.canManageTeam(team, this.state.meUserId))
        .map((team) => team.id),
    );

    return {
      inbox: this.state.teamRequests
        .filter(
          (request) =>
            request.userId === this.state.meUserId &&
            request.type === 'invitation',
        )
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .map((request) => this.buildTeamRequest(request.id)),
      outbox: this.state.teamRequests
        .filter((request) => request.createdByUserId === this.state.meUserId)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .map((request) => this.buildTeamRequest(request.id)),
      managedTeams: this.state.teamRequests
        .filter((request) => managedTeamIds.has(request.teamId))
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .map((request) => this.buildTeamRequest(request.id)),
    };
  }

  private toMandatoryPositionEntity(
    payload: UpsertMandatoryPositionInput,
  ): MockMandatoryPositionEntity {
    this.requireSpecialization(payload.specializationId);
    payload.requiredSkillIds.forEach((skillId) => this.requireSkill(skillId));

    return {
      id: payload.id ?? this.nextId('mandatory-position'),
      title: payload.title,
      specializationId: payload.specializationId,
      requiredSkillIds: [...payload.requiredSkillIds],
    };
  }

  private toTeamPositionEntity(
    event: MockEventEntity,
    payload: UpsertTeamPositionInput,
    teamId: UUID,
  ): MockTeamPositionEntity {
    const mandatoryPosition =
      payload.mandatoryPositionId !== undefined && payload.mandatoryPositionId !== null
        ? this.requireMandatoryPosition(event, payload.mandatoryPositionId)
        : undefined;
    const specializationId =
      payload.specializationId ?? mandatoryPosition?.specializationId;

    if (!specializationId) {
      this.validation('У позиции должен быть specializationId');
    }

    const requiredSkillIds = [
      ...(payload.requiredSkillIds ?? mandatoryPosition?.requiredSkillIds ?? []),
    ];

    if (requiredSkillIds.length === 0) {
      this.validation('У позиции должен быть хотя бы один requiredSkillId');
    }

    this.requireSpecialization(specializationId);
    requiredSkillIds.forEach((skillId) => this.requireSkill(skillId));

    if (payload.userId) {
      this.requireUser(payload.userId);
      this.assertUserCanJoinEvent(event.id, payload.userId, teamId);
    }

    return {
      id: payload.id ?? this.nextId('team-position'),
      title: payload.title,
      description: payload.description ?? null,
      specializationId,
      requiredSkillIds,
      mandatoryPositionId: payload.mandatoryPositionId ?? null,
      isMandatory: payload.mandatoryPositionId !== undefined && payload.mandatoryPositionId !== null,
      filledByExternal: payload.userId ? false : (payload.filledByExternal ?? false),
      userId: payload.userId ?? null,
    };
  }

  private toPortfolioLinkEntity(
    payload: UpsertPortfolioLinkInput,
  ): MockUserEntity['portfolioLinks'][number] {
    return {
      id: payload.id ?? this.nextId('portfolio-link'),
      url: payload.url,
      description: payload.description ?? null,
    };
  }

  private toEducationEntity(
    payload: UpsertEducationInput,
  ): MockUserEntity['educations'][number] {
    this.requireUniversity(payload.universityId);

    return {
      id: payload.id ?? this.nextId('education'),
      universityId: payload.universityId,
      degree: payload.degree,
      faculty: payload.faculty ?? null,
      program: payload.program ?? null,
      yearStart: payload.yearStart ?? null,
      yearEnd: payload.yearEnd ?? null,
    };
  }

  private validateEventPayload(payload: UpsertEventRequest): void {
    if (!payload.name.trim()) {
      this.validation('Название события обязательно', {
        name: 'Поле не должно быть пустым',
      });
    }

    if (payload.location.cityId) {
      this.requireCity(payload.location.cityId);
    }

    if (payload.startsAt >= payload.endsAt) {
      this.validation('Дата окончания события должна быть позже даты начала');
    }

    if (payload.type === 'hackathon' && !payload.hackathon) {
      this.validation('Для hackathon требуется блок hackathon');
    }

    if (payload.type === 'hackathon' && payload.hackathon) {
      if (payload.hackathon.minTeamSize > payload.hackathon.maxTeamSize) {
        this.validation('minTeamSize не может быть больше maxTeamSize');
      }
    }
  }

  private validateProfilePayload(payload: UpsertMyProfileRequest): void {
    if (!payload.uniqueName.trim()) {
      this.validation('uniqueName обязателен', {
        uniqueName: 'Поле не должно быть пустым',
      });
    }

    if (!payload.displayName.trim()) {
      this.validation('displayName обязателен', {
        displayName: 'Поле не должно быть пустым',
      });
    }

    if (payload.cityOfResidenceId) {
      this.requireCity(payload.cityOfResidenceId);
    }

    payload.specializationIds.forEach((specializationId) =>
      this.requireSpecialization(specializationId),
    );
    payload.skills.forEach((skill) => this.requireSkill(skill.skillId));
    payload.educations.forEach((education) =>
      this.requireUniversity(education.universityId),
    );
  }

  private assertUserCanJoinEvent(
    eventId: UUID,
    userId: UUID,
    excludedTeamId?: UUID,
  ): void {
    const occupiedTeam = this.state.teams.find(
      (team) =>
        team.eventId === eventId &&
        team.id !== excludedTeamId &&
        team.positions.some((position) => position.userId === userId),
    );

    if (occupiedTeam) {
      throw this.businessRuleViolation(
        'Пользователь уже состоит в другой команде этого хакатона',
      );
    }
  }

  private assertTeamCapacity(event: MockEventEntity, memberCount: number): void {
    if (!event.hackathon) {
      return;
    }

    if (memberCount > event.hackathon.maxTeamSize) {
      throw this.businessRuleViolation(
        'Апрув приведет к превышению максимального размера команды',
      );
    }
  }

  private countTeamMembers(team: MockTeamEntity): number {
    return team.positions.filter(
      (position) => position.userId || position.filledByExternal,
    ).length;
  }

  private countOpenPositions(team: MockTeamEntity): number {
    return team.positions.filter(
      (position) => !position.userId && !position.filledByExternal,
    ).length;
  }

  private canManageTeam(team: MockTeamEntity, userId: UUID): boolean {
    return team.creatorUserId === userId || team.captainUserId === userId;
  }

  private requireTeamPosition(positionId: UUID): {
    team: MockTeamEntity;
    position: MockTeamPositionEntity;
  } {
    for (const team of this.state.teams) {
      const position = team.positions.find((item) => item.id === positionId);

      if (position) {
        return { team, position };
      }
    }

    throw this.notFound('Позиция команды не найдена');
  }

  private requireTeamPositionInTeam(
    team: MockTeamEntity,
    positionId: UUID,
  ): MockTeamPositionEntity {
    const position = team.positions.find((item) => item.id === positionId);

    if (!position) {
      throw this.notFound('Позиция команды не найдена');
    }

    return position;
  }

  private requireMandatoryPosition(
    event: MockEventEntity,
    mandatoryPositionId: UUID,
  ): MockMandatoryPositionEntity {
    const mandatoryPosition = event.hackathon?.mandatoryPositions.find(
      (position) => position.id === mandatoryPositionId,
    );

    if (!mandatoryPosition) {
      this.validation('mandatoryPositionId не найден для выбранного события');
    }

    return mandatoryPosition;
  }

  private requireEvent(eventId: UUID): MockEventEntity {
    const event = this.findEvent(eventId);

    if (!event) {
      throw this.notFound('Событие не найдено');
    }

    return event;
  }

  private findEvent(eventId: UUID): MockEventEntity | undefined {
    return this.state.events.find((event) => event.id === eventId);
  }

  private requireTeam(teamId: UUID): MockTeamEntity {
    const team = this.findTeam(teamId);

    if (!team) {
      throw this.notFound('Команда не найдена');
    }

    return team;
  }

  private findTeam(teamId: UUID): MockTeamEntity | undefined {
    return this.state.teams.find((team) => team.id === teamId);
  }

  private requireUser(userId: UUID): MockUserEntity {
    const user = this.state.users.find((item) => item.id === userId);

    if (!user) {
      throw this.notFound('Пользователь не найден');
    }

    return user;
  }

  private requireTeamRequest(requestId: UUID): MockTeamRequestEntity {
    const request = this.state.teamRequests.find((item) => item.id === requestId);

    if (!request) {
      throw this.notFound('Запрос не найден');
    }

    return request;
  }

  private requireCity(cityId: UUID): CityDto {
    const city = this.state.dictionaries.cities.find((item) => item.id === cityId);

    if (!city) {
      throw this.notFound('Город не найден');
    }

    return city;
  }

  private requireUniversity(universityId: UUID) {
    const university = this.state.dictionaries.universities.find(
      (item) => item.id === universityId,
    );

    if (!university) {
      throw this.notFound('Университет не найден');
    }

    return university;
  }

  private requireSpecialization(specializationId: UUID): SpecializationDto {
    const specialization = this.state.dictionaries.specializations.find(
      (item) => item.id === specializationId,
    );

    if (!specialization) {
      throw this.notFound('Специализация не найдена');
    }

    return specialization;
  }

  private requireSkill(skillId: UUID): SkillDto {
    const skill = this.state.dictionaries.skills.find((item) => item.id === skillId);

    if (!skill) {
      throw this.notFound('Скилл не найден');
    }

    return skill;
  }

  private validation(message: string, fields?: ApiFieldErrorMap): never {
    throw new MockApiClientError(400, 'VALIDATION_ERROR', message, fields);
  }

  private notFound(message: string): MockApiClientError {
    return new MockApiClientError(404, 'NOT_FOUND', message);
  }

  private forbidden(message: string): MockApiClientError {
    return new MockApiClientError(403, 'FORBIDDEN', message);
  }

  private conflict(message: string, fields?: ApiFieldErrorMap): MockApiClientError {
    return new MockApiClientError(409, 'CONFLICT', message, fields);
  }

  private businessRuleViolation(message: string): MockApiClientError {
    return new MockApiClientError(409, 'BUSINESS_RULE_VIOLATION', message);
  }

  private nextId(prefix: string): UUID {
    this.idCounter += 1;

    return `${prefix}-${this.idCounter.toString().padStart(4, '0')}`;
  }

  private now(): Timestamp {
    return new Date().toISOString();
  }

  private clone<T>(value: T): T {
    return structuredClone(value);
  }
}
