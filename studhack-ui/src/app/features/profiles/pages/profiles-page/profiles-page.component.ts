import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiLabel, TuiLink, TuiLoader, TuiSurface, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiBadge, TuiCheckbox, TuiPagination } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { ProfilesStore } from '../../store/profiles.store';

interface CandidateSearchContext {
  readonly teamId: string | null;
  readonly teamName: string | null;
  readonly eventName: string | null;
}

@Component({
  selector: 'app-profiles-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ProfileCardComponent,
    TuiButton,
    TuiBadge,
    TuiCard,
    TuiCheckbox,
    TuiHeader,
    TuiLabel,
    TuiPagination,
    TuiTextfield,
    TuiTitle,
    TuiSurface,
    TuiLoader,
    TuiLink,
    RouterLink,
  ],
  providers: [ProfilesStore],
  templateUrl: './profiles-page.component.html',
  styleUrl: './profiles-page.component.less',
})
export class ProfilesPageComponent {
  protected readonly store = inject(ProfilesStore);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  protected readonly searchContext = signal<CandidateSearchContext | null>(null);
  protected readonly preferredTeamId = computed(
    () => this.searchContext()?.teamId ?? null,
  );
  protected readonly profileLinkQueryParams = computed(() => {
    const teamId = this.preferredTeamId();

    return teamId ? { teamId } : null;
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const teamId = this.normalizeParam(params.get('teamId'));
      const teamName = this.normalizeParam(params.get('teamName'));
      const eventName = this.normalizeParam(params.get('eventName'));

      this.store.applyPreset({
        specializationIds: params.getAll('specializations'),
        skillIds: params.getAll('skills'),
        onlyAvailable: params.get('available') === 'true',
      });
      this.searchContext.set(
        teamId || teamName || eventName
          ? {
              teamId,
              teamName,
              eventName,
            }
          : null,
      );
    });
  }

  protected goBack(): void {
    this.location.back();
  }

  private normalizeParam(value: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
