import { computed, inject, Injectable } from '@angular/core';

import {
  DictionariesStore,
  MyProfileStore,
  PublicDataStore,
} from '@core/data';
import {
  type MyProfileDto,
  type UpsertMyProfileRequest,
} from '@core/api';

@Injectable()
export class ProfileStore {
  private readonly dictionariesStore = inject(DictionariesStore);
  private readonly myProfileStore = inject(MyProfileStore);
  private readonly publicDataStore = inject(PublicDataStore);

  readonly events = computed(() => this.publicDataStore.events());
  readonly users = computed(() => this.publicDataStore.users());
  readonly teamRequests = computed(() => this.myProfileStore.teamRequests());
  readonly isLoading = computed(
    () =>
      this.dictionariesStore.isLoading() ||
      this.myProfileStore.isLoading() ||
      this.publicDataStore.isLoading(),
  );
  readonly isSaving = computed(() => this.myProfileStore.isSaving());
  readonly error = computed(
    () =>
      this.myProfileStore.error() ??
      this.dictionariesStore.error() ??
      this.publicDataStore.error(),
  );
  readonly success = computed(() => this.myProfileStore.success());
  readonly me = computed(() => this.myProfileStore.me());
  readonly cities = computed(() => this.dictionariesStore.data()?.cities ?? []);
  readonly skills = computed(() => this.dictionariesStore.data()?.skills ?? []);
  readonly specializations = computed(
    () => this.dictionariesStore.data()?.specializations ?? [],
  );

  load(): void {
    this.dictionariesStore.load();
    this.publicDataStore.load();
    this.myProfileStore.load();
  }

  save(
    payload: UpsertMyProfileRequest,
    onSuccess?: (profile: MyProfileDto) => void,
  ): void {
    this.myProfileStore.save(payload, onSuccess);
  }
}
