import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  type AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type ValidationErrors,
} from '@angular/forms';
import { TuiButton, TuiLoader, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {
  TuiBadge,
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiTextarea,
  TuiTextareaLimit,
} from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { TeamRequestsStore } from '@core/data';
import { type TeamRequestDto } from '@core/api';
import { getErrorMessage } from '@shared';

import {
  type InviteTargetOption,
  TeamRequestsService,
} from '../../services/team-requests.service';

type TeamRequestDialogKind = 'application' | 'invitation';
type InviteTargetControlValue = InviteTargetOption | string | null;

@Component({
  selector: 'app-team-request-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiChevron,
    TuiComboBox,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiHeader,
    TuiLoader,
    TuiTextarea,
    TuiTextareaLimit,
    TuiTextfield,
    TuiTitle,
  ],
  templateUrl: './team-request-dialog.component.html',
  styleUrl: './team-request-dialog.component.less',
})
export class TeamRequestDialogComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly teamRequestsService = inject(TeamRequestsService);
  private readonly teamRequestsStore = inject(TeamRequestsStore);
  private readonly destroyRef = inject(DestroyRef);
  private lastInviteTargetsKey: string | null = null;

  readonly kind = input.required<TeamRequestDialogKind>();
  readonly teamName = input<string | null>(null);
  readonly positionTitle = input<string | null>(null);
  readonly teamPositionId = input<string | null>(null);
  readonly invitedUserId = input<string | null>(null);
  readonly invitedUserName = input<string | null>(null);
  readonly preferredTeamId = input<string | null>(null);

  readonly dismissed = output<void>();
  readonly completed = output<TeamRequestDto>();

  protected readonly inviteTargets = signal<readonly InviteTargetOption[]>([]);
  protected readonly isLoadingTargets = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly form = this.formBuilder.group({
    target: this.formBuilder.control<InviteTargetControlValue>(null),
    message: this.formBuilder.nonNullable.control('', Validators.maxLength(300)),
  });

  constructor() {
    effect(() => {
      if (this.kind() !== 'invitation') {
        return;
      }

      const inviteTargetsKey = this.preferredTeamId() ?? '';

      if (inviteTargetsKey === this.lastInviteTargetsKey) {
        return;
      }

      this.lastInviteTargetsKey = inviteTargetsKey;
      this.loadInviteTargets();
    });
  }

  protected readonly title = (): string =>
    this.kind() === 'application' ? 'Запрос в команду' : 'Приглашение в команду';

  protected readonly submitLabel = (): string =>
    this.kind() === 'application'
      ? this.isSubmitting()
        ? 'Отправляем запрос...'
        : 'Отправить запрос'
      : this.isSubmitting()
        ? 'Отправляем приглашение...'
        : 'Отправить приглашение';

  protected readonly subtitle = (): string => {
    if (this.kind() === 'application') {
      const teamName = this.teamName();
      const positionTitle = this.positionTitle();

      if (teamName && positionTitle) {
        return `Команда «${teamName}», роль «${positionTitle}».`;
      }

      return 'Добавьте короткий комментарий для команды.';
    }

    const invitedUserName = this.invitedUserName();

    return invitedUserName
      ? `Пригласите ${invitedUserName} в одну из своих открытых ролей.`
      : 'Выберите роль и добавьте короткое сообщение.';
  };

  protected readonly stringifyInviteTarget = (
    item: InviteTargetControlValue,
  ): string => {
    if (!item || typeof item === 'string') {
      return item ?? '';
    }

    return this.toInviteTargetLabel(item);
  };

  protected readonly matchInviteTarget = (
    left: InviteTargetControlValue,
    right: InviteTargetControlValue,
  ): boolean => this.getInviteTargetId(left) === this.getInviteTargetId(right);

  protected submit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.error.set(null);

    if (this.kind() === 'application') {
      this.submitApplication();

      return;
    }

    this.submitInvitation();
  }

  protected close(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.dismissed.emit();
  }

  protected selectedInviteTarget(): InviteTargetOption | null {
    return this.toInviteTarget(this.form.controls.target.getRawValue());
  }

  protected canSubmit(): boolean {
    if (this.isSubmitting() || this.isLoadingTargets()) {
      return false;
    }

    if (this.kind() === 'application') {
      return Boolean(this.teamPositionId());
    }

    return this.inviteTargets().length > 0 && Boolean(this.selectedInviteTarget());
  }

  private loadInviteTargets(): void {
    this.isLoadingTargets.set(true);
    this.error.set(null);
    this.inviteTargets.set([]);
    this.teamRequestsService
      .getInviteTargets(this.preferredTeamId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (targets) => {
          this.inviteTargets.set(targets);
          this.form.controls.target.setValidators(
            targets.length > 1 ? [this.requireInviteTargetSelection] : [],
          );
          this.form.controls.target.setValue(targets[0] ?? null);
          this.form.controls.target.updateValueAndValidity({
            emitEvent: false,
          });
          this.isLoadingTargets.set(false);
        },
        error: (error: unknown) => {
          this.error.set(
            getErrorMessage(
              error,
              'Не удалось загрузить доступные роли для приглашения',
            ),
          );
          this.isLoadingTargets.set(false);
        },
      });
  }

  private submitApplication(): void {
    const teamPositionId = this.teamPositionId();

    if (!teamPositionId) {
      this.error.set('Роль для запроса не найдена');

      return;
    }

    this.isSubmitting.set(true);
    this.teamRequestsStore
      .createApplication(teamPositionId, this.form.controls.message.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (request) => {
          this.isSubmitting.set(false);
          this.completed.emit(request);
        },
        error: (error: unknown) => {
          this.error.set(
            getErrorMessage(error, 'Не удалось отправить запрос в команду'),
          );
          this.isSubmitting.set(false);
        },
      });
  }

  private submitInvitation(): void {
    const invitedUserId = this.invitedUserId();
    const target = this.selectedInviteTarget();

    this.form.controls.target.markAsTouched();

    if (!invitedUserId) {
      this.error.set('Пользователь для приглашения не найден');

      return;
    }

    if (!target) {
      this.error.set('Выберите роль для приглашения');

      return;
    }

    this.isSubmitting.set(true);
    this.teamRequestsStore
      .createInvitation(
        target.id,
        invitedUserId,
        this.form.controls.message.getRawValue(),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (request) => {
          this.isSubmitting.set(false);
          this.completed.emit(request);
        },
        error: (error: unknown) => {
          this.error.set(
            getErrorMessage(error, 'Не удалось отправить приглашение'),
          );
          this.isSubmitting.set(false);
        },
      });
  }

  private readonly requireInviteTargetSelection = ({
    value,
  }: AbstractControl): ValidationErrors | null =>
    this.toInviteTarget(value as InviteTargetControlValue)
      ? null
      : { required: true };

  private toInviteTargetLabel(target: InviteTargetOption): string {
    const teamName = this.preferredTeamId() ? null : target.teamName;

    return teamName
      ? `${teamName} · ${target.positionTitle}`
      : target.positionTitle;
  }

  private toInviteTarget(value: InviteTargetControlValue): InviteTargetOption | null {
    if (!value || typeof value === 'string') {
      return null;
    }

    return this.inviteTargets().find((target) => target.id === value.id) ?? value;
  }

  private getInviteTargetId(value: InviteTargetControlValue): string | null {
    return typeof value === 'string' ? null : (value?.id ?? null);
  }
}
