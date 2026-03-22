import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TuiAppearance, TuiButton } from '@taiga-ui/core';
import { TuiCard } from '@taiga-ui/layout';
import { ProfileStore } from '@features/profile/store/profile.store';
import { TuiBadge } from '@taiga-ui/kit';

@Component({
  selector: 'app-notifications-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiButton, TuiCard, TuiAppearance, TuiBadge],
  providers: [ProfileStore],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.less',
})
export class NotificationsPageComponent {
  protected readonly store = inject(ProfileStore);

  protected readonly invitations = computed(() => {
    const requests = this.store.teamRequests();
    console.log(requests);
    return requests?.inbox;
  });

  protected readonly applications = computed(() => {
    const requests = this.store.teamRequests();
    return requests?.outbox;
  });
}
