import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import {
  injectStudhackApiClient,
  type TeamFullDto,
  type TeamRequestDto,
} from '@core/api';

export interface InviteTargetOption {
  readonly id: string;
  readonly teamId: string;
  readonly teamName: string;
  readonly eventName: string;
  readonly positionTitle: string;
}

@Injectable({
  providedIn: 'root',
})
export class TeamRequestsService {
  private readonly api = injectStudhackApiClient();

  createApplication(
    teamPositionId: string,
    message?: string | null,
  ): Observable<TeamRequestDto> {
    return this.api.createTeamRequest({
      teamPositionId,
      type: 'application',
      message: this.toNullableMessage(message),
    });
  }

  createInvitation(
    teamPositionId: string,
    invitedUserId: string,
    message?: string | null,
  ): Observable<TeamRequestDto> {
    return this.api.createTeamRequest({
      teamPositionId,
      type: 'invitation',
      invitedUserId,
      message: this.toNullableMessage(message),
    });
  }

  getInviteTargets(
    preferredTeamId?: string | null,
  ): Observable<readonly InviteTargetOption[]> {
    return forkJoin({
      me: this.api.getMe(),
      teams: this.api.getTeams(),
    }).pipe(
      map(({ me, teams }) => this.buildInviteTargets(me.id, teams, preferredTeamId)),
    );
  }

  private buildInviteTargets(
    currentUserId: string,
    teams: readonly TeamFullDto[],
    preferredTeamId?: string | null,
  ): readonly InviteTargetOption[] {
    const targets = this.collectInviteTargets(
      teams.filter((team) => this.canManageTeam(team, currentUserId)),
    );

    if (!preferredTeamId) {
      return targets;
    }

    const preferredTargets = targets.filter((target) => target.teamId === preferredTeamId);

    return preferredTargets.length ? preferredTargets : targets;
  }

  private collectInviteTargets(
    teams: readonly TeamFullDto[],
  ): readonly InviteTargetOption[] {
    return teams
      .flatMap((team) =>
        team.positions
          .filter((position) => !position.user && !position.filledByExternal)
          .map((position) => ({
            id: position.id,
            teamId: team.id,
            teamName: team.name,
            eventName: team.event.name,
            positionTitle: position.title,
          })),
      )
      .sort((left, right) =>
        `${left.teamName}:${left.positionTitle}`.localeCompare(
          `${right.teamName}:${right.positionTitle}`,
          'ru',
        ),
      );
  }

  private canManageTeam(team: TeamFullDto, currentUserId: string): boolean {
    return (
      team.creator.id === currentUserId || team.captain?.id === currentUserId
    );
  }

  private toNullableMessage(message?: string | null): string | null {
    const normalizedMessage = message?.trim();

    return normalizedMessage ? normalizedMessage : null;
  }
}
