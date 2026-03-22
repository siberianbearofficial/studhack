import { computed, effect, inject, Injectable, signal } from '@angular/core';
import Fuse, { type IFuseOptions } from 'fuse.js';

import { PublicDataStore } from '@core/data';
import { type SkillExperienceLevel, type UserFullDto } from '@core/api';
import {
  getExperienceLabel,
  getParticipationFormat,
  getProfileExperienceLevel,
  PROFILE_EXPERIENCE_OPTIONS,
  PROFILE_PARTICIPATION_OPTIONS,
  type ProfileParticipationFormat,
} from '@shared';

interface FilterOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly count: number;
}

interface ProfilesFilterPreset {
  readonly query?: string;
  readonly specializationIds?: readonly string[];
  readonly skillIds?: readonly string[];
  readonly onlyAvailable?: boolean;
}

const PAGE_SIZE = 6;
const SEARCH_OPTIONS = {
  keys: [
    { name: 'displayName', weight: 0.7 },
    { name: 'biography', weight: 0.3 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 1,
} satisfies IFuseOptions<UserFullDto>;

@Injectable()
export class ProfilesStore {
  private readonly publicDataStore = inject(PublicDataStore);

  readonly users = computed(() => this.publicDataStore.users());
  readonly query = signal('');
  readonly selectedSpecializationIds = signal<readonly string[]>([]);
  readonly selectedSkillIds = signal<readonly string[]>([]);
  readonly selectedFormats = signal<readonly ProfileParticipationFormat[]>([]);
  readonly selectedExperienceLevels = signal<readonly SkillExperienceLevel[]>([]);
  readonly onlyAvailable = signal(false);
  readonly favoriteUserIds = signal<readonly string[]>([]);
  readonly currentPage = signal(0);
  readonly isLoading = computed(() => this.publicDataStore.isLoading());
  readonly error = computed(() => this.publicDataStore.error());
  readonly specializationOptions = computed(() =>
    this.buildOptions(
      this.users(),
      (user) => user.specializations.map((specialization) => ({
        id: specialization.id,
        label: specialization.name,
      })),
    ),
  );
  readonly skillOptions = computed(() =>
    this.buildOptions(
      this.users(),
      (user) =>
        user.skills.map(({ skill }) => ({
          id: skill.id,
          label: skill.name,
        })),
    ),
  );
  readonly formatOptions = computed(() =>
    PROFILE_PARTICIPATION_OPTIONS.map((option) => ({
      ...option,
      count: this.users().filter(
        (user) => getParticipationFormat(user) === option.value,
      ).length,
    })),
  );
  readonly experienceOptions = computed(() =>
    PROFILE_EXPERIENCE_OPTIONS.map((option) => ({
      value: option.value,
      label: getExperienceLabel(option.value),
      count: this.users().filter(
        (user) => getProfileExperienceLevel(user) === option.value,
      ).length,
    })),
  );
  private readonly searchIndex = computed(
    () => new Fuse([...this.users()], SEARCH_OPTIONS),
  );
  private readonly searchedUsers = computed(() => {
    const normalizedQuery = this.query().trim();

    if (!normalizedQuery) {
      return this.users();
    }

    return this.searchIndex()
      .search(normalizedQuery)
      .map(({ item }) => item);
  });
  readonly filteredUsers = computed(() => {
    const specializationIds = this.selectedSpecializationIds();
    const skillIds = this.selectedSkillIds();
    const formats = this.selectedFormats();
    const experienceLevels = this.selectedExperienceLevels();
    const onlyAvailable = this.onlyAvailable();

    return this.searchedUsers().filter((user) => {
      const matchesSpecialization =
        !specializationIds.length ||
        user.specializations.some((specialization) =>
          specializationIds.includes(specialization.id),
        );
      const matchesSkills =
        !skillIds.length ||
        user.skills.some(({ skill }) => skillIds.includes(skill.id));
      const matchesFormat =
        !formats.length || formats.includes(getParticipationFormat(user));
      const matchesExperience =
        !experienceLevels.length ||
        experienceLevels.includes(getProfileExperienceLevel(user));
      const matchesAvailability = !onlyAvailable || user.available;

      return (
        matchesSpecialization &&
        matchesSkills &&
        matchesFormat &&
        matchesExperience &&
        matchesAvailability
      );
    });
  });
  readonly pagedUsers = computed(() => {
    const start = this.currentPage() * PAGE_SIZE;

    return this.filteredUsers().slice(start, start + PAGE_SIZE);
  });
  readonly pageCount = computed(() =>
    Math.ceil(this.filteredUsers().length / PAGE_SIZE),
  );
  readonly availableUsersCount = computed(
    () => this.users().filter((user) => user.available).length,
  );
  readonly favoriteUsersCount = computed(() => this.favoriteUserIds().length);
  readonly activeFiltersCount = computed(() => {
    let count = this.query().trim() ? 1 : 0;

    if (this.selectedSpecializationIds().length) {
      count += 1;
    }

    if (this.selectedSkillIds().length) {
      count += 1;
    }

    if (this.selectedFormats().length) {
      count += 1;
    }

    if (this.selectedExperienceLevels().length) {
      count += 1;
    }

    if (this.onlyAvailable()) {
      count += 1;
    }

    return count;
  });

  constructor() {
    effect(() => {
      this.users();
      this.query();
      this.selectedSpecializationIds();
      this.selectedSkillIds();
      this.selectedFormats();
      this.selectedExperienceLevels();
      this.onlyAvailable();
      this.currentPage.set(0);
    });

    effect(() => {
      const pageCount = this.pageCount();

      if (!pageCount && this.currentPage() !== 0) {
        this.currentPage.set(0);
      }

      if (pageCount && this.currentPage() > pageCount - 1) {
        this.currentPage.set(pageCount - 1);
      }
    });
  }

  load(): void {
    this.publicDataStore.load();
  }

  setQuery(query: string): void {
    this.query.set(query);
  }

  toggleSpecialization(id: string, checked: boolean): void {
    this.selectedSpecializationIds.update((ids) =>
      this.toggleValue(ids, id, checked),
    );
  }

  toggleSkill(id: string, checked: boolean): void {
    this.selectedSkillIds.update((ids) => this.toggleValue(ids, id, checked));
  }

  toggleFormat(format: ProfileParticipationFormat, checked: boolean): void {
    this.selectedFormats.update((formats) =>
      this.toggleValue(formats, format, checked),
    );
  }

  toggleExperienceLevel(
    level: SkillExperienceLevel,
    checked: boolean,
  ): void {
    this.selectedExperienceLevels.update((levels) =>
      this.toggleValue(levels, level, checked),
    );
  }

  toggleFavorite(userId: string): void {
    this.favoriteUserIds.update((ids) =>
      ids.includes(userId)
        ? ids.filter((id) => id !== userId)
        : [...ids, userId],
    );
  }

  isFavorite(userId: string): boolean {
    return this.favoriteUserIds().includes(userId);
  }

  setCurrentPage(index: number): void {
    this.currentPage.set(index);
  }

  setOnlyAvailable(onlyAvailable: boolean): void {
    this.onlyAvailable.set(onlyAvailable);
  }

  applyPreset(preset: ProfilesFilterPreset): void {
    this.query.set(preset.query?.trim() ?? '');
    this.selectedSpecializationIds.set(this.toUniqueValues(preset.specializationIds ?? []));
    this.selectedSkillIds.set(this.toUniqueValues(preset.skillIds ?? []));
    this.onlyAvailable.set(Boolean(preset.onlyAvailable));
    this.currentPage.set(0);
  }

  clearFilters(): void {
    this.query.set('');
    this.selectedSpecializationIds.set([]);
    this.selectedSkillIds.set([]);
    this.selectedFormats.set([]);
    this.selectedExperienceLevels.set([]);
    this.onlyAvailable.set(false);
    this.currentPage.set(0);
  }

  private buildOptions<T extends string>(
    users: readonly UserFullDto[],
    extractor: (
      user: UserFullDto,
    ) => readonly { id: T; label: string }[],
  ): readonly FilterOption<T>[] {
    const counts = new Map<T, FilterOption<T>>();

    for (const user of users) {
      for (const option of extractor(user)) {
        const current = counts.get(option.id);

        counts.set(option.id, {
          value: option.id,
          label: option.label,
          count: (current?.count ?? 0) + 1,
        });
      }
    }

    return [...counts.values()].sort((left, right) =>
      left.label.localeCompare(right.label, 'ru'),
    );
  }

  private toggleValue<T extends string>(
    values: readonly T[],
    value: T,
    checked: boolean,
  ): readonly T[] {
    if (checked) {
      return values.includes(value) ? values : [...values, value];
    }

    return values.filter((item) => item !== value);
  }

  private toUniqueValues<T extends string>(values: readonly T[]): readonly T[] {
    return [...new Set(values)];
  }
}
