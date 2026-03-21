import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';

interface SketchfabViewerApi {
  addEventListener(event: 'viewerready', callback: () => void): void;
  start(callback?: (error: unknown) => void): void;
  setCycleMode(
    cycleMode: 'loopOne' | 'loopAll' | 'one' | 'all',
    callback?: (error: unknown) => void,
  ): void;
  setCurrentAnimationByUID(
    uid: string,
    callback?: (error: unknown) => void,
  ): void;
}

interface SketchfabClientInitOptions {
  autostart?: 0 | 1;
  preload?: 0 | 1;
  transparent?: 0 | 1;
  ui_infos?: 0 | 1;
  ui_controls?: 0 | 1;
  ui_help?: 0 | 1;
  ui_settings?: 0 | 1;
  ui_inspector?: 0 | 1;
  ui_stop?: 0 | 1;
  ui_annotations?: 0 | 1;
  ui_vr?: 0 | 1;
  ui_hint?: 0 | 1;
  ui_watermark?: 0 | 1;
  ui_watermark_link?: 0 | 1;
  scrollwheel?: 0 | 1;
  animation_autoplay?: 0 | 1;
  success(api: SketchfabViewerApi): void;
  error(): void;
}

interface SketchfabClient {
  init(modelUid: string, options: SketchfabClientInitOptions): void;
}

interface SketchfabConstructor {
  new (iframe: HTMLIFrameElement): SketchfabClient;
}

declare global {
  interface Window {
    Sketchfab?: SketchfabConstructor;
  }
}

const MOBILE_MEDIA_QUERY = '(max-width: 767px), (pointer: coarse)';
const SKETCHFAB_VIEWER_API_SRC =
  'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';

@Component({
  selector: 'app-sketchfab-embed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './sketchfab-embed.component.html',
  styleUrl: './sketchfab-embed.component.less',
})
export class SketchfabEmbedComponent {
  public readonly title = input.required<string>();
  public readonly modelUid = input.required<string>();
  public readonly fallbackImageSrc = input<string | null>(null);
  public readonly fallbackImageAlt = input<string>('');
  public readonly preferFallbackOnMobile = input(false);
  public readonly autoplay = input(true);
  public readonly preload = input(true);
  public readonly loopAnimation = input(true);
  public readonly animationUid = input<string | null>(null);
  public readonly interactive = input(false);

  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly iframeElement = signal<HTMLIFrameElement | null>(null);
  private readonly viewerScriptState = signal<'idle' | 'loading' | 'ready' | 'error'>('idle');
  private readonly failedToLoadModel = signal(false);
  private readonly isMobileDevice = signal(false);
  private readonly apiInitialized = signal(false);

  protected readonly shouldRenderFallback = computed(
    () =>
      this.failedToLoadModel() ||
      (this.preferFallbackOnMobile() && this.isMobileDevice() && !!this.fallbackImageSrc()),
  );

  protected readonly shouldRenderFallbackImage = computed(
    () => this.shouldRenderFallback() && !!this.fallbackImageSrc(),
  );

  protected readonly fallbackMessage = computed(() => {
    if (this.failedToLoadModel()) {
      return '3D model failed to load. Please try again later.';
    }

    return '3D model is unavailable on this device.';
  });

  protected readonly safeEmbedUrl = computed<SafeResourceUrl>(() => {
    const url = new URL(`https://sketchfab.com/models/${this.modelUid()}/embed`);

    url.searchParams.set('autostart', this.autoplay() ? '1' : '0');
    url.searchParams.set('preload', this.preload() ? '1' : '0');
    url.searchParams.set('transparent', '1');
    url.searchParams.set('ui_infos', '0');
    url.searchParams.set('ui_controls', '0');
    url.searchParams.set('ui_help', '0');
    url.searchParams.set('ui_settings', '0');
    url.searchParams.set('ui_inspector', '0');
    url.searchParams.set('ui_stop', '0');
    url.searchParams.set('ui_annotations', '0');
    url.searchParams.set('ui_vr', '0');
    url.searchParams.set('ui_hint', '0');
    url.searchParams.set('scrollwheel', '0');

    return this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
  });

  protected readonly fallbackAlt = computed(
    () => this.fallbackImageAlt().trim() || this.title(),
  );

  public constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
      this.isMobileDevice.set(mediaQuery.matches);
      mediaQuery.addEventListener('change', ({ matches }) => {
        this.isMobileDevice.set(matches);
      });
    }

    effect(() => {
      this.modelUid();
      this.failedToLoadModel.set(false);
      this.apiInitialized.set(false);
      this.iframeElement.set(null);
    });

    effect(() => {
      const iframe = this.iframeElement();

      if (
        !iframe ||
        !isPlatformBrowser(this.platformId) ||
        this.shouldRenderFallback() ||
        this.apiInitialized() ||
        this.viewerScriptState() === 'error'
      ) {
        return;
      }

      this.loadViewerApiScript();

      if (this.viewerScriptState() !== 'ready') {
        return;
      }

      const Sketchfab = window.Sketchfab;

      if (!Sketchfab) {
        this.failedToLoadModel.set(true);

        return;
      }

      this.apiInitialized.set(true);

      const client = new Sketchfab(iframe);

      client.init(this.modelUid(), {
        autostart: this.autoplay() ? 1 : 0,
        preload: this.preload() ? 1 : 0,
        transparent: 1,
        ui_infos: 0,
        ui_controls: 0,
        ui_help: 0,
        ui_settings: 0,
        ui_inspector: 0,
        ui_stop: 0,
        ui_annotations: 0,
        ui_vr: 0,
        ui_hint: 0,
        ui_watermark: 0,
        ui_watermark_link: 0,
        scrollwheel: 0,
        animation_autoplay: this.autoplay() ? 1 : 0,
        success: api => {
          api.addEventListener('viewerready', () => {
            const animationUid = this.animationUid();

            if (animationUid) {
              api.setCurrentAnimationByUID(animationUid, () => undefined);
            }

            if (this.loopAnimation()) {
              api.setCycleMode('loopOne', () => undefined);
            }

            if (this.autoplay()) {
              api.start(() => undefined);
            }
          });
        },
        error: () => {
          this.failedToLoadModel.set(true);
        },
      });
    });
  }

  protected setIframeElement(element: HTMLIFrameElement): void {
    this.iframeElement.set(element);
  }

  private loadViewerApiScript(): void {
    const currentState = this.viewerScriptState();

    if (currentState === 'ready' || currentState === 'loading') {
      return;
    }

    if (window.Sketchfab) {
      this.viewerScriptState.set('ready');

      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SKETCHFAB_VIEWER_API_SRC}"]`,
    );

    if (existingScript?.dataset['loaded'] === 'true') {
      this.viewerScriptState.set('ready');

      return;
    }

    this.viewerScriptState.set('loading');

    const script = existingScript ?? document.createElement('script');
    script.src = SKETCHFAB_VIEWER_API_SRC;
    script.async = true;

    script.addEventListener('load', () => {
      script.dataset['loaded'] = 'true';
      this.viewerScriptState.set('ready');
    });

    script.addEventListener('error', () => {
      this.viewerScriptState.set('error');
      this.failedToLoadModel.set(true);
    });

    if (!existingScript) {
      document.head.append(script);
    }
  }
}
