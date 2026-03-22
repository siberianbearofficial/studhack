export type UUID = string;
export type Timestamp = string;
export type ISODate = string;

export type Nullable<T> = T | null;

export type EventType = 'hackathon' | 'other';
export type EventFormat = 'online' | 'offline' | 'hybrid';

export type TeamRequestType = 'application' | 'invitation';
export type TeamRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type SkillExperienceLevel = 'junior' | 'middle' | 'senior';
export type EducationDegree =
  | 'bachelor'
  | 'master'
  | 'postgraduate'
  | 'specialist'
  | 'other';

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'BUSINESS_RULE_VIOLATION'
  | 'INTERNAL_ERROR';

export type ApiFieldErrorMap = Readonly<
  Record<string, string | readonly string[]>
>;

export interface ApiResponse<T> {
  readonly data: T;
  readonly meta?: {
    readonly total?: number;
  };
}

export interface ApiError {
  readonly error: {
    readonly code: ApiErrorCode;
    readonly message: string;
    readonly fields?: ApiFieldErrorMap;
  };
}

export interface RegionDto {
  readonly id: UUID;
  readonly name: string;
}

export interface CityDto {
  readonly id: UUID;
  readonly name: string;
  readonly region: RegionDto;
}

export interface UniversityDto {
  readonly id: UUID;
  readonly name: string;
  readonly city: CityDto;
}

export interface SpecializationDto {
  readonly id: UUID;
  readonly name: string;
}

export interface SkillDto {
  readonly id: UUID;
  readonly name: string;
}

export interface UserShortDto {
  readonly id: UUID;
  readonly uniqueName: string;
  readonly displayName: string;
  readonly avatarUrl?: Nullable<string>;
  readonly available: boolean;
  readonly cityOfResidence?: Nullable<CityDto>;
  readonly specializations: readonly SpecializationDto[];
}

export interface UserSkillDto {
  readonly skill: SkillDto;
  readonly experienceLevel: SkillExperienceLevel;
}

export interface PortfolioLinkDto {
  readonly id: UUID;
  readonly url: string;
  readonly description?: Nullable<string>;
}

export interface UserEducationDto {
  readonly id: UUID;
  readonly university: UniversityDto;
  readonly degree: EducationDegree;
  readonly faculty?: Nullable<string>;
  readonly program?: Nullable<string>;
  readonly yearStart?: Nullable<number>;
  readonly yearEnd?: Nullable<number>;
}

export interface EventShortDto {
  readonly id: UUID;
  readonly name: string;
  readonly type: EventType;
  readonly startsAt: Timestamp;
  readonly endsAt: Timestamp;
  readonly format: EventFormat;
  readonly city?: Nullable<CityDto>;
}

export interface TeamShortDto {
  readonly id: UUID;
  readonly eventId: UUID;
  readonly name: string;
  readonly description?: Nullable<string>;
  readonly captain?: Nullable<UserShortDto>;
  readonly memberCount: number;
  readonly openPositionsCount: number;
}

export interface UserTeamMembershipDto {
  readonly team: TeamShortDto;
  readonly event: EventShortDto;
  readonly roleTitle: string;
  readonly isCaptain: boolean;
  readonly isMandatoryRole: boolean;
}

export interface UserFullDto {
  readonly id: UUID;
  readonly uniqueName: string;
  readonly displayName: string;
  readonly birthDate?: Nullable<ISODate>;
  readonly available: boolean;
  readonly cityOfResidence?: Nullable<CityDto>;
  readonly email?: Nullable<string>;
  readonly biography?: Nullable<string>;
  readonly avatarUrl?: Nullable<string>;
  readonly specializations: readonly SpecializationDto[];
  readonly skills: readonly UserSkillDto[];
  readonly portfolioLinks: readonly PortfolioLinkDto[];
  readonly educations: readonly UserEducationDto[];
  readonly teams: readonly UserTeamMembershipDto[];
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface MyProfileDto extends UserFullDto {}

export interface EventLocationDto {
  readonly format: EventFormat;
  readonly city?: Nullable<CityDto>;
  readonly addressText?: Nullable<string>;
  readonly venueName?: Nullable<string>;
  readonly latitude?: Nullable<number>;
  readonly longitude?: Nullable<number>;
}

export interface EventStageDto {
  readonly id: UUID;
  readonly code: string;
  readonly title: string;
  readonly description?: Nullable<string>;
  readonly startsAt?: Nullable<Timestamp>;
  readonly endsAt?: Nullable<Timestamp>;
  readonly order: number;
}

export interface MandatoryPositionDto {
  readonly id: UUID;
  readonly title: string;
  readonly specialization: SpecializationDto;
  readonly requiredSkills: readonly SkillDto[];
}

export interface HackathonDetailsDto {
  readonly eventId: UUID;
  readonly minTeamSize: number;
  readonly maxTeamSize: number;
  readonly mandatoryPositions: readonly MandatoryPositionDto[];
}

export interface EventSubscriptionDto {
  readonly isSubscribed: boolean;
  readonly subscribedAt?: Nullable<Timestamp>;
  readonly subscribersCount: number;
}

export interface TeamMemberDto {
  readonly positionId: UUID;
  readonly title: string;
  readonly isCaptain: boolean;
  readonly isMandatoryRole: boolean;
  readonly user: UserShortDto;
}

export interface TeamRequestShortDto {
  readonly id: UUID;
  readonly type: TeamRequestType;
  readonly status: TeamRequestStatus;
  readonly message?: Nullable<string>;
  readonly user: UserShortDto;
  readonly createdAt: Timestamp;
  readonly resolvedAt?: Nullable<Timestamp>;
}

export interface TeamPositionSummaryDto {
  readonly id: UUID;
  readonly title: string;
  readonly specialization: SpecializationDto;
  readonly isMandatory: boolean;
}

export interface TeamPositionDto {
  readonly id: UUID;
  readonly title: string;
  readonly description?: Nullable<string>;
  readonly specialization: SpecializationDto;
  readonly requiredSkills: readonly SkillDto[];
  readonly mandatoryPositionId?: Nullable<UUID>;
  readonly isMandatory: boolean;
  readonly filledByExternal: boolean;
  readonly user?: Nullable<UserShortDto>;
  readonly requests: readonly TeamRequestShortDto[];
}

export interface MandatoryCoverageDto {
  readonly total: number;
  readonly filled: number;
  readonly allFilled: boolean;
}

export interface TeamInEventDto {
  readonly id: UUID;
  readonly name: string;
  readonly description?: Nullable<string>;
  readonly creator: UserShortDto;
  readonly captain?: Nullable<UserShortDto>;
  readonly memberCount: number;
  readonly openPositionsCount: number;
  readonly mandatoryCoverage: MandatoryCoverageDto;
  readonly members: readonly TeamMemberDto[];
  readonly positions: readonly TeamPositionDto[];
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface TeamFullDto {
  readonly id: UUID;
  readonly event: EventShortDto;
  readonly name: string;
  readonly description?: Nullable<string>;
  readonly creator: UserShortDto;
  readonly captain?: Nullable<UserShortDto>;
  readonly memberCount: number;
  readonly openPositionsCount: number;
  readonly mandatoryCoverage: MandatoryCoverageDto;
  readonly members: readonly TeamMemberDto[];
  readonly positions: readonly TeamPositionDto[];
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface EventFullDto {
  readonly id: UUID;
  readonly name: string;
  readonly type: EventType;
  readonly description?: Nullable<string>;
  readonly registrationLink?: Nullable<string>;
  readonly location: EventLocationDto;
  readonly startsAt: Timestamp;
  readonly endsAt: Timestamp;
  readonly stages: readonly EventStageDto[];
  readonly hackathon?: Nullable<HackathonDetailsDto>;
  readonly subscription: EventSubscriptionDto;
  readonly teams: readonly TeamInEventDto[];
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface TeamRequestDto {
  readonly id: UUID;
  readonly type: TeamRequestType;
  readonly status: TeamRequestStatus;
  readonly message?: Nullable<string>;
  readonly user: UserShortDto;
  readonly team: TeamShortDto;
  readonly teamPosition: TeamPositionSummaryDto;
  readonly createdAt: Timestamp;
  readonly resolvedAt?: Nullable<Timestamp>;
}

export interface TeamRequestsFeedDto {
  readonly inbox: readonly TeamRequestDto[];
  readonly outbox: readonly TeamRequestDto[];
  readonly managedTeams: readonly TeamRequestDto[];
}

export interface DictionariesDto {
  readonly regions: readonly RegionDto[];
  readonly cities: readonly CityDto[];
  readonly universities: readonly UniversityDto[];
  readonly specializations: readonly SpecializationDto[];
  readonly skills: readonly SkillDto[];
}

export interface UpsertUserSkillInput {
  readonly skillId: UUID;
  readonly experienceLevel: SkillExperienceLevel;
}

export interface UpsertPortfolioLinkInput {
  readonly id?: UUID;
  readonly url: string;
  readonly description?: Nullable<string>;
}

export interface UpsertEducationInput {
  readonly id?: UUID;
  readonly universityId: UUID;
  readonly degree: EducationDegree;
  readonly faculty?: Nullable<string>;
  readonly program?: Nullable<string>;
  readonly yearStart?: Nullable<number>;
  readonly yearEnd?: Nullable<number>;
}

export interface UpsertMyProfileRequest {
  readonly uniqueName: string;
  readonly displayName: string;
  readonly birthDate?: Nullable<ISODate>;
  readonly available: boolean;
  readonly cityOfResidenceId?: Nullable<UUID>;
  readonly email?: Nullable<string>;
  readonly biography?: Nullable<string>;
  readonly specializationIds: readonly UUID[];
  readonly skills: readonly UpsertUserSkillInput[];
  readonly portfolioLinks: readonly UpsertPortfolioLinkInput[];
  readonly educations: readonly UpsertEducationInput[];
}

export interface UpsertEventStageInput {
  readonly id?: UUID;
  readonly code: string;
  readonly title: string;
  readonly description?: Nullable<string>;
  readonly startsAt?: Nullable<Timestamp>;
  readonly endsAt?: Nullable<Timestamp>;
  readonly order: number;
}

export interface UpsertMandatoryPositionInput {
  readonly id?: UUID;
  readonly title: string;
  readonly specializationId: UUID;
  readonly requiredSkillIds: readonly UUID[];
}

export interface UpsertEventLocationInput {
  readonly format: EventFormat;
  readonly cityId?: Nullable<UUID>;
  readonly addressText?: Nullable<string>;
  readonly venueName?: Nullable<string>;
  readonly latitude?: Nullable<number>;
  readonly longitude?: Nullable<number>;
}

export interface UpsertHackathonInput {
  readonly minTeamSize: number;
  readonly maxTeamSize: number;
  readonly mandatoryPositions: readonly UpsertMandatoryPositionInput[];
}

export interface UpsertEventRequest {
  readonly id?: UUID;
  readonly name: string;
  readonly type: EventType;
  readonly description?: Nullable<string>;
  readonly registrationLink?: Nullable<string>;
  readonly startsAt: Timestamp;
  readonly endsAt: Timestamp;
  readonly location: UpsertEventLocationInput;
  readonly stages: readonly UpsertEventStageInput[];
  readonly hackathon?: Nullable<UpsertHackathonInput>;
}

export interface UpsertTeamPositionInput {
  readonly id?: UUID;
  readonly title: string;
  readonly description?: Nullable<string>;
  readonly mandatoryPositionId?: Nullable<UUID>;
  readonly specializationId?: Nullable<UUID>;
  readonly requiredSkillIds?: readonly UUID[];
  readonly filledByExternal?: boolean;
  readonly userId?: Nullable<UUID>;
}

export interface UpsertTeamRequest {
  readonly id?: UUID;
  readonly eventId: UUID;
  readonly name: string;
  readonly description?: Nullable<string>;
  readonly captainUserId?: Nullable<UUID>;
  readonly positions: readonly UpsertTeamPositionInput[];
}

export interface CreateTeamRequestInput {
  readonly teamPositionId: UUID;
  readonly type: TeamRequestType;
  readonly invitedUserId?: UUID;
  readonly message?: Nullable<string>;
}

export type CreateTeamRequestRequest = CreateTeamRequestInput;

export interface ResolveTeamRequestInput {
  readonly status: Extract<
    TeamRequestStatus,
    'approved' | 'rejected' | 'cancelled'
  >;
}

export type ResolveTeamRequestRequest = ResolveTeamRequestInput;

export interface SetEventSubscriptionRequest {
  readonly subscribed: boolean;
}

export interface DeleteResultDto {
  readonly id: UUID;
  readonly deleted: true;
}
