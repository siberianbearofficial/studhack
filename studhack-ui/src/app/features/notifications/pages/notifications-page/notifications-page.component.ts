import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-notifications-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TuiButton, TuiCard, TuiHeader, TuiTitle],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.less',
})
export class NotificationsPageComponent {}
