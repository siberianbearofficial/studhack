import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { type Params, RouterLink } from '@angular/router';
import { TuiButton, TuiLink, TuiSurface } from '@taiga-ui/core';
import { TuiDialog } from '@taiga-ui/core/components/dialog';
import { TuiBadge, TuiProgress } from '@taiga-ui/kit';
import { TuiCard } from '@taiga-ui/layout';

import { type TeamRequestDto, type UserFullDto } from '@core/api';
import { TeamRequestDialogComponent } from '@features/team-requests';
import {
  getPrimarySpecializationName,
  getProfileExperienceLabel,
  getProfileGrade,
} from '@shared';

@Component({
  selector: 'app-profile-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TuiDialog,
    TuiButton,
    TuiCard,
    TuiBadge,
    TuiLink,
    TuiProgress,
    TuiSurface,
    TeamRequestDialogComponent,
  ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.less',
})
export class ProfileCardComponent {
  readonly user = input.required<UserFullDto>();
  readonly isFavorite = input(false);
  readonly preferredTeamId = input<string | null>(null);
  readonly profileLinkQueryParams = input<Params | null>(null);
  readonly favoriteToggled = output<void>();
  protected readonly inviteDialogOpen = signal(false);
  protected readonly inviteSuccess = signal<string | null>(null);

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

  protected toggleFavorite(): void {
    this.favoriteToggled.emit();
  }
}
