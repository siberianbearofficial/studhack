import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCard } from '@taiga-ui/layout';

@Component({
  selector: 'app-landing-metric-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiBadge, TuiCard],
  templateUrl: './landing-metric-card.component.html',
  styleUrl: './landing-metric-card.component.less',
})
export class LandingMetricCardComponent {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly detail = input<string>('');
  readonly badge = input<string>('');
}
