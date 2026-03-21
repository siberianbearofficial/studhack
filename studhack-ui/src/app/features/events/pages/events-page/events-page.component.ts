import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiLabel, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiCheckbox } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventsStore } from '../../store/events.store';

@Component({
  selector: 'app-events-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EventCardComponent,
    FormsModule,
    TuiBadge,
    TuiCard,
    TuiCheckbox,
    TuiHeader,
    TuiLabel,
    TuiTextfield,
    TuiTitle,
  ],
  providers: [EventsStore],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.less',
})
export class EventsPageComponent {
  protected readonly store = inject(EventsStore);
}
