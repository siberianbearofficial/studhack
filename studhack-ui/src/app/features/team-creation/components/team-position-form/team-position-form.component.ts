import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiCheckbox } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import {
  type MandatoryPositionDto,
  type SkillDto,
  type SpecializationDto,
} from '@core/api';

@Component({
  selector: 'app-team-position-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiCheckbox,
    TuiHeader,
    TuiTextfield,
    TuiTitle,
  ],
  templateUrl: './team-position-form.component.html',
  styleUrl: './team-position-form.component.less',
})
export class TeamPositionFormComponent {
  readonly index = input.required<number>();
  readonly form = input.required<FormGroup>();
  readonly specializations = input.required<readonly SpecializationDto[]>();
  readonly skills = input.required<readonly SkillDto[]>();
  readonly mandatoryPosition = input<MandatoryPositionDto | null>(null);
  readonly canRemove = input(true);
  readonly remove = output<void>();
}
