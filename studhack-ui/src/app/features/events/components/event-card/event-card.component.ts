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

import { type EventFullDto } from '@core/api';
import {
  getEventCoverBackground,
  getEventDateSpanLabel,
  getEventDifficulty,
  getEventLocationLabel,
  getEventStartsInLabel,
  getEventTypeLabel,
  hasRealCasesTag,
  isHighDifficultyEvent,
} from '@shared';

interface EventCardBadge {
  readonly appearance: 'error' | 'info' | 'success';
  readonly label: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-event-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiLink,
    TuiProgress,
    TuiSurface,
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.less',
})
export class EventCardComponent {
  readonly event = input.required<EventFullDto>();
  readonly isRecommended = input(false);
  readonly isSubscribed = input(false);
  readonly subscribeToggled = output<void>();

  protected readonly coverBackground = computed(() =>
    getEventCoverBackground(this.event()),
  );
  protected readonly coverLabel = computed(() => getEventTypeLabel(this.event()));
  protected readonly coverDate = computed(() => getEventDateSpanLabel(this.event()));
  protected readonly difficulty = computed(() => getEventDifficulty(this.event()));
  protected readonly detailsRoute = computed(
    () => ['/events', this.event().id],
  );
  protected readonly badges = computed<readonly EventCardBadge[]>(() => {
    const event = this.event();
    const badges: EventCardBadge[] = [];

    if (this.isRecommended()) {
      badges.push({ appearance: 'success', label: 'Рекомендуемое', icon: '@tui.circle-check-big' });
    }

    if (isHighDifficultyEvent(event)) {
      badges.push({ appearance: 'error', label: 'Высокая сложность', icon: '@tui.circle-alert' });
    }

    if (hasRealCasesTag(event)) {
      badges.push({ appearance: 'info', label: 'Реальные кейсы', icon: '@tui.file' });
    }

    badges.push({ appearance: 'info', label: getEventLocationLabel(event), icon: '@tui.map-pin' });
    badges.push({ appearance: 'info', label: getEventStartsInLabel(event), icon: '@tui.calendar' });

    return badges;
  });

  protected toggleSubscription(): void {
    this.subscribeToggled.emit();
  }
}
