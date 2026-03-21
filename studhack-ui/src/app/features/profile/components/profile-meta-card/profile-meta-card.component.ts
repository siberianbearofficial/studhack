import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { type MyProfileDto } from '@core/api';

@Component({
  selector: 'app-profile-meta-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TuiBadge, TuiCard, TuiHeader, TuiTitle],
  templateUrl: './profile-meta-card.component.html',
  styleUrl: './profile-meta-card.component.less',
})
export class ProfileMetaCardComponent {
  readonly profile = input.required<MyProfileDto>();
}
