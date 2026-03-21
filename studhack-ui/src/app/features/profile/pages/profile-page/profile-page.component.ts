import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiCheckbox } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';

import { type MyProfileDto, type UpsertMyProfileRequest } from '@core/api';

import { ProfileMetaCardComponent } from '../../components/profile-meta-card/profile-meta-card.component';
import { ProfileStore } from '../../store/profile.store';

@Component({
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ProfileMetaCardComponent,
    ReactiveFormsModule,
    RouterLink,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiCheckbox,
    TuiHeader,
    TuiTextfield,
    TuiTitle,
  ],
  providers: [ProfileStore],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.less',
})
export class ProfilePageComponent {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly store = inject(ProfileStore);
  protected readonly form = this.formBuilder.nonNullable.group({
    uniqueName: ['', Validators.required],
    displayName: ['', Validators.required],
    birthDate: [''],
    email: [''],
    cityOfResidenceId: [''],
    available: [true],
    biography: [''],
    specializationIds: this.formBuilder.nonNullable.control<string[]>([]),
  });
  private lastAppliedStamp: string | null = null;

  constructor() {
    effect(() => {
      const me = this.store.me();

      if (!me) {
        return;
      }

      const stamp = `${me.id}:${me.updatedAt}`;

      if (this.form.dirty || stamp === this.lastAppliedStamp) {
        return;
      }

      this.applyProfile(me);
      this.lastAppliedStamp = stamp;
    });
  }

  protected isSpecializationSelected(id: string): boolean {
    return this.form.controls.specializationIds.value.includes(id);
  }

  protected toggleSpecialization(id: string, checked: boolean): void {
    const nextIds = checked
      ? [...this.form.controls.specializationIds.value, id]
      : this.form.controls.specializationIds.value.filter(
          (specializationId) => specializationId !== id,
        );

    this.form.controls.specializationIds.setValue([...new Set(nextIds)]);
    this.form.controls.specializationIds.markAsDirty();
  }

  protected submit(): void {
    const me = this.store.me();

    if (!me) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: UpsertMyProfileRequest = {
      uniqueName: value.uniqueName.trim(),
      displayName: value.displayName.trim(),
      birthDate: this.toNullable(value.birthDate),
      available: value.available,
      cityOfResidenceId: this.toNullable(value.cityOfResidenceId),
      email: this.toNullable(value.email),
      biography: this.toNullable(value.biography),
      specializationIds: value.specializationIds,
      skills: me.skills.map((skill) => ({
        skillId: skill.skill.id,
        experienceLevel: skill.experienceLevel,
      })),
      portfolioLinks: me.portfolioLinks.map((link) => ({
        id: link.id,
        url: link.url,
        description: link.description ?? null,
      })),
      educations: me.educations.map((education) => ({
        id: education.id,
        universityId: education.university.id,
        degree: education.degree,
        faculty: education.faculty ?? null,
        program: education.program ?? null,
        yearStart: education.yearStart ?? null,
        yearEnd: education.yearEnd ?? null,
      })),
    };

    this.store.save(payload, (profile) => {
      this.applyProfile(profile);
      this.lastAppliedStamp = `${profile.id}:${profile.updatedAt}`;
    });
  }

  private applyProfile(profile: MyProfileDto): void {
    this.form.reset(
      {
        uniqueName: profile.uniqueName,
        displayName: profile.displayName,
        birthDate: profile.birthDate ?? '',
        email: profile.email ?? '',
        cityOfResidenceId: profile.cityOfResidence?.id ?? '',
        available: profile.available,
        biography: profile.biography ?? '',
        specializationIds: profile.specializations.map(
          (specialization) => specialization.id,
        ),
      },
      { emitEvent: false },
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private toNullable(value: string): string | null {
    const normalized = value.trim();

    return normalized ? normalized : null;
  }
}
