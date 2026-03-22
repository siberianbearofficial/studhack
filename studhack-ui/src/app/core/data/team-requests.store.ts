import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { EMPTY, type Observable, catchError, finalize, tap } from 'rxjs';

import {
  type TeamRequestDto,
  type TeamRequestsFeedDto,
  type TeamRequestStatus,
} from '@core/api';
import { AuthService } from '@core/auth';
import { getErrorMessage } from '@shared';
import { TeamRequestsService } from '@features/team-requests/services/team-requests.service';

import { MyProfileStore } from './my-profile.store';

type ResolvedTeamRequestStatus = Extract<
  TeamRequestStatus,
  'approved' | 'rejected' | 'cancelled'
>;

const EMPTY_FEED: TeamRequestsFeedDto = {
  inbox: [],
  outbox: [],
  managedTeams: [],
};

@Injectable({
  providedIn: 'root',
})
export class TeamRequestsStore {
  private readonly auth = inject(AuthService);
  private readonly myProfileStore = inject(MyProfileStore);
  private readonly service = inject(TeamRequestsService);

  readonly feed = signal<TeamRequestsFeedDto | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pendingActionIds = signal<readonly string[]>([]);

  readonly inbox = computed(() => this.feed()?.inbox ?? EMPTY_FEED.inbox);
  readonly outbox = computed(() => this.feed()?.outbox ?? EMPTY_FEED.outbox);
  readonly managedTeams = computed(
    () => this.feed()?.managedTeams ?? EMPTY_FEED.managedTeams,
  );
  readonly incomingInvitations = computed(() =>
    this.sortRequests(
      this.inbox().filter((request) => request.status === 'pending'),
    ),
  );
  readonly outgoingApplications = computed(() =>
    this.sortRequests(
      this.outbox().filter(
        (request) =>
          request.type === 'application' && request.status === 'pending',
      ),
    ),
  );
  readonly sentInvitations = computed(() =>
    this.sortRequests(
      this.managedTeams().filter(
        (request) =>
          request.type === 'invitation' &&
          request.status === 'pending' &&
          request.user.id !== this.myProfileStore.me()?.id,
      ),
    ),
  );
  readonly managedApplications = computed(() => {
    const outgoingIds = new Set(this.outbox().map((request) => request.id));

    return this.sortRequests(
      this.managedTeams().filter(
        (request) =>
          request.type === 'application' &&
          request.status === 'pending' &&
          !outgoingIds.has(request.id),
      ),
    );
  });
  readonly pendingRequests = computed(() => {
    const requests = new Map<string, TeamRequestDto>();

    for (const request of [
      ...this.incomingInvitations(),
      ...this.outgoingApplications(),
      ...this.sentInvitations(),
      ...this.managedApplications(),
    ]) {
      requests.set(request.id, request);
    }

    return this.sortRequests([...requests.values()]);
  });
  readonly pendingCount = computed(() => this.pendingRequests().length);

  constructor() {
    effect(() => {
      if (!this.auth.isAuthenticated()) {
        this.clear();

        return;
      }

      if (!this.myProfileStore.hasProfile()) {
        if (!this.myProfileStore.isLoading()) {
          this.clear();
        }

        return;
      }

      this.load();
    });
  }

  load(options?: { readonly force?: boolean }): void {
    if (!this.auth.isAuthenticated()) {
      this.clear();

      return;
    }

    if (!this.myProfileStore.hasProfile()) {
      return;
    }

    if (this.isLoading()) {
      return;
    }

    if (this.feed() && !options?.force) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.service.getFeed().subscribe({
      next: (feed) => {
        this.feed.set(feed);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(
          getErrorMessage(error, 'Не удалось загрузить уведомления'),
        );
        this.isLoading.set(false);
      },
    });
  }

  createApplication(
    teamPositionId: string,
    message?: string | null,
  ): Observable<TeamRequestDto> {
    return this.service.createApplication(teamPositionId, message).pipe(
      tap((request) => {
        this.feed.update((feed) => this.appendCreatedRequest(feed, request));
      }),
    );
  }

  createInvitation(
    teamPositionId: string,
    invitedUserId: string,
    message?: string | null,
  ): Observable<TeamRequestDto> {
    return this.service
      .createInvitation(teamPositionId, invitedUserId, message)
      .pipe(
        tap((request) => {
          this.feed.update((feed) => this.appendCreatedRequest(feed, request));
        }),
      );
  }

  approve(requestId: string): Observable<TeamRequestDto> {
    return this.resolve(
      requestId,
      'approved',
      'Не удалось принять запрос в команду',
    );
  }

  reject(requestId: string): Observable<TeamRequestDto> {
    return this.resolve(
      requestId,
      'rejected',
      'Не удалось отклонить запрос в команду',
    );
  }

  cancel(requestId: string): Observable<TeamRequestDto> {
    return this.resolve(
      requestId,
      'cancelled',
      'Не удалось отменить запрос в команду',
    );
  }

  isResolving(requestId: string): boolean {
    return this.pendingActionIds().includes(requestId);
  }

  clear(): void {
    this.feed.set(null);
    this.isLoading.set(false);
    this.error.set(null);
    this.pendingActionIds.set([]);
  }

  private resolve(
    requestId: string,
    status: ResolvedTeamRequestStatus,
    fallbackMessage: string,
  ): Observable<TeamRequestDto> {
    if (this.isResolving(requestId)) {
      return EMPTY;
    }

    this.pendingActionIds.update((ids) => [...ids, requestId]);
    this.error.set(null);

    return this.service.resolveRequest(requestId, status).pipe(
      tap((request) => {
        this.feed.update((feed) => this.applyResolvedRequest(feed, request));
      }),
      catchError((error: unknown) => {
        this.error.set(getErrorMessage(error, fallbackMessage));

        return EMPTY;
      }),
      finalize(() => {
        this.pendingActionIds.update((ids) =>
          ids.filter((id) => id !== requestId),
        );
      }),
    );
  }

  private appendCreatedRequest(
    feed: TeamRequestsFeedDto | null,
    request: TeamRequestDto,
  ): TeamRequestsFeedDto {
    const currentFeed = feed ?? EMPTY_FEED;

    return {
      inbox: currentFeed.inbox,
      outbox:
        request.type === 'application'
          ? this.upsertRequest(currentFeed.outbox, request)
          : currentFeed.outbox,
      managedTeams:
        request.type === 'invitation'
          ? this.upsertRequest(currentFeed.managedTeams, request)
          : currentFeed.managedTeams,
    };
  }

  private applyResolvedRequest(
    feed: TeamRequestsFeedDto | null,
    request: TeamRequestDto,
  ): TeamRequestsFeedDto | null {
    if (!feed) {
      return feed;
    }

    const resolvedFeed: TeamRequestsFeedDto = {
      inbox: this.replaceRequest(feed.inbox, request),
      outbox: this.replaceRequest(feed.outbox, request),
      managedTeams: this.replaceRequest(feed.managedTeams, request),
    };

    if (request.status !== 'approved') {
      return resolvedFeed;
    }

    return {
      inbox: this.rejectSiblingRequests(resolvedFeed.inbox, request),
      outbox: this.rejectSiblingRequests(resolvedFeed.outbox, request),
      managedTeams: this.rejectSiblingRequests(
        resolvedFeed.managedTeams,
        request,
      ),
    };
  }

  private upsertRequest(
    requests: readonly TeamRequestDto[],
    request: TeamRequestDto,
  ): readonly TeamRequestDto[] {
    const hasRequest = requests.some((item) => item.id === request.id);

    return this.sortRequests(
      hasRequest
        ? requests.map((item) => (item.id === request.id ? request : item))
        : [request, ...requests],
    );
  }

  private replaceRequest(
    requests: readonly TeamRequestDto[],
    request: TeamRequestDto,
  ): readonly TeamRequestDto[] {
    if (!requests.some((item) => item.id === request.id)) {
      return requests;
    }

    return this.sortRequests(
      requests.map((item) => (item.id === request.id ? request : item)),
    );
  }

  private rejectSiblingRequests(
    requests: readonly TeamRequestDto[],
    resolvedRequest: TeamRequestDto,
  ): readonly TeamRequestDto[] {
    return this.sortRequests(
      requests.map((request) =>
        request.id !== resolvedRequest.id &&
        request.teamPosition.id === resolvedRequest.teamPosition.id &&
        request.status === 'pending'
          ? {
              ...request,
              status: 'rejected',
              resolvedAt: resolvedRequest.resolvedAt ?? request.resolvedAt ?? null,
            }
          : request,
      ),
    );
  }

  private sortRequests(
    requests: readonly TeamRequestDto[],
  ): readonly TeamRequestDto[] {
    return requests
      .slice()
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
}
