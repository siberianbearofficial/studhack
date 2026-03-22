import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TuiButton, TuiLink, TuiTitle } from '@taiga-ui/core';
import { TuiDialog } from '@taiga-ui/core/components/dialog';
import { TuiBadge, TuiChip, TuiProgress } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { type TeamRequestDto } from '@core/api';
import { TeamRequestDialogComponent } from '@features/team-requests';
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
    TuiDialog,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiChip,
    TuiHeader,
    TuiLink,
    TuiProgress,
    TuiTitle,
    TeamRequestDialogComponent,
  ],
  providers: [PublicProfileStore],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.less',
})
export class UserProfilePageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(PublicProfileStore);
  protected readonly inviteDialogOpen = signal(false);
  protected readonly inviteSuccess = signal<string | null>(null);
  protected readonly preferredTeamId = signal<string | null>(null);

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
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.preferredTeamId.set(this.normalizeParam(params.get('teamId')));
    });

    this.store.load(this.route.snapshot.paramMap.get('userId'));
  }

  protected openInviteDialog(): void {
    this.inviteSuccess.set(null);
    this.inviteDialogOpen.set(true);
  }

  protected closeInviteDialog(): void {
    this.inviteDialogOpen.set(false);
  }

  protected handleInviteCreated(request: TeamRequestDto): void {
    this.inviteSuccess.set(
      `Приглашение отправлено в «${request.team.name}» на роль «${request.teamPosition.title}»`,
    );
    this.closeInviteDialog();
  }

  private normalizeParam(value: string | null): string | null {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : null;
  }
}