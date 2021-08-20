import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { countFollowersOf } from './count-followers-of';
import { findFollowers } from './find-followers';
import { paginate, PartialViewModel } from './paginate';
import { renderFollowers } from './render-followers';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = AugmentWithUserDetailsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const augmentFollowersWithUserDetails = (
  ports: Ports,
) => (partialViewModel: PartialViewModel & { nextLink: O.Option<string> }) => pipe(
  {
    followerCount: TE.right(partialViewModel.followerCount),
    nextLink: TE.right(partialViewModel.nextLink),
    followers: pipe(
      partialViewModel.followers,
      TE.traverseArray(augmentWithUserDetails(ports)),
    ),
  },
  sequenceS(TE.ApplyPar),
);

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
    ),
    followers: pipe(
      ports.getAllEvents,
      T.map(findFollowers(group.id)),
    ),
  },
  sequenceS(T.ApplyPar),
  T.map(paginate(group.id, pageNumber)),
  TE.chain(augmentFollowersWithUserDetails(ports)),
  TE.map(renderFollowers),
);
