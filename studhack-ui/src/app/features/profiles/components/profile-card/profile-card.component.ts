import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiLink, TuiSurface } from '@taiga-ui/core';
import { TuiBadge, TuiProgress } from '@taiga-ui/kit';
import { TuiCard } from '@taiga-ui/layout';

import { type UserFullDto } from '@core/api';
import {
  getPrimarySpecializationName,
  getProfileExperienceLabel,
  getProfileGrade,
} from '@shared';

@Component({
  selector: 'app-profile-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TuiButton, TuiCard, TuiBadge, TuiLink, TuiProgress, TuiSurface],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.less',
})
export class ProfileCardComponent {
  readonly user = input.required<UserFullDto>();
  readonly isFavorite = input(false);
  readonly favoriteToggled = output<void>();

  protected readonly primarySpecialization = computed(() =>
    getPrimarySpecializationName(this.user()),
  );
  protected readonly cityLabel = computed(
    () => this.user().cityOfResidence?.name ?? 'Город не указан',
  );
  protected readonly highestExperience = computed(() =>
    getProfileExperienceLabel(this.user()),
  );
  protected readonly grade = computed(() => getProfileGrade(this.user()));
  protected readonly profileLink = computed(
    () => ['/profiles', this.user().id] as const,
  );

  protected toggleFavorite(): void {
    this.favoriteToggled.emit();
  }
}
