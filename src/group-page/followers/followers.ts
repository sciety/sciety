import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { countFollowersOf } from './count-followers-of';
import { renderFollowers } from './render-followers';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';
import { toUserId, UserId } from '../../types/user-id';

type UserDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
};

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getUserDetails: (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>,
};

export const followers = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  {
    followerCount: pipe(
      ports.getAllEvents,
      T.map(countFollowersOf(group.id)),
      TE.rightTask,
    ),
    followers: pipe(
      process.env.EXPERIMENT_ENABLED === 'true' ? [{
        userId: toUserId('1295307136415735808'),
        listCount: 1,
        followedGroupCount: 13,
      }] : [],
      TE.right,
      TE.chain(TE.traverseArray(
        (partial) => pipe(
          partial.userId,
          ports.getUserDetails,
          TE.map((userDetails) => ({
            ...partial,
            ...userDetails,
            link: `/users/${userDetails.handle}`,
            title: userDetails.displayName,
          })),
        ),
      )),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map(renderFollowers),
);
