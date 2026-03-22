import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCard } from '@taiga-ui/layout';

import { type TeamRequestDto } from '@core/api';
import { TeamRequestsStore } from '@core/data';

@Component({
  selector: 'app-notifications-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiBadge, TuiButton, TuiCard, TuiLoader],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.less',
})
export class NotificationsPageComponent {
  protected readonly store = inject(TeamRequestsStore);
  protected readonly incomingInvitations = this.store.incomingInvitations;
  protected readonly managedApplications = this.store.managedApplications;
  protected readonly outgoingApplications = this.store.outgoingApplications;
  protected readonly sentInvitations = this.store.sentInvitations;
  protected readonly hasPendingRequests = computed(
    () => this.store.pendingCount() > 0,
  );

  constructor() {
    this.store.load();
  }

  protected approve(requestId: string): void {
    this.store.approve(requestId).subscribe();
  }

  protected reject(requestId: string): void {
    this.store.reject(requestId).subscribe();
  }

  protected cancel(requestId: string): void {
    this.store.cancel(requestId).subscribe();
  }

  protected isResolving(requestId: string): boolean {
    return this.store.isResolving(requestId);
  }

  protected getRequestHeadline(request: TeamRequestDto): string {
    return `${request.team.name} · ${request.teamPosition.title}`;
  }

  protected getIncomingInvitationDescription(): string {
    return 'Вас пригласили присоединиться к команде.';
  }

  protected getManagedApplicationDescription(request: TeamRequestDto): string {
    return `${request.user.displayName} отправил(а) заявку в команду.`;
  }

  protected getOutgoingApplicationDescription(): string {
    return 'Вы отправили заявку в команду и ждете решения.';
  }

  protected getSentInvitationDescription(request: TeamRequestDto): string {
    return `${request.user.displayName} получил(а) приглашение в команду.`;
  }

  protected getRequestMessage(request: TeamRequestDto): string {
    return request.message?.trim() || 'Без комментария';
  }
}
