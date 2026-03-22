import {
  type CityDto,
  type DictionariesDto,
  type EducationDegree,
  type ISODate,
  type Nullable,
  type PortfolioLinkDto,
  type SkillDto,
  type SpecializationDto,
  type Timestamp,
  type UUID,
  type UniversityDto,
} from '@core/api';

export interface CurrentUserEducationDto {
  readonly id: UUID;
  readonly university: UniversityDto;
  readonly degree: EducationDegree;
  readonly faculty?: Nullable<string>;
  readonly yearStart?: Nullable<number>;
  readonly yearEnd?: Nullable<number>;
}

export interface CurrentUserDto {
  readonly id: Nullable<UUID>;
  readonly uniqueName?: Nullable<string>;
  readonly displayName?: Nullable<string>;
  readonly birthDate?: Nullable<ISODate>;
  readonly available: boolean;
  readonly cityOfResidence?: Nullable<CityDto>;
  readonly avatarUrl?: Nullable<string>;
  readonly email?: Nullable<string>;
  readonly biography?: Nullable<string>;
  readonly skills: readonly SkillDto[];
  readonly specializations: readonly SpecializationDto[];
  readonly portfolioLinks: readonly PortfolioLinkDto[];
  readonly educations: readonly CurrentUserEducationDto[];
  readonly createdAt?: Nullable<Timestamp>;
  readonly updatedAt?: Nullable<Timestamp>;
}

export interface SaveCurrentUserPortfolioLinkInput {
  readonly id?: UUID;
  readonly url: string;
  readonly description?: Nullable<string>;
}

export interface SaveCurrentUserEducationInput {
  readonly id?: UUID;
  readonly universityId: UUID;
  readonly degree: EducationDegree;
  readonly faculty?: Nullable<string>;
  readonly yearStart?: Nullable<number>;
  readonly yearEnd?: Nullable<number>;
}

export interface SaveCurrentUserInput {
  readonly uniqueName: string;
  readonly displayName: string;
  readonly birthDate?: Nullable<ISODate>;
  readonly available: boolean;
  readonly cityOfResidenceId: UUID;
  readonly avatarUrl?: Nullable<string>;
  readonly email: string;
  readonly biography?: Nullable<string>;
  readonly skillIds: readonly UUID[];
  readonly specializationIds: readonly UUID[];
  readonly portfolioLinks: readonly SaveCurrentUserPortfolioLinkInput[];
  readonly educations: readonly SaveCurrentUserEducationInput[];
}

export interface CurrentUserApiAdapter {
  getCurrentUser(): import('rxjs').Observable<CurrentUserDto>;
  saveCurrentUser(
    payload: SaveCurrentUserInput,
  ): import('rxjs').Observable<CurrentUserDto>;
  getDictionaries(): import('rxjs').Observable<DictionariesDto>;
}
