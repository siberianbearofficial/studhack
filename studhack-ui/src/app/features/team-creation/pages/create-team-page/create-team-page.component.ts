import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiButton, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';
import { startWith } from 'rxjs';

import {
  type EventFullDto,
  type MandatoryPositionDto,
  type TeamFullDto,
  type UpsertTeamRequest,
} from '@core/api';

import { TeamPositionFormComponent } from '../../components/team-position-form/team-position-form.component';
import { TeamCreationStore } from '../../store/team-creation.store';

interface TeamPositionFormModel {
  readonly title: FormControl<string>;
  readonly description: FormControl<string>;
  readonly mandatoryPositionId: FormControl<string | null>;
  readonly specializationId: FormControl<string>;
  readonly requiredSkillId: FormControl<string>;
  readonly filledByExternal: FormControl<boolean>;
}

@Component({
  selector: 'app-create-team-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TeamPositionFormComponent,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiHeader,
    TuiTextfield,
    TuiTitle,
  ],
  providers: [TeamCreationStore],
  templateUrl: './create-team-page.component.html',
  styleUrl: './create-team-page.component.less',
})
export class CreateTeamPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(TeamCreationStore);
  protected readonly form = this.formBuilder.nonNullable.group({
    eventId: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    positions: this.formBuilder.array<FormGroup<TeamPositionFormModel>>([]),
  });
  private readonly selectedEventId = toSignal(
    this.form.controls.eventId.valueChanges.pipe(
      startWith(this.form.controls.eventId.value),
    ),
    { initialValue: this.form.controls.eventId.value },
  );
  protected readonly selectedEvent = computed(
    () =>
      this.store.events().find((event) => event.id === this.selectedEventId()) ?? null,
  );
  protected readonly mandatoryPositions = computed(
    () => this.selectedEvent()?.hackathon?.mandatoryPositions ?? [],
  );

  constructor() {
    effect(() => {
      const events = this.store.events();
      const requestedEventId = this.route.snapshot.queryParamMap.get('eventId');

      if (!events.length || this.form.controls.eventId.value) {
        return;
      }

      const matchingEvent = requestedEventId
        ? events.find((event) => event.id === requestedEventId)
        : null;

      this.form.controls.eventId.setValue(matchingEvent?.id ?? events[0].id);
    });

    this.form.controls.eventId.valueChanges
      .pipe(
        startWith(this.form.controls.eventId.value),
        takeUntilDestroyed(),
      )
      .subscribe((eventId) => {
        const event = this.store.events().find((item) => item.id === eventId);

        if (event) {
          this.seedPositions(event);
        }
      });
  }

  protected get positions(): FormArray<FormGroup<TeamPositionFormModel>> {
    return this.form.controls.positions;
  }

  protected addCustomPosition(): void {
    this.positions.push(this.createPositionGroup());
  }

  protected removePosition(index: number): void {
    if (this.positions.length <= 1) {
      return;
    }

    this.positions.removeAt(index);
    this.positions.markAsDirty();
  }

  protected getMandatoryPosition(positionId: string | null): MandatoryPositionDto | null {
    if (!positionId) {
      return null;
    }

    return (
      this.mandatoryPositions().find((position) => position.id === positionId) ?? null
    );
  }

  protected resetToSelectedEventTemplate(): void {
    const event = this.selectedEvent();

    if (!event) {
      return;
    }

    this.seedPositions(event);
  }

  protected submit(): void {
    const event = this.selectedEvent();

    if (!event || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: UpsertTeamRequest = {
      eventId: value.eventId,
      name: value.name.trim(),
      description: this.toNullable(value.description),
      positions: value.positions.map((position) =>
        position.mandatoryPositionId
          ? {
              title: position.title.trim(),
              description: this.toNullable(position.description),
              mandatoryPositionId: position.mandatoryPositionId,
              filledByExternal: position.filledByExternal,
            }
          : {
              title: position.title.trim(),
              description: this.toNullable(position.description),
              specializationId: position.specializationId,
              requiredSkillIds: [position.requiredSkillId],
              filledByExternal: position.filledByExternal,
            },
      ),
    };

    this.store.save(payload, (team) => this.resetAfterSave(team));
  }

  private seedPositions(event: EventFullDto): void {
    this.positions.clear();

    if (event.hackathon?.mandatoryPositions.length) {
      event.hackathon.mandatoryPositions.forEach((position) =>
        this.positions.push(this.createPositionGroup(position)),
      );
    } else {
      this.positions.push(this.createPositionGroup());
    }

    this.positions.markAsPristine();
  }

  private createPositionGroup(
    mandatoryPosition?: MandatoryPositionDto,
  ): FormGroup<TeamPositionFormModel> {
    const specializationId = mandatoryPosition?.specialization.id ?? '';
    const requiredSkillId = mandatoryPosition?.requiredSkills[0]?.id ?? '';
    const group = this.formBuilder.group<TeamPositionFormModel>({
      title: this.formBuilder.nonNullable.control(
        mandatoryPosition?.title ?? '',
        Validators.required,
      ),
      description: this.formBuilder.nonNullable.control(''),
      mandatoryPositionId: this.formBuilder.control(mandatoryPosition?.id ?? null),
      specializationId: this.formBuilder.nonNullable.control(
        specializationId,
        mandatoryPosition ? [] : [Validators.required],
      ),
      requiredSkillId: this.formBuilder.nonNullable.control(
        requiredSkillId,
        mandatoryPosition ? [] : [Validators.required],
      ),
      filledByExternal: this.formBuilder.nonNullable.control(false),
    });

    if (mandatoryPosition) {
      group.controls.specializationId.disable({ emitEvent: false });
      group.controls.requiredSkillId.disable({ emitEvent: false });
    }

    return group;
  }

  private resetAfterSave(team: TeamFullDto): void {
    this.form.controls.name.reset('');
    this.form.controls.description.reset('');
    this.resetToSelectedEventTemplate();
    this.form.markAsPristine();
    this.form.markAsUntouched();

    if (team.event.id !== this.form.controls.eventId.value) {
      this.form.controls.eventId.setValue(team.event.id);
    }
  }

  private toNullable(value: string): string | null {
    const normalized = value.trim();

    return normalized ? normalized : null;
  }
}
