import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  TuiButton,
  TuiLabel,
  TuiLink,
  TuiLoader,
  TuiSurface,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiCheckbox,
  TuiInputDateRange,
  TuiPagination,
  TuiRange,
} from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import {
  EVENT_TEAM_SIZE_MAX,
  EVENT_TEAM_SIZE_MIN,
  EVENT_TEAM_SIZE_STEPS,
  formatEventTeamSizeRange,
} from '@shared';

import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventsStore } from '../../store/events.store';

@Component({
  selector: 'app-events-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EventCardComponent,
    FormsModule,
    RouterLink,
    TuiButton,
    TuiCard,
    TuiCheckbox,
    TuiHeader,
    TuiInputDateRange,
    TuiLabel,
    TuiLink,
    TuiLoader,
    TuiPagination,
    TuiRange,
    TuiSurface,
    TuiTextfield,
    TuiTitle,
  ],
  providers: [EventsStore],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.less',
})
export class EventsPageComponent {
  private readonly location = inject(Location);

  protected readonly store = inject(EventsStore);
  protected readonly minTeamSize = EVENT_TEAM_SIZE_MIN;
  protected readonly maxTeamSize = EVENT_TEAM_SIZE_MAX;
  protected readonly teamSizeSteps = EVENT_TEAM_SIZE_STEPS;
  protected readonly teamSizeLabel = computed(() =>
    formatEventTeamSizeRange(this.store.teamSizeRange()),
  );

  protected goBack(): void {
    this.location.back();
  }
}
