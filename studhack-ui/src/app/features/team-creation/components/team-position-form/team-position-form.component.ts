import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiSurface, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiCheckbox,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
} from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { type SkillDto, type SpecializationDto } from '@core/api';

type SpecializationControlValue = SpecializationDto | string | null;
type SkillControlValue = SkillDto | string | null;

@Component({
  selector: 'app-team-position-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiCard,
    TuiChevron,
    TuiCheckbox,
    TuiComboBox,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiHeader,
    TuiTextfield,
    TuiTitle,
    TuiSurface,
  ],
  templateUrl: './team-position-form.component.html',
  styleUrl: './team-position-form.component.less',
})
export class TeamPositionFormComponent {
  readonly index = input.required<number>();
  readonly form = input.required<FormGroup>();
  readonly specializations = input.required<readonly SpecializationDto[]>();
  readonly skills = input.required<readonly SkillDto[]>();
  readonly canRemove = input(true);
  readonly remove = output<void>();
  protected readonly stringifySpecialization = (
    item: SpecializationControlValue,
  ): string => (typeof item === 'string' ? item : (item?.name ?? ''));
  protected readonly stringifySkill = (item: SkillControlValue): string =>
    typeof item === 'string' ? item : (item?.name ?? '');
  protected readonly matchSpecialization = (
    left: SpecializationControlValue,
    right: SpecializationControlValue,
  ): boolean => this.getSpecializationId(left) === this.getSpecializationId(right);
  protected readonly matchSkill = (
    left: SkillControlValue,
    right: SkillControlValue,
  ): boolean => this.getSkillId(left) === this.getSkillId(right);

  private getSpecializationId(value: SpecializationControlValue): string | null {
    return typeof value === 'string' ? null : (value?.id ?? null);
  }

  private getSkillId(value: SkillControlValue): string | null {
    return typeof value === 'string' ? null : (value?.id ?? null);
  }
}
