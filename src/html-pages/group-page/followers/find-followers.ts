import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../domain-events';
import { getGroupIdsFollowedBy } from '../../../shared-read-models/followings-stateless';
import { GroupId } from '../../../types/group-id';
import { Follower } from '../content-model';
import { GetFollowers } from '../../../shared-ports';

export type Ports = {
  getFollowers: GetFollowers,
};

type FindFollowers = (
  ports: Ports,
  groupId: GroupId,
) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Follower>;

export const findFollowers: FindFollowers = (ports, groupId) => (events) => pipe(
  ports.getFollowers(groupId),
  RA.map((userId) => ({
    userId,
    followedGroupCount: pipe(
      events,
      getGroupIdsFollowedBy(userId),
      RA.size,
    ),
    listCount: 1,
  })),
  RA.reverse,
);
