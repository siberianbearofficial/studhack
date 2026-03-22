import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiButton, TuiLink, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiChip, TuiProgress } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import {
  getPrimarySpecializationName,
  getProfileExperienceLabel,
  getProfileGrade,
} from '@shared';

import { PublicProfileStore } from '../../store/public-profile.store';

@Component({
  selector: 'app-user-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiChip,
    TuiHeader,
    TuiLink,
    TuiProgress,
    TuiTitle,
  ],
  providers: [PublicProfileStore],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.less',
})
export class UserProfilePageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(PublicProfileStore);

  protected readonly primarySpecialization = computed(() => {
    const user = this.store.user();
    return user ? getPrimarySpecializationName(user) : '';
  });

  protected readonly highestExperience = computed(() => {
    const user = this.store.user();
    return user ? getProfileExperienceLabel(user) : '';
  });

  protected readonly grade = computed(() => {
    const user = this.store.user();
    return user ? getProfileGrade(user) : null;
  });

  constructor() {
    this.store.load(this.route.snapshot.paramMap.get('userId'));
  }
}