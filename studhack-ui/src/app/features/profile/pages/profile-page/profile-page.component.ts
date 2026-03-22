import { DatePipe, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiDay } from '@taiga-ui/cdk/date-time';
import { TuiRingChart } from '@taiga-ui/addon-charts';
import {
  TuiButton,
  TuiCalendar,
  TuiLink,
  TuiLoader,
  TuiSurface,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiAvatarStack,
  TuiBadge,
  TuiButtonLoading,
  TuiChevron,
  TuiCheckbox,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiProgressBar,
  TuiProgressSegmented,
  TuiTabs,
  TuiTextarea,
  TuiTextareaLimit,
  TuiInputDate,
} from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import {
  type CityDto,
  type EventFullDto,
  type MyProfileDto,
  type SkillDto,
  type SkillExperienceLevel,
  type TeamPositionDto,
  type TeamRequestDto,
  type TeamRequestsFeedDto,
  type UpsertMyProfileRequest,
  type UserShortDto,
} from '@core/api';
import {
  formatEventDateTimeLabel,
  getEventCoverBackground,
  getEventDateSpanLabel,
  getEventLocationDetailsLabel,
  getEventTypeLabel,
  getExperienceLabel,
  getParticipationFormat,
  getParticipationFormatLabel,
  PROFILE_EXPERIENCE_OPTIONS,
  getProfileExperienceLabel,
  getProfileGrade,
  getPrimarySpecializationName,
} from '@shared';

import { ProfileStore } from '../../store/profile.store';
import { TakePipe } from '@shared/pipes/take.pipe';

type ProfileTabId = 'teams' | 'favorites' | 'hackathons' | 'achievements';
type RoleBadgeAppearance = 'positive' | 'warning' | 'negative';
type FavoriteBadgeAppearance = 'primary' | 'info' | 'positive' | 'warning';
type AchievementAppearance = 'neutral' | 'positive' | 'warning';
type CityOption = CityDto;
type SkillOption = SkillDto;
type SkillLevelOption = (typeof PROFILE_EXPERIENCE_OPTIONS)[number];
type BirthDateControlValue = TuiDay | null;
type CityControlValue = CityOption | string | null;
type SkillControlValue = SkillOption | string | null;
type SkillLevelControlValue = SkillLevelOption | string | null;

type SkillForm = FormGroup<{
  skill: FormControl<SkillControlValue>;
  experienceLevel: FormControl<SkillLevelControlValue>;
}>;

type PortfolioLinkForm = FormGroup<{
  id: FormControl<string>;
  url: FormControl<string>;
  description: FormControl<string>;
}>;

interface ProfileTab {
  readonly id: ProfileTabId;
  readonly label: string;
  readonly count: number;
}

interface ProfileHubStat {
  readonly label: string;
  readonly value: string;
}

interface ProfileTeamRoleBadge {
  readonly id: string;
  readonly label: string;
  readonly appearance: RoleBadgeAppearance;
}

interface ProfileTeamRow {
  readonly id: string;
  readonly name: string;
  readonly eventId: string;
  readonly eventName: string;
  readonly roleTitle: string;
  readonly isCaptain: boolean;
  readonly visibleMembers: readonly UserShortDto[];
  readonly overflowMembers: number;
  readonly roleBadges: readonly ProfileTeamRoleBadge[];
  readonly chartValue: readonly number[];
  readonly filledCount: number;
  readonly pendingCount: number;
  readonly openCount: number;
  readonly totalCount: number;
}

interface FavoriteReasonBadge {
  readonly label: string;
  readonly appearance: FavoriteBadgeAppearance;
}

interface FavoriteUserCard {
  readonly id: string;
  readonly displayName: string;
  readonly uniqueName: string;
  readonly avatarUrl: string | null;
  readonly available: boolean;
  readonly cityLabel: string;
  readonly primarySpecialization: string;
  readonly highestExperience: string;
  readonly sharedSkills: readonly string[];
  readonly sharedEventsCount: number;
  readonly reasonBadges: readonly FavoriteReasonBadge[];
  readonly note: string;
  readonly score: number;
}

interface HackathonBadge {
  readonly label: string;
  readonly appearance: FavoriteBadgeAppearance;
}

interface ProfileHackathonCard {
  readonly id: string;
  readonly name: string;
  readonly typeLabel: string;
  readonly dateLabel: string;
  readonly locationLabel: string;
  readonly startsAtLabel: string;
  readonly coverBackground: string;
  readonly badges: readonly HackathonBadge[];
  readonly teamNamesLabel: string;
  readonly openRolesCount: number;
  readonly subscribersCount: number;
}

interface ProfileAchievement {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly value: number;
  readonly max: number;
  readonly metric: string;
  readonly progressLabel: string;
  readonly appearance: AchievementAppearance;
  readonly badge: string;
  readonly completed: boolean;
  readonly progressColor: string;
}

const TEAM_CHART_COLORS = {
  filled: 'var(--tui-status-positive)',
  pending: 'var(--tui-status-warning)',
  open: 'var(--tui-status-negative)',
} as const;

const PROFILE_TAB_LABELS: Record<ProfileTabId, string> = {
  teams: 'Мои команды',
  favorites: 'Избранные пользователи',
  hackathons: 'Мои хакатоны',
  achievements: 'Мои достижения',
};

@Component({
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    TuiAvatar,
    TuiAvatarStack,
    TuiBadge,
    TuiCheckbox,
    TuiButton,
    TuiCard,
    TuiChevron,
    TuiHeader,
    TuiLink,
    TuiLoader,
    TuiProgressBar,
    TuiProgressSegmented,
    TuiRingChart,
    TuiSurface,
    TuiTabs,
    TuiDataListWrapper,
    TuiTextfield,
    TuiInputDate,
    TuiTitle,
    TuiButtonLoading,
    TuiTextarea,
    TuiTextareaLimit,
    TuiComboBox,
    TuiFilterByInputPipe,
    TuiCalendar,
    TakePipe,
  ],
  providers: [ProfileStore],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.less',
})
export class ProfilePageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly location = inject(Location);

  protected readonly getExperienceLabel = getExperienceLabel;
  protected readonly store = inject(ProfileStore);
  protected readonly teamChartColors = TEAM_CHART_COLORS;
  protected readonly editMode = signal(false);
  protected readonly activeTabIndex = signal(0);
  protected readonly skillLevelOptions = PROFILE_EXPERIENCE_OPTIONS;
  protected readonly stringifyCity = (item: CityControlValue): string =>
    typeof item === 'string' ? item : (item?.name ?? '');
  protected readonly stringifySkill = (item: SkillControlValue): string =>
    typeof item === 'string' ? item : (item?.name ?? '');
  protected readonly stringifySkillLevel = (item: SkillLevelControlValue): string =>
    typeof item === 'string' ? item : (item?.label ?? '');
  protected readonly matchCity = (left: CityControlValue, right: CityControlValue): boolean =>
    this.getCityId(left) === this.getCityId(right);
  protected readonly matchSkill = (left: SkillControlValue, right: SkillControlValue): boolean =>
    this.getSkillId(left) === this.getSkillId(right);
  protected readonly matchSkillLevel = (
    left: SkillLevelControlValue,
    right: SkillLevelControlValue,
  ): boolean => this.getSkillLevelValue(left) === this.getSkillLevelValue(right);
  protected readonly form = this.formBuilder.nonNullable.group({
    uniqueName: ['', Validators.required],
    displayName: ['', Validators.required],
    birthDate: this.formBuilder.control<BirthDateControlValue>(null),
    email: ['', Validators.email],
    cityOfResidenceId: this.formBuilder.control<CityControlValue>(null),
    available: [true],
    biography: [''],
    specializations: this.formBuilder.array<FormControl<boolean>>([]),
    skills: this.formBuilder.array<SkillForm>([]),
    portfolioLinks: this.formBuilder.array<PortfolioLinkForm>([]),
  });
  protected readonly grade = computed(() => {
    const me = this.store.me();

    return me ? getProfileGrade(me) : null;
  });
  protected readonly progressPercent = computed(() => {
    const grade = this.grade();

    return grade ? Math.round((grade.value / grade.max) * 100) : 0;
  });
  protected readonly avatarInitials = computed(() => this.getInitials(this.store.me()));
  protected readonly highestExperience = computed(() => {
    const me = this.store.me();

    return me ? getProfileExperienceLabel(me) : 'Пока без стека';
  });
  protected readonly primarySpecialization = computed(() => {
    const me = this.store.me();

    return me ? getPrimarySpecializationName(me) : 'Без специализации';
  });
  protected readonly participationLabel = computed(() => {
    const me = this.store.me();

    return me ? getParticipationFormatLabel(getParticipationFormat(me)) : '';
  });
  protected readonly pendingInvitesCount = computed(() =>
    this.countPending(this.store.teamRequests()?.inbox ?? []),
  );
  protected readonly pendingOutgoingCount = computed(() =>
    this.countPending(this.store.teamRequests()?.outbox ?? []),
  );
  protected readonly pendingManagedCount = computed(() =>
    this.countPending(this.store.teamRequests()?.managedTeams ?? []),
  );
  protected readonly teamIndex = computed(() => {
    const index = new Map<
      string,
      {
        readonly event: EventFullDto;
        readonly team: EventFullDto['teams'][number];
      }
    >();

    for (const event of this.store.events()) {
      for (const team of event.teams) {
        index.set(team.id, { event, team });
      }
    }

    return index;
  });
  protected readonly teamRows = computed<readonly ProfileTeamRow[]>(() => {
    const me = this.store.me();

    if (!me) {
      return [];
    }

    const index = this.teamIndex();

    return me.teams
      .slice()
      .sort((left, right) => left.event.startsAt.localeCompare(right.event.startsAt))
      .map((membership) => {
        const teamEntry = index.get(membership.team.id);
        const team = teamEntry?.team;
        const positions = team?.positions ?? [];
        const filledCount =
          positions.length > 0
            ? positions.filter((position) => this.isPositionFilled(position)).length
            : membership.team.memberCount;
        const pendingCount =
          positions.length > 0
            ? positions.filter((position) => this.hasPendingRequests(position)).length
            : 0;
        const totalCount =
          positions.length > 0
            ? positions.length
            : membership.team.memberCount + membership.team.openPositionsCount;
        const openCount = Math.max(totalCount - filledCount - pendingCount, 0);
        const visibleMembers = team?.members.slice(0, 4).map((member) => member.user) ?? [];
        const overflowMembers = Math.max(
          0,
          (team?.memberCount ?? membership.team.memberCount) - visibleMembers.length,
        );

        return {
          id: membership.team.id,
          name: membership.team.name,
          eventId: membership.event.id,
          eventName: membership.event.name,
          roleTitle: membership.roleTitle,
          isCaptain: membership.isCaptain,
          visibleMembers,
          overflowMembers,
          roleBadges: positions.map((position) => this.toRoleBadge(position)),
          chartValue: [filledCount, pendingCount, openCount],
          filledCount,
          pendingCount,
          openCount,
          totalCount,
        };
      });
  });
  protected readonly favoriteUsers = computed<readonly FavoriteUserCard[]>(() => {
    const me = this.store.me();

    if (!me) {
      return [];
    }

    const meSkillIds = new Set(me.skills.map((skill) => skill.skill.id));
    const meSpecializationIds = new Set(
      me.specializations.map((specialization) => specialization.id),
    );
    const meEventIds = new Set(me.teams.map((team) => team.event.id));
    const requestWeights = new Map<string, number>();

    for (const request of this.getDistinctRequests(this.store.teamRequests())) {
      if (request.user.id === me.id) {
        continue;
      }

      const weight = request.status === 'pending' ? 3 : 1;

      requestWeights.set(request.user.id, (requestWeights.get(request.user.id) ?? 0) + weight);
    }

    return this.store
      .users()
      .filter((user) => user.id !== me.id)
      .map((user) => {
        const sharedSkills = user.skills
          .filter((skill) => meSkillIds.has(skill.skill.id))
          .map((skill) => skill.skill.name);
        const sharedSpecializations = user.specializations.filter((specialization) =>
          meSpecializationIds.has(specialization.id),
        );
        const sharedEventsCount = user.teams.reduce(
          (count, membership) => count + (meEventIds.has(membership.event.id) ? 1 : 0),
          0,
        );
        const requestWeight = requestWeights.get(user.id) ?? 0;
        const score =
          sharedSkills.length * 2 +
          sharedSpecializations.length * 4 +
          sharedEventsCount * 3 +
          requestWeight * 5 +
          (user.available ? 1 : 0);
        const reasonBadges: FavoriteReasonBadge[] = [];

        if (requestWeight) {
          reasonBadges.push({
            label: 'Есть активный контакт',
            appearance: 'warning',
          });
        }

        if (sharedSpecializations.length) {
          reasonBadges.push({
            label: `${sharedSpecializations.length} общих специализации`,
            appearance: 'primary',
          });
        }

        if (sharedSkills.length) {
          reasonBadges.push({
            label: `${sharedSkills.length} общих навыка`,
            appearance: 'info',
          });
        }

        if (!reasonBadges.length && user.available) {
          reasonBadges.push({
            label: 'Открыт к команде',
            appearance: 'positive',
          });
        }

        return {
          id: user.id,
          displayName: user.displayName,
          uniqueName: user.uniqueName,
          avatarUrl: user.avatarUrl ?? null,
          available: user.available,
          cityLabel: user.cityOfResidence?.name ?? 'Город не указан',
          primarySpecialization: getPrimarySpecializationName(user),
          highestExperience: getProfileExperienceLabel(user),
          sharedSkills: sharedSkills.slice(0, 3),
          sharedEventsCount,
          reasonBadges,
          note: requestWeight
            ? 'Есть реальный контекст по приглашениям и заявкам в команды.'
            : sharedEventsCount
              ? 'Пересекаетесь по текущим хакатонам и легко продолжить диалог.'
              : 'Подходит по стеку и специализации для следующих подборов.',
          score,
        } satisfies FavoriteUserCard;
      })
      .filter((user) => user.score > 0 || user.available)
      .sort((left, right) => right.score - left.score)
      .slice(0, 6);
  });
  protected readonly myHackathons = computed<readonly ProfileHackathonCard[]>(() => {
    const me = this.store.me();

    if (!me) {
      return [];
    }

    const membershipsByEvent = new Map<string, ReadonlyArray<MyProfileDto['teams'][number]>>();
    const distinctRequests = this.getDistinctRequests(this.store.teamRequests());
    const rows = this.teamRows();

    for (const membership of me.teams) {
      const current = membershipsByEvent.get(membership.event.id) ?? [];

      membershipsByEvent.set(membership.event.id, [...current, membership]);
    }

    return this.store
      .events()
      .filter((event) => membershipsByEvent.has(event.id) || event.subscription.isSubscribed)
      .sort((left, right) => left.startsAt.localeCompare(right.startsAt))
      .map((event) => {
        const memberships = membershipsByEvent.get(event.id) ?? [];
        const badges: HackathonBadge[] = [];
        const pendingRequests = distinctRequests.filter(
          (request) => request.status === 'pending' && request.team.eventId === event.id,
        ).length;
        const eventRows = rows.filter((row) => row.eventId === event.id);
        const openRolesCount = eventRows.reduce((total, row) => total + row.openCount, 0);

        if (memberships.length) {
          badges.push({
            label: memberships.some((membership) => membership.isCaptain) ? 'Капитан' : 'Участник',
            appearance: 'positive',
          });
        }

        if (event.subscription.isSubscribed) {
          badges.push({
            label: 'Подписка включена',
            appearance: 'primary',
          });
        }

        if (pendingRequests) {
          badges.push({
            label: `${pendingRequests} активных запросов`,
            appearance: 'warning',
          });
        }

        return {
          id: event.id,
          name: event.name,
          typeLabel: getEventTypeLabel(event),
          dateLabel: getEventDateSpanLabel(event),
          locationLabel: getEventLocationDetailsLabel(event),
          startsAtLabel: formatEventDateTimeLabel(event.startsAt),
          coverBackground: getEventCoverBackground(event),
          badges,
          teamNamesLabel: memberships.length
            ? memberships.map((membership) => membership.team.name).join(', ')
            : 'Пока только подписка на обновления',
          openRolesCount,
          subscribersCount: event.subscription.subscribersCount,
        };
      });
  });
  protected readonly achievements = computed<readonly ProfileAchievement[]>(() => {
    const me = this.store.me();

    if (!me) {
      return [];
    }

    const completionParts = [
      Boolean(me.displayName.trim()),
      Boolean(me.birthDate),
      Boolean(me.email),
      Boolean(me.cityOfResidence),
      Boolean(me.biography),
      me.specializations.length > 0,
      me.skills.length >= 3,
      me.portfolioLinks.length >= 1,
      me.educations.length >= 1,
    ];
    const completionValue = completionParts.filter(Boolean).length;
    const captainCount = me.teams.filter((team) => team.isCaptain).length;
    const portfolioCount = me.portfolioLinks.length;
    const skillDepth = me.skills.length;
    const pendingInteractions =
      this.pendingInvitesCount() + this.pendingOutgoingCount() + this.pendingManagedCount();

    return [
      {
        id: 'completion',
        title: 'Профиль собран',
        description:
          'Базовый ориентир по тому, насколько хорошо заполнен профиль для подбора в команды.',
        value: completionValue,
        max: completionParts.length,
        metric: `${completionValue}/${completionParts.length}`,
        progressLabel: `${Math.round((completionValue / completionParts.length) * 100)}% заполнения`,
        appearance: completionValue === completionParts.length ? 'positive' : 'warning',
        badge: completionValue === completionParts.length ? 'Открыто' : 'В процессе',
        completed: completionValue === completionParts.length,
        progressColor:
          completionValue === completionParts.length
            ? 'var(--tui-status-positive)'
            : 'var(--tui-status-warning)',
      },
      {
        id: 'captain',
        title: 'Капитан команды',
        description: 'Открывается, когда вы ведете хотя бы одну команду и управляете ее набором.',
        value: Math.min(captainCount, 1),
        max: 1,
        metric: captainCount ? `${captainCount} команд` : '0 команд',
        progressLabel: captainCount ? 'Уже ведете набор' : 'Еще не открыто',
        appearance: captainCount ? 'positive' : 'neutral',
        badge: captainCount ? 'Открыто' : 'На старте',
        completed: captainCount > 0,
        progressColor: captainCount ? 'var(--tui-status-positive)' : 'var(--tui-border-normal)',
      },
      {
        id: 'portfolio',
        title: 'Портфолио на руках',
        description:
          'Минимальная планка для сильного публичного профиля: хотя бы два кейса с понятным описанием.',
        value: Math.min(portfolioCount, 2),
        max: 2,
        metric: `${portfolioCount}/2`,
        progressLabel: `${portfolioCount} кейса добавлено`,
        appearance: portfolioCount >= 2 ? 'positive' : 'warning',
        badge: portfolioCount >= 2 ? 'Открыто' : 'В процессе',
        completed: portfolioCount >= 2,
        progressColor:
          portfolioCount >= 2 ? 'var(--tui-status-positive)' : 'var(--tui-status-warning)',
      },
      {
        id: 'skill-depth',
        title: 'Стек подтвержден',
        description:
          'Показывает, что профиль выглядит не как набросок, а как реальная рабочая роль.',
        value: Math.min(skillDepth, 5),
        max: 5,
        metric: `${skillDepth}/5`,
        progressLabel: `${skillDepth} навыков в профиле`,
        appearance: skillDepth >= 5 ? 'positive' : 'warning',
        badge: skillDepth >= 5 ? 'Открыто' : 'В процессе',
        completed: skillDepth >= 5,
        progressColor: skillDepth >= 5 ? 'var(--tui-status-positive)' : 'var(--tui-status-warning)',
      },
      {
        id: 'network',
        title: 'На радаре команд',
        description:
          'Считывает реальную активность: входящие приглашения, исходящие заявки и управляемые запросы.',
        value: Math.min(pendingInteractions, 3),
        max: 3,
        metric: `${pendingInteractions}/3`,
        progressLabel: `${pendingInteractions} активных касаний`,
        appearance: pendingInteractions >= 3 ? 'positive' : 'warning',
        badge: pendingInteractions >= 3 ? 'Открыто' : 'В процессе',
        completed: pendingInteractions >= 3,
        progressColor:
          pendingInteractions >= 3 ? 'var(--tui-status-positive)' : 'var(--tui-status-warning)',
      },
    ];
  });
  protected readonly unlockedAchievementsCount = computed(
    () => this.achievements().filter((achievement) => achievement.completed).length,
  );
  protected readonly tabs = computed<readonly ProfileTab[]>(() => [
    {
      id: 'teams',
      label: PROFILE_TAB_LABELS.teams,
      count: this.teamRows().length,
    },
    {
      id: 'favorites',
      label: PROFILE_TAB_LABELS.favorites,
      count: this.favoriteUsers().length,
    },
    {
      id: 'hackathons',
      label: PROFILE_TAB_LABELS.hackathons,
      count: this.myHackathons().length,
    },
    {
      id: 'achievements',
      label: PROFILE_TAB_LABELS.achievements,
      count: this.achievements().length,
    },
  ]);
  protected readonly activeTab = computed<ProfileTabId>(
    () => this.tabs()[this.activeTabIndex()]?.id ?? 'teams',
  );
  protected readonly hubStats = computed<readonly ProfileHubStat[]>(() => [
    {
      label: 'Команд',
      value: String(this.teamRows().length),
    },
    {
      label: 'Контактов в фокусе',
      value: String(this.favoriteUsers().length),
    },
    {
      label: 'Хакатонов',
      value: String(this.myHackathons().length),
    },
    {
      label: 'Ачивок',
      value: String(this.unlockedAchievementsCount()),
    },
  ]);
  private lastAppliedStamp: string | null = null;

  constructor() {
    effect(() => {
      const me = this.store.me();

      if (!me) {
        return;
      }

      const stamp = `${me.id}:${me.updatedAt}`;

      if (this.form.dirty || stamp === this.lastAppliedStamp) {
        return;
      }

      this.applyProfile(me);
      this.lastAppliedStamp = stamp;
    });
  }

  protected get skillsControls(): readonly SkillForm[] {
    return this.form.controls.skills.controls;
  }

  protected get portfolioLinkControls(): readonly PortfolioLinkForm[] {
    return this.form.controls.portfolioLinks.controls;
  }

  protected goBack(): void {
    this.location.back();
  }

  protected startEditing(): void {
    this.editMode.set(true);
  }

  protected cancelEditing(): void {
    const me = this.store.me();

    if (!me) {
      return;
    }

    this.applyProfile(me);
    this.editMode.set(false);
  }

  protected addSkill(): void {
    this.form.controls.skills.push(this.createSkillForm());
    this.form.controls.skills.markAsDirty();
    this.form.markAsDirty();
  }

  protected removeSkill(index: number): void {
    this.form.controls.skills.removeAt(index);
    this.form.controls.skills.markAsDirty();
    this.form.markAsDirty();
  }

  protected addPortfolioLink(): void {
    this.form.controls.portfolioLinks.push(this.createPortfolioLinkForm());
    this.form.controls.portfolioLinks.markAsDirty();
    this.form.markAsDirty();
  }

  protected removePortfolioLink(index: number): void {
    this.form.controls.portfolioLinks.removeAt(index);
    this.form.controls.portfolioLinks.markAsDirty();
    this.form.markAsDirty();
  }

  protected submit(): void {
    const me = this.store.me();

    if (!me) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const skillsMap = new Map<
      string,
      {
        readonly skillId: string;
        readonly experienceLevel: SkillExperienceLevel;
      }
    >();

    for (const skill of value.skills) {
      const skillId = this.getSkillId(skill.skill);

      if (!skillId) {
        continue;
      }

      skillsMap.set(skillId, {
        skillId,
        experienceLevel: this.getSkillLevelValue(skill.experienceLevel) ?? 'junior',
      });
    }

    const payload: UpsertMyProfileRequest = {
      uniqueName: value.uniqueName.trim(),
      displayName: value.displayName.trim(),
      birthDate: this.serializeBirthDate(value.birthDate),
      available: value.available,
      cityOfResidenceId: this.getCityId(value.cityOfResidenceId),
      email: this.toNullable(value.email),
      biography: this.toNullable(value.biography),
      specializationIds: this.store
        .specializations()
        .filter((_, index) => value.specializations[index])
        .map((specialization) => specialization.id),
      skills: [...skillsMap.values()],
      portfolioLinks: value.portfolioLinks
        .map((link) => ({
          id: link.id.trim(),
          url: link.url.trim(),
          description: this.toNullable(link.description),
        }))
        .filter((link) => Boolean(link.url))
        .map((link) => ({
          ...(link.id ? { id: link.id } : {}),
          url: link.url,
          description: link.description,
        })),
      educations: me.educations.map((education) => ({
        id: education.id,
        universityId: education.university.id,
        degree: education.degree,
        faculty: education.faculty ?? null,
        program: education.program ?? null,
        yearStart: education.yearStart ?? null,
        yearEnd: education.yearEnd ?? null,
      })),
    };

    this.store.save(payload, (profile) => {
      this.applyProfile(profile);
      this.lastAppliedStamp = `${profile.id}:${profile.updatedAt}`;
      this.editMode.set(false);
    });
  }

  protected getInitials(user: Pick<UserShortDto, 'displayName' | 'uniqueName'> | null): string {
    const source = user?.displayName?.trim() || user?.uniqueName?.trim();

    if (!source) {
      return 'SH';
    }

    const initials = source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

    return initials || source.slice(0, 2).toUpperCase();
  }

  private applyProfile(profile: MyProfileDto): void {
    this.form.reset(
      {
        uniqueName: profile.uniqueName,
        displayName: profile.displayName,
        birthDate: this.parseBirthDate(profile.birthDate),
        email: profile.email ?? '',
        cityOfResidenceId: profile.cityOfResidence ?? null,
        available: profile.available,
        biography: profile.biography ?? '',
      },
      { emitEvent: false },
    );
    const selectedSpecializationIds = new Set(
      profile.specializations.map((specialization) => specialization.id),
    );

    this.replaceFormArray(
      this.form.controls.specializations,
      this.store
        .specializations()
        .map((specialization) =>
          this.formBuilder.nonNullable.control(selectedSpecializationIds.has(specialization.id)),
        ),
    );
    this.replaceFormArray(
      this.form.controls.skills,
      profile.skills.map((skill) => this.createSkillForm(skill)),
    );
    this.replaceFormArray(
      this.form.controls.portfolioLinks,
      profile.portfolioLinks.map((link) => this.createPortfolioLinkForm(link)),
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private createSkillForm(skill?: MyProfileDto['skills'][number]): SkillForm {
    return new FormGroup({
      skill: new FormControl<SkillControlValue>(this.resolveSkillOption(skill?.skill ?? null)),
      experienceLevel: new FormControl<SkillLevelControlValue>(
        this.resolveSkillLevelOption(skill?.experienceLevel ?? 'junior'),
      ),
    });
  }

  private createPortfolioLinkForm(
    link?: MyProfileDto['portfolioLinks'][number],
  ): PortfolioLinkForm {
    return this.formBuilder.nonNullable.group({
      id: link?.id ?? '',
      url: link?.url ?? '',
      description: link?.description ?? '',
    });
  }

  private replaceFormArray<TControl extends FormControl | FormGroup>(
    formArray: FormArray<TControl>,
    controls: readonly TControl[],
  ): void {
    while (formArray.length) {
      formArray.removeAt(0);
    }

    for (const control of controls) {
      formArray.push(control);
    }
  }

  private isPositionFilled(position: TeamPositionDto): boolean {
    return Boolean(position.user) || position.filledByExternal;
  }

  private hasPendingRequests(position: TeamPositionDto): boolean {
    return (
      !this.isPositionFilled(position) &&
      position.requests.some((request) => request.status === 'pending')
    );
  }

  private toRoleBadge(position: TeamPositionDto): ProfileTeamRoleBadge {
    if (this.isPositionFilled(position)) {
      return {
        id: position.id,
        label: position.title,
        appearance: 'positive',
      };
    }

    if (this.hasPendingRequests(position)) {
      return {
        id: position.id,
        label: position.title,
        appearance: 'warning',
      };
    }

    return {
      id: position.id,
      label: position.title,
      appearance: 'negative',
    };
  }

  private countPending(requests: readonly TeamRequestDto[]): number {
    return requests.filter((request) => request.status === 'pending').length;
  }

  private getDistinctRequests(feed: TeamRequestsFeedDto | null): readonly TeamRequestDto[] {
    if (!feed) {
      return [];
    }

    const distinct = new Map<string, TeamRequestDto>();

    for (const request of [...feed.inbox, ...feed.outbox, ...feed.managedTeams]) {
      distinct.set(request.id, request);
    }

    return [...distinct.values()];
  }

  private resolveCityOption(value: CityOption | string | null): CityOption | null {
    if (!value) {
      return null;
    }

    if (typeof value !== 'string') {
      return this.store.cities().find((city) => city.id === value.id) ?? value;
    }

    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return null;
    }

    return (
      this.store
        .cities()
        .find((city) => city.id === value || city.name.trim().toLowerCase() === normalized) ?? null
    );
  }

  private getCityId(value: CityControlValue): string | null {
    return this.resolveCityOption(value)?.id ?? null;
  }

  private resolveSkillOption(value: SkillOption | string | null): SkillOption | null {
    if (!value) {
      return null;
    }

    if (typeof value !== 'string') {
      return this.store.skills().find((skill) => skill.id === value.id) ?? value;
    }

    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return null;
    }

    return (
      this.store
        .skills()
        .find((skill) => skill.id === value || skill.name.trim().toLowerCase() === normalized) ??
      null
    );
  }

  private getSkillId(value: SkillControlValue): string | null {
    return this.resolveSkillOption(value)?.id ?? null;
  }

  private resolveSkillLevelOption(
    value: SkillLevelOption | SkillExperienceLevel | string | null,
  ): SkillLevelOption | null {
    if (!value) {
      return null;
    }

    if (typeof value !== 'string') {
      return this.skillLevelOptions.find((option) => option.value === value.value) ?? value;
    }

    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return null;
    }

    return (
      this.skillLevelOptions.find(
        (option) => option.value === value || option.label.trim().toLowerCase() === normalized,
      ) ?? null
    );
  }

  private getSkillLevelValue(value: SkillLevelControlValue): SkillExperienceLevel | null {
    return this.resolveSkillLevelOption(value)?.value ?? null;
  }

  private parseBirthDate(value: string | null | undefined): BirthDateControlValue {
    if (!value) {
      return null;
    }

    try {
      return TuiDay.jsonParse(value);
    } catch {
      return null;
    }
  }

  private serializeBirthDate(value: BirthDateControlValue): string | null {
    return value ? value.toJSON() : null;
  }

  private toNullable(value: string): string | null {
    const normalized = value.trim();

    return normalized ? normalized : null;
  }
}
