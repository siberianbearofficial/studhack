import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TuiDay } from '@taiga-ui/cdk/date-time';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TuiButton,
  TuiCalendar,
  TuiHint,
  TuiLabel,
  TuiLink,
  TuiLoader,
  TuiSurface,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiButtonLoading,
  TuiChevron,
  TuiCheckbox,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiInputDate,
  TuiTextarea,
  TuiTextareaLimit,
} from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';
import { combineLatest, filter, finalize, map, take } from 'rxjs';

import { DictionariesStore } from '@core/data';
import { AuthService } from '@core/auth';
import {
  type CityDto,
  type DictionariesDto,
  type EducationDegree,
  type SkillDto,
  type UniversityDto,
} from '@core/api';
import {
  CurrentUserService,
  type CurrentUserDto,
  type SaveCurrentUserInput,
} from '@core/current-user';
import { getErrorMessage } from '@shared';
import { TakePipe } from '@shared/pipes/take.pipe';

type BirthDateControlValue = TuiDay | null;
type CityOption = CityDto;
type SkillOption = SkillDto;
type UniversityOption = UniversityDto;
type CityControlValue = CityOption | string | null;
type SkillControlValue = SkillOption | string | null;
type SkillForm = FormGroup<{
  skill: FormControl<SkillControlValue>;
}>;
type PortfolioLinkForm = FormGroup<{
  id: FormControl<string>;
  url: FormControl<string>;
  description: FormControl<string>;
}>;
type UniversityControlValue = UniversityOption | string | null;
type EducationDegreeControlValue = EducationDegreeOption | string | null;
type EducationForm = FormGroup<{
  id: FormControl<string>;
  university: FormControl<UniversityControlValue>;
  degree: FormControl<EducationDegreeControlValue>;
  faculty: FormControl<string>;
  yearStart: FormControl<string>;
  yearEnd: FormControl<string>;
}>;

interface EducationDegreeOption {
  readonly value: EducationDegree;
  readonly label: string;
}

const EDUCATION_DEGREE_OPTIONS: readonly EducationDegreeOption[] = [
  { value: 'bachelor', label: 'Бакалавриат' },
  { value: 'master', label: 'Магистратура' },
  { value: 'postgraduate', label: 'Аспирантура' },
  { value: 'specialist', label: 'Специалитет' },
] as const;

@Component({
  selector: 'app-register-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TuiAvatar,
    TuiButton,
    TuiButtonLoading,
    TuiCalendar,
    TuiCard,
    TuiChevron,
    TuiCheckbox,
    TuiComboBox,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiHeader,
    TuiInputDate,
    TuiLabel,
    TuiLink,
    TuiLoader,
    TuiTextfield,
    TuiTextarea,
    TuiTextareaLimit,
    TuiTitle,
    TuiSurface,
    TuiHint,
    TakePipe,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.less',
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly dictionariesStore = inject(DictionariesStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  protected readonly currentUser = signal<CurrentUserDto | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly educationDegreeOptions = EDUCATION_DEGREE_OPTIONS;
  protected readonly dictionaries = this.dictionariesStore.data;
  protected readonly cities = computed(() => this.dictionaries()?.cities ?? []);
  protected readonly universities = computed(() => this.dictionaries()?.universities ?? []);
  protected readonly skills = computed(() => this.dictionaries()?.skills ?? []);
  protected readonly specializations = computed(() => this.dictionaries()?.specializations ?? []);
  protected readonly stringifyCity = (item: CityControlValue): string =>
    typeof item === 'string' ? item : (item?.name ?? '');
  protected readonly stringifySkill = (item: SkillControlValue): string =>
    typeof item === 'string' ? item : (item?.name ?? '');
  protected readonly stringifyUniversity = (item: UniversityControlValue): string =>
    typeof item === 'string' ? item : (item?.name ?? '');
  protected readonly stringifyEducationDegree = (item: EducationDegreeControlValue): string =>
    typeof item === 'string' ? item : (item?.label ?? '');
  protected readonly matchCity = (left: CityControlValue, right: CityControlValue): boolean =>
    this.getCityId(left) === this.getCityId(right);
  protected readonly matchSkill = (left: SkillControlValue, right: SkillControlValue): boolean =>
    this.getSkillId(left) === this.getSkillId(right);
  protected readonly matchUniversity = (
    left: UniversityControlValue,
    right: UniversityControlValue,
  ): boolean => this.getUniversityId(left) === this.getUniversityId(right);
  protected readonly matchEducationDegree = (
    left: EducationDegreeControlValue,
    right: EducationDegreeControlValue,
  ): boolean => this.getEducationDegreeValue(left) === this.getEducationDegreeValue(right);
  protected readonly avatarInitials = computed(() => this.getInitials(this.currentUser()));
  protected readonly form = this.formBuilder.nonNullable.group({
    uniqueName: ['', Validators.required],
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cityOfResidenceId: this.formBuilder.control<CityControlValue>(null),
    birthDate: this.formBuilder.control<BirthDateControlValue>(null),
    available: [true],
    biography: [''],
    specializations: this.formBuilder.array<FormControl<boolean>>([]),
    skills: this.formBuilder.array<SkillForm>([]),
    portfolioLinks: this.formBuilder.array<PortfolioLinkForm>([]),
    educations: this.formBuilder.array<EducationForm>([]),
  });

  constructor() {
    this.load();
  }

  protected get skillControls(): readonly SkillForm[] {
    return this.form.controls.skills.controls;
  }

  protected get portfolioLinkControls(): readonly PortfolioLinkForm[] {
    return this.form.controls.portfolioLinks.controls;
  }

  protected get educationControls(): readonly EducationForm[] {
    return this.form.controls.educations.controls;
  }

  protected goBack(): void {
    this.location.back();
  }

  protected addSkill(): void {
    this.form.controls.skills.push(this.createSkillForm());
  }

  protected removeSkill(index: number): void {
    this.form.controls.skills.removeAt(index);
  }

  protected addPortfolioLink(): void {
    this.form.controls.portfolioLinks.push(this.createPortfolioLinkForm());
  }

  protected removePortfolioLink(index: number): void {
    this.form.controls.portfolioLinks.removeAt(index);
  }

  protected addEducation(): void {
    this.form.controls.educations.push(this.createEducationForm());
  }

  protected removeEducation(index: number): void {
    this.form.controls.educations.removeAt(index);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.currentUser();

    if (!user) {
      return;
    }

    const value = this.form.getRawValue();
    const payload: SaveCurrentUserInput = {
      uniqueName: value.uniqueName.trim(),
      displayName: value.displayName.trim(),
      birthDate: this.serializeBirthDate(value.birthDate),
      available: value.available,
      cityOfResidenceId: this.getCityId(value.cityOfResidenceId),
      avatarUrl: user.avatarUrl ?? null,
      email: value.email.trim(),
      biography: this.toNullable(value.biography),
      skillIds: [
        ...new Set(
          value.skills
            .map((skill) => this.getSkillId(skill.skill))
            .filter((skillId): skillId is string => Boolean(skillId)),
        ),
      ],
      specializationIds: this.specializations()
        .filter((_, index) => value.specializations[index])
        .map((specialization) => specialization.id),
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
      educations: value.educations
        .map((education) => ({
          id: education.id.trim(),
          universityId: this.getUniversityId(education.university),
          degree: this.getEducationDegreeValue(education.degree),
          faculty: this.toNullable(education.faculty),
          yearStart: this.toNullableNumber(education.yearStart),
          yearEnd: this.toNullableNumber(education.yearEnd),
        }))
        .filter(
          (
            education,
          ): education is {
            readonly id: string;
            readonly universityId: string;
            readonly degree: EducationDegree;
            readonly faculty: string | null;
            readonly yearStart: number | null;
            readonly yearEnd: number | null;
          } => Boolean(education.universityId) && Boolean(education.degree),
        )
        .map((education) => ({
          ...(education.id ? { id: education.id } : {}),
          universityId: education.universityId,
          degree: education.degree,
          faculty: education.faculty,
          yearStart: education.yearStart,
          yearEnd: education.yearEnd,
        })),
    };

    this.error.set(null);
    this.isSaving.set(true);

    this.currentUserService
      .save(payload)
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.auth.completePendingLoginFlow();
          void this.router.navigateByUrl('/profile');
        },
        error: (error: unknown) => {
          this.error.set(getErrorMessage(error, 'Не удалось завершить регистрацию'));
        },
      });
  }

  private load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    combineLatest({
      user: this.currentUserService.load(),
      dictionariesState: toObservable(
        computed(() => ({
          data: this.dictionaries(),
          error: this.dictionariesStore.error(),
          isLoading: this.dictionariesStore.isLoading(),
        })),
      ).pipe(
        filter(
          (
            state,
          ): state is {
            readonly data: DictionariesDto | null;
            readonly error: string | null;
            readonly isLoading: boolean;
          } => Boolean(state.data) || Boolean(state.error && !state.isLoading),
        ),
        take(1),
      ),
    }).subscribe({
      next: ({ user, dictionariesState }) => {
        if (!dictionariesState.data) {
          this.error.set(
            dictionariesState.error ?? 'Не удалось загрузить словари для регистрации',
          );
          this.isLoading.set(false);

          return;
        }

        if (user.id) {
          void this.router.navigateByUrl(this.resolveRequestedReturnUrl('/profile'));
          return;
        }

        this.currentUser.set(user);
        this.replaceSpecializationControls(
          dictionariesState.data.specializations.length,
          user.specializations.map((item) => item.id),
        );
        this.applyCurrentUser(user);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(getErrorMessage(error, 'Не удалось открыть регистрацию'));
        this.isLoading.set(false);
      },
    });
  }

  private applyCurrentUser(user: CurrentUserDto): void {
    this.form.reset(
      {
        uniqueName: user.uniqueName ?? '',
        displayName: user.displayName ?? '',
        email: user.email ?? '',
        cityOfResidenceId: user.cityOfResidence ?? null,
        birthDate: this.parseBirthDate(user.birthDate),
        available: user.available,
        biography: user.biography ?? '',
      },
      { emitEvent: false },
    );

    this.replaceFormArray(
      this.form.controls.skills,
      user.skills.length
        ? user.skills.map((skill) => this.createSkillForm(skill))
        : [this.createSkillForm()],
    );
    this.replaceFormArray(
      this.form.controls.portfolioLinks,
      user.portfolioLinks.length
        ? user.portfolioLinks.map((link) =>
            this.createPortfolioLinkForm(link.id, link.url, link.description ?? ''),
          )
        : [],
    );
    this.replaceFormArray(
      this.form.controls.educations,
      user.educations.length
        ? user.educations.map((education) =>
            this.createEducationForm(
              education.id,
              education.university,
              education.degree,
              education.faculty ?? '',
              education.yearStart ? String(education.yearStart) : '',
              education.yearEnd ? String(education.yearEnd) : '',
            ),
          )
        : [],
    );

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private replaceSpecializationControls(count: number, selectedIds: readonly string[]): void {
    const selected = new Set(selectedIds);

    this.replaceFormArray(
      this.form.controls.specializations,
      Array.from({ length: count }, (_, index) =>
        this.formBuilder.nonNullable.control(selected.has(this.specializations()[index]?.id ?? '')),
      ),
    );
  }

  private replaceFormArray<TControl extends FormControl | FormGroup>(
    array: FormArray<TControl>,
    controls: readonly TControl[],
  ): void {
    array.clear({ emitEvent: false });
    controls.forEach((control) => array.push(control, { emitEvent: false }));
  }

  private createSkillForm(skill: SkillControlValue = null): SkillForm {
    return new FormGroup({
      skill: new FormControl<SkillControlValue>(
        this.resolveSkillOption(skill),
        Validators.required,
      ),
    });
  }

  private createPortfolioLinkForm(id = '', url = '', description = ''): PortfolioLinkForm {
    return this.formBuilder.nonNullable.group({
      id: [id],
      url: [url],
      description: [description],
    });
  }

  private createEducationForm(
    id = '',
    university: UniversityControlValue = null,
    degree: EducationDegreeControlValue = null,
    faculty = '',
    yearStart = '',
    yearEnd = '',
  ): EducationForm {
    return new FormGroup({
      id: this.formBuilder.nonNullable.control(id),
      university: new FormControl<UniversityControlValue>(
        this.resolveUniversityOption(university),
        Validators.required,
      ),
      degree: new FormControl<EducationDegreeControlValue>(
        this.resolveEducationDegreeOption(degree),
        Validators.required,
      ),
      faculty: this.formBuilder.nonNullable.control(faculty),
      yearStart: this.formBuilder.nonNullable.control(yearStart, Validators.required),
      yearEnd: this.formBuilder.nonNullable.control(yearEnd, Validators.required),
    });
  }

  private resolveRequestedReturnUrl(defaultUrl: string): string {
    const requested = this.route.snapshot.queryParamMap.get('returnUrl');

    if (!requested?.startsWith('/') || requested === '/login' || requested === '/register') {
      return defaultUrl;
    }

    return requested;
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

  private toNullableNumber(value: string): number | null {
    const normalized = value.trim();

    return normalized ? Number(normalized) : null;
  }

  private resolveCityOption(value: CityOption | string | null): CityOption | null {
    if (!value) {
      return null;
    }

    if (typeof value !== 'string') {
      return this.cities().find((city) => city.id === value.id) ?? value;
    }

    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return null;
    }

    return (
      this.cities().find(
        (city) => city.id === value || city.name.trim().toLowerCase() === normalized,
      ) ?? null
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
      return this.skills().find((skill) => skill.id === value.id) ?? value;
    }

    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return null;
    }

    return (
      this.skills().find(
        (skill) => skill.id === value || skill.name.trim().toLowerCase() === normalized,
      ) ?? null
    );
  }

  private getSkillId(value: SkillControlValue): string | null {
    return this.resolveSkillOption(value)?.id ?? null;
  }

  private resolveUniversityOption(
    value: UniversityOption | string | null,
  ): UniversityOption | null {
    if (!value) {
      return null;
    }

    if (typeof value !== 'string') {
      return this.universities().find((university) => university.id === value.id) ?? value;
    }

    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return null;
    }

    return (
      this.universities().find(
        (university) =>
          university.id === value || university.name.trim().toLowerCase() === normalized,
      ) ?? null
    );
  }

  private getUniversityId(value: UniversityControlValue): string | null {
    return this.resolveUniversityOption(value)?.id ?? null;
  }

  private resolveEducationDegreeOption(
    value: EducationDegreeOption | EducationDegree | string | null,
  ): EducationDegreeOption | null {
    if (!value) {
      return null;
    }

    if (typeof value !== 'string') {
      return this.educationDegreeOptions.find((option) => option.value === value.value) ?? value;
    }

    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return null;
    }

    return (
      this.educationDegreeOptions.find(
        (option) => option.value === value || option.label.trim().toLowerCase() === normalized,
      ) ?? null
    );
  }

  private getEducationDegreeValue(value: EducationDegreeControlValue): EducationDegree | null {
    return this.resolveEducationDegreeOption(value)?.value ?? null;
  }

  private getInitials(user: Pick<CurrentUserDto, 'displayName' | 'uniqueName'> | null): string {
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
}
