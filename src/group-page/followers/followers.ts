import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { countFollowersOf } from './count-followers-of';
import { findFollowers } from './find-followers';
import { renderFollowers, UserCardViewModel } from './render-followers';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = AugmentWithUserDetailsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

type PartialViewModel = {
  followerCount: number,
  followers: ReadonlyArray<UserCardViewModel>,
};

const paginate = (groupId: GroupId, pageNumber: number) => (partialViewModel: PartialViewModel) => E.right({
  ...partialViewModel,
  nextLink: O.some(`/groups/${groupId}/followers?page=${pageNumber + 1}`),
});

export const followers = (
  ports: Ports,
) => (
  group: { id: GroupId },
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  {
    followerCount: pipe(
      ports.getAllEvents,
      T.map(countFollowersOf(group.id)),
      TE.rightTask,
    ),
    followers: pipe(
      ports.getAllEvents,
      T.map(findFollowers(group.id)),
      TE.rightTask,
      TE.chain(TE.traverseArray(augmentWithUserDetails(ports))),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.chainEitherKW(paginate(group.id, pageNumber)),
  TE.map(renderFollowers),
);
