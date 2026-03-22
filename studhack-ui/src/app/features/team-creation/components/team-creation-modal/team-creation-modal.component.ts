import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {
  TuiBadge,
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
} from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';
import { startWith } from 'rxjs';

import {
  type EventFullDto,
  type EventFormat,
  type SkillDto,
  type SpecializationDto,
  type UpsertEventRequest,
  type UpsertTeamRequest,
} from '@core/api';

import { TeamPositionFormComponent } from '../team-position-form/team-position-form.component';
import {
  TeamCreationStore,
  type TeamCreationSaveResult,
} from '../../store/team-creation.store';

type TeamCreationEventSource = 'catalog' | 'custom';
type TeamCreationEventSourceControlValue = TeamCreationEventSourceOption | string | null;
type EventControlValue = EventFullDto | string | null;
type EventFormatControlValue = EventFormatOption | string | null;
type SpecializationControlValue = SpecializationDto | string | null;
type SkillControlValue = SkillDto | string | null;

interface TeamCreationEventSourceOption {
  readonly label: string;
  readonly value: TeamCreationEventSource;
}

interface EventFormatOption {
  readonly label: string;
  readonly value: EventFormat;
}

interface TeamPositionFormModel {
  readonly title: FormControl<string>;
  readonly description: FormControl<string>;
  readonly specializationId: FormControl<SpecializationControlValue>;
  readonly requiredSkillId: FormControl<SkillControlValue>;
  readonly filledByExternal: FormControl<boolean>;
}

interface TeamCreationEventBadge {
  readonly appearance: 'neutral' | 'primary' | 'warning';
  readonly label: string;
}

const EVENT_FORMAT_OPTIONS: readonly EventFormatOption[] = [
  { label: 'Оффлайн', value: 'offline' },
  { label: 'Онлайн', value: 'online' },
  { label: 'Гибрид', value: 'hybrid' },
] as const;

const EVENT_SOURCE_OPTIONS: readonly TeamCreationEventSourceOption[] = [
  {
    label: 'Мероприятие из каталога',
    value: 'catalog',
  },
  {
    label: 'Своё мероприятие',
    value: 'custom',
  },
] as const;

@Component({
  selector: 'app-team-creation-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TeamPositionFormComponent,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiChevron,
    TuiComboBox,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiHeader,
    TuiTextfield,
    TuiTitle,
  ],
  providers: [TeamCreationStore],
  templateUrl: './team-creation-modal.component.html',
  styleUrl: './team-creation-modal.component.less',
})
export class TeamCreationModalComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly fixedEventId = input<string | null>(null);
  readonly allowCustomEvent = input(false);
  readonly dismissed = output<void>();
  readonly saved = output<TeamCreationSaveResult>();

  protected readonly store = inject(TeamCreationStore);
  protected readonly eventFormatOptions = EVENT_FORMAT_OPTIONS;
  protected readonly eventSourceOptions = EVENT_SOURCE_OPTIONS;
  protected readonly validationError = signal<string | null>(null);
  protected readonly stringifyEventSource = (
    item: TeamCreationEventSourceControlValue,
  ): string => (typeof item === 'string' ? item : (item?.label ?? ''));
  protected readonly stringifyEvent = (item: EventControlValue): string =>
    typeof item === 'string' ? item : (item?.name ?? '');
  protected readonly stringifyEventFormat = (item: EventFormatControlValue): string =>
    typeof item === 'string' ? item : (item?.label ?? '');
  protected readonly matchEventSource = (
    left: TeamCreationEventSourceControlValue,
    right: TeamCreationEventSourceControlValue,
  ): boolean => this.getEventSourceValue(left) === this.getEventSourceValue(right);
  protected readonly matchEvent = (
    left: EventControlValue,
    right: EventControlValue,
  ): boolean => this.getEventId(left) === this.getEventId(right);
  protected readonly matchEventFormat = (
    left: EventFormatControlValue,
    right: EventFormatControlValue,
  ): boolean => this.getEventFormatValue(left) === this.getEventFormatValue(right);
  protected readonly form = this.formBuilder.group({
    eventSource: this.formBuilder.control<TeamCreationEventSourceControlValue>(
      EVENT_SOURCE_OPTIONS[0],
      this.requireSelection((value: TeamCreationEventSourceControlValue) =>
        this.getEventSourceValue(value),
      ),
    ),
    eventId: this.formBuilder.control<EventControlValue>(
      null,
      this.requireSelection((value: EventControlValue) => this.getEventId(value)),
    ),
    customEventName: this.formBuilder.nonNullable.control(''),
    customEventFormat: this.formBuilder.control<EventFormatControlValue>(
      EVENT_FORMAT_OPTIONS[0],
      this.requireSelection((value: EventFormatControlValue) =>
        this.getEventFormatValue(value),
      ),
    ),
    customEventStartsAt: this.formBuilder.nonNullable.control(
      this.toLocalDateTimeValue(this.addDays(new Date(), 14)),
    ),
    customEventEndsAt: this.formBuilder.nonNullable.control(
      this.toLocalDateTimeValue(this.addDays(new Date(), 15)),
    ),
    name: this.formBuilder.nonNullable.control('', Validators.required),
    description: this.formBuilder.nonNullable.control(''),
    positions: this.formBuilder.array<FormGroup<TeamPositionFormModel>>([
      this.createPositionGroup(),
    ]),
  });
  private readonly eventSource = toSignal(
    this.form.controls.eventSource.valueChanges.pipe(
      startWith(this.form.controls.eventSource.getRawValue()),
    ),
    { initialValue: this.form.controls.eventSource.getRawValue() },
  );
  private readonly selectedEventId = toSignal(
    this.form.controls.eventId.valueChanges.pipe(
      startWith(this.form.controls.eventId.getRawValue()),
    ),
    { initialValue: this.form.controls.eventId.getRawValue() },
  );
  protected readonly usesCustomEvent = computed(
    () =>
      this.allowCustomEvent() &&
      !this.fixedEventId() &&
      this.getEventSourceValue(this.eventSource()) === 'custom',
  );
  protected readonly selectedEvent = computed(() => {
    const eventId =
      this.fixedEventId() ??
      (this.usesCustomEvent() ? null : this.getEventId(this.selectedEventId()));

    return eventId
      ? this.store.events().find((event) => event.id === eventId) ?? null
      : null;
  });

  constructor() {
    effect(() => {
      const fixedEventId = this.fixedEventId();
      const events = this.store.events();
      const fixedEvent = fixedEventId
        ? events.find((event) => event.id === fixedEventId) ?? null
        : null;

      if (fixedEventId) {
        if (fixedEvent && this.getEventId(this.form.controls.eventId.value) !== fixedEventId) {
          this.form.controls.eventId.setValue(fixedEvent, { emitEvent: false });
        }

        if (this.getEventSourceValue(this.form.controls.eventSource.value) !== 'catalog') {
          this.form.controls.eventSource.setValue(EVENT_SOURCE_OPTIONS[0], {
            emitEvent: false,
          });
        }

        return;
      }

      if (
        !events.length ||
        this.usesCustomEvent() ||
        this.getEventId(this.form.controls.eventId.value)
      ) {
        return;
      }

      this.form.controls.eventId.setValue(events[0], { emitEvent: false });
    });

    effect(() => {
      const useCustomEvent = this.usesCustomEvent();

      this.applyEventModeValidators(useCustomEvent);
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.validationError.set(null);
    });
  }

  protected get positions(): FormArray<FormGroup<TeamPositionFormModel>> {
    return this.form.controls.positions;
  }

  protected addPosition(): void {
    this.positions.push(this.createPositionGroup());
  }

  protected removePosition(index: number): void {
    if (this.positions.length <= 1) {
      return;
    }

    this.positions.removeAt(index);
    this.positions.markAsDirty();
  }

  protected submit(): void {
    this.persistTeam(false);
  }

  protected findCandidates(): void {
    this.persistTeam(true);
  }

  protected hasSearchablePositions(): boolean {
    return this.form
      .getRawValue()
      .positions.some((position) => !position.filledByExternal);
  }

  protected readonly eventContextBadges = computed<readonly TeamCreationEventBadge[]>(() => {
    const event = this.selectedEvent();

    if (!event) {
      return [];
    }

    const badges: TeamCreationEventBadge[] = [
      {
        appearance: 'primary',
        label: event.type === 'hackathon' ? 'Хакатон' : 'Мероприятие',
      },
      {
        appearance: 'neutral',
        label: event.location.format === 'offline'
          ? 'Оффлайн'
          : event.location.format === 'online'
            ? 'Онлайн'
            : 'Гибрид',
      },
    ];

    if (event.hackathon) {
      badges.push({
        appearance: 'warning',
        label: `${event.hackathon.minTeamSize}-${event.hackathon.maxTeamSize} участников`,
      });
    }

    return badges;
  });

  private persistTeam(navigateToCandidates: boolean): void {
    this.validationError.set(null);

    if (!this.hasSearchablePositions() && navigateToCandidates) {
      this.validationError.set('Добавьте хотя бы одну открытую роль для поиска кандидатов');

      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const teamPayload = this.buildTeamPayload();
    const customEvent = this.usesCustomEvent() ? this.buildCustomEventPayload() : null;

    if (!teamPayload || (this.usesCustomEvent() && !customEvent)) {
      return;
    }

    this.store.save(teamPayload, {
      customEvent: customEvent ?? undefined,
      onSuccess: (result) => {
        this.saved.emit(result);

        if (navigateToCandidates) {
          const queryParams = this.buildCandidateQueryParams(
            result.team.id,
            result.event?.name ?? result.team.event.name,
          );

          void this.router.navigate(['/profiles'], {
            queryParams,
          });

          return;
        }

        this.dismissed.emit();
      },
    });
  }

  private buildTeamPayload(): UpsertTeamRequest | null {
    const eventId =
      this.fixedEventId() ??
      (this.usesCustomEvent() ? '' : this.getEventId(this.form.controls.eventId.getRawValue()));
    const value = this.form.getRawValue();

    if (!eventId && !this.usesCustomEvent()) {
      this.validationError.set('Выберите мероприятие для команды');

      return null;
    }

    const resolvedEventId = eventId ?? '';

    return {
      eventId: resolvedEventId,
      name: value.name.trim(),
      description: this.toNullable(value.description),
      positions: value.positions.map((position) => ({
        title: position.title.trim(),
        description: this.toNullable(position.description),
        specializationId: this.getSpecializationId(position.specializationId),
        requiredSkillIds: this.getRequiredSkillIds(position.requiredSkillId),
        filledByExternal: position.filledByExternal,
      })),
    };
  }

  private buildCustomEventPayload(): UpsertEventRequest | null {
    const value = this.form.getRawValue();
    const startsAt = this.serializeLocalDateTime(value.customEventStartsAt);
    const endsAt = this.serializeLocalDateTime(value.customEventEndsAt);

    if (!startsAt || !endsAt) {
      this.validationError.set('Укажите корректные дату и время мероприятия');

      return null;
    }

    if (startsAt >= endsAt) {
      this.validationError.set('Дата окончания мероприятия должна быть позже даты начала');

      return null;
    }

    return {
      name: value.customEventName.trim(),
      type: 'other',
      description: null,
      registrationLink: null,
      startsAt,
      endsAt,
      location: {
        format: this.getEventFormatValue(value.customEventFormat) ?? 'offline',
        cityId: null,
        addressText: null,
        venueName: null,
        latitude: null,
        longitude: null,
      },
      stages: [],
      hackathon: null,
    };
  }

  private buildCandidateQueryParams(
    teamId: string,
    eventName: string,
  ): Record<string, string | readonly string[] | boolean> {
    const value = this.form.getRawValue();
    const openPositions = value.positions.filter((position) => !position.filledByExternal);
    const specializations = [
      ...new Set(
        openPositions
          .map((position) => this.getSpecializationId(position.specializationId))
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    const skills = [
      ...new Set(
        openPositions
          .flatMap((position) => this.getRequiredSkillIds(position.requiredSkillId))
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    return {
      teamId,
      teamName: value.name.trim(),
      eventName,
      specializations,
      skills,
      available: true,
    };
  }

  private createPositionGroup(): FormGroup<TeamPositionFormModel> {
    return this.formBuilder.group<TeamPositionFormModel>({
      title: this.formBuilder.nonNullable.control('', Validators.required),
      description: this.formBuilder.nonNullable.control(''),
      specializationId: this.formBuilder.control<SpecializationControlValue>(
        null,
        this.requireSelection((value: SpecializationControlValue) =>
          this.getSpecializationId(value),
        ),
      ),
      requiredSkillId: this.formBuilder.control<SkillControlValue>(
        null,
        this.requireSelection((value: SkillControlValue) => this.getSkillId(value)),
      ),
      filledByExternal: this.formBuilder.nonNullable.control(false),
    });
  }

  private applyEventModeValidators(useCustomEvent: boolean): void {
    this.form.controls.eventId.setValidators(
      useCustomEvent
        ? []
        : [
            this.requireSelection((value: EventControlValue) => this.getEventId(value)),
          ],
    );
    this.form.controls.customEventName.setValidators(
      useCustomEvent ? [Validators.required] : [],
    );
    this.form.controls.customEventStartsAt.setValidators(
      useCustomEvent ? [Validators.required] : [],
    );
    this.form.controls.customEventEndsAt.setValidators(
      useCustomEvent ? [Validators.required] : [],
    );

    this.form.controls.eventId.updateValueAndValidity({ emitEvent: false });
    this.form.controls.customEventName.updateValueAndValidity({ emitEvent: false });
    this.form.controls.customEventStartsAt.updateValueAndValidity({ emitEvent: false });
    this.form.controls.customEventEndsAt.updateValueAndValidity({ emitEvent: false });
  }

  private serializeLocalDateTime(value: string): string | null {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  private toNullable(value: string): string | null {
    const normalizedValue = value.trim();

    return normalizedValue ? normalizedValue : null;
  }

  private requireSelection<T>(
    extractor: (value: T) => string | null,
  ): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl) =>
      extractor(control.value as T) ? null : { requiredSelection: true };
  }

  private getEventSourceValue(value: TeamCreationEventSourceControlValue): TeamCreationEventSource | null {
    return typeof value === 'string' ? null : (value?.value ?? null);
  }

  private getEventId(value: EventControlValue): string | null {
    return typeof value === 'string' ? null : (value?.id ?? null);
  }

  private getEventFormatValue(value: EventFormatControlValue): EventFormat | null {
    return typeof value === 'string' ? null : (value?.value ?? null);
  }

  private getSpecializationId(value: SpecializationControlValue): string | null {
    return typeof value === 'string' ? null : (value?.id ?? null);
  }

  private getSkillId(value: SkillControlValue): string | null {
    return typeof value === 'string' ? null : (value?.id ?? null);
  }

  private getRequiredSkillIds(value: SkillControlValue): readonly string[] {
    const skillId = this.getSkillId(value);

    return skillId ? [skillId] : [];
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);

    next.setDate(next.getDate() + days);
    next.setMinutes(0, 0, 0);
    next.setHours(11, 0, 0, 0);

    return next;
  }

  private toLocalDateTimeValue(date: Date): string {
    const pad = (value: number): string => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
