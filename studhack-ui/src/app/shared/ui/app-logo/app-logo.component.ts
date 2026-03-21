import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export type AppLogoMode = 'full' | 'icon';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.less',
})
export class AppLogoComponent {
  readonly mode = input<AppLogoMode>('full');
  readonly title = input('СтудХак');
  readonly size = input(20);

  protected readonly showTitle = computed(() => this.mode() === 'full');
  protected readonly imageAlt = computed(() =>
    this.showTitle() ? '' : this.title(),
  );
  protected readonly ariaLabel = computed(() => this.title());
}
