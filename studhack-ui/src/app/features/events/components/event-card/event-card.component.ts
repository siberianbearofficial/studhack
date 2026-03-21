import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { type EventFullDto } from '@core/api';

@Component({
  selector: 'app-event-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiHeader,
    TuiTitle,
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.less',
})
export class EventCardComponent {
  readonly event = input.required<EventFullDto>();
}
