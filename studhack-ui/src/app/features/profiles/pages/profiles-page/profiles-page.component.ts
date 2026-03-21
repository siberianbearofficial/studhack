import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiLabel, TuiLink, TuiLoader, TuiSurface, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCheckbox, TuiPagination } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { ProfilesStore } from '../../store/profiles.store';

@Component({
  selector: 'app-profiles-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ProfileCardComponent,
    TuiButton,
    TuiCard,
    TuiCheckbox,
    TuiHeader,
    TuiLabel,
    TuiPagination,
    TuiTextfield,
    TuiTitle,
    TuiSurface,
    TuiLoader,
    TuiLink,
  ],
  providers: [ProfilesStore],
  templateUrl: './profiles-page.component.html',
  styleUrl: './profiles-page.component.less',
})
export class ProfilesPageComponent {
  protected readonly store = inject(ProfilesStore);
  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }
}
