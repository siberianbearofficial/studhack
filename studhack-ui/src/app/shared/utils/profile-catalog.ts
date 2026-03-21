import { type SkillExperienceLevel, type UserFullDto } from '@core/api';

export type ProfileParticipationFormat = 'offline' | 'online';

export interface ProfileFilterOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
}

export interface ProfileGrade {
  readonly max: number;
  readonly value: number;
  readonly level: number;
  readonly label: string;
}

export const PROFILE_PARTICIPATION_OPTIONS: readonly ProfileFilterOption<ProfileParticipationFormat>[] =
  [
    { value: 'offline', label: 'Очно' },
    { value: 'online', label: 'Онлайн' },
  ] as const;

export const PROFILE_EXPERIENCE_OPTIONS: readonly ProfileFilterOption<SkillExperienceLevel>[] =
  [
    { value: 'junior', label: 'Junior' },
    { value: 'middle', label: 'Middle' },
    { value: 'senior', label: 'Senior' },
  ] as const;

const EXPERIENCE_RANK: Record<SkillExperienceLevel, number> = {
  junior: 0,
  middle: 1,
  senior: 2,
};

const EXPERIENCE_LABEL: Record<SkillExperienceLevel, string> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
};

export function getExperienceLabel(level: SkillExperienceLevel): string {
  return EXPERIENCE_LABEL[level];
}

export function getProfileExperienceLevel(user: UserFullDto): SkillExperienceLevel {
  return user.skills.reduce<SkillExperienceLevel>(
    (highest, skill) =>
      EXPERIENCE_RANK[skill.experienceLevel] > EXPERIENCE_RANK[highest]
        ? skill.experienceLevel
        : highest,
    'junior',
  );
}

export function getProfileExperienceLabel(user: UserFullDto): string {
  return getExperienceLabel(getProfileExperienceLevel(user));
}

export function getPrimarySpecializationName(user: UserFullDto): string {
  return user.specializations[0]?.name ?? 'Без специализации';
}

export function getParticipationFormat(user: UserFullDto): ProfileParticipationFormat {
  return hashString(`${user.id}:${user.uniqueName}`) % 2 === 0 ? 'offline' : 'online';
}

export function getParticipationFormatLabel(
  format: ProfileParticipationFormat,
): string {
  return PROFILE_PARTICIPATION_OPTIONS.find((item) => item.value === format)?.label ?? format;
}

export function getProfileGrade(user: UserFullDto): ProfileGrade {
  const highestExperience = getProfileExperienceLevel(user);
  const base =
    highestExperience === 'senior' ? 78 : highestExperience === 'middle' ? 52 : 28;
  const skillBonus = Math.min(user.skills.length * 4, 16);
  const variation = hashString(user.uniqueName) % 7;
  const value = Math.min(base + skillBonus + variation, 100);
  const level = Math.max(1, Math.round(value / 10));

  return {
    max: 100,
    value,
    level,
    label: `Ур. ${level}`,
  };
}

function hashString(value: string): number {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
}
