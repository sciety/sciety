import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { findFollowers } from './find-followers';
import { paginate, PartialViewModel } from './paginate';
import { renderFollowers } from './render-followers';
import { DomainEvent } from '../../domain-events';
import { paginationControls } from '../../shared-components/pagination-controls';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type Ports = AugmentWithUserDetailsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const augmentFollowersWithUserDetails = (
  ports: Ports,
) => (partialViewModel: PartialViewModel & { nextPage: O.Option<number> }) => pipe(
  {
    followerCount: TE.right(partialViewModel.followerCount),
    nextPage: TE.right(partialViewModel.nextPage),
    followers: pipe(
      partialViewModel.followers,
      augmentWithUserDetails(ports),
    ),
  },
  sequenceS(TE.ApplyPar),
);

const renderNextLink = (groupId: GroupId) => flow(
  O.map((nextPage: number) => `/groups/${groupId}/followers?page=${nextPage}`),
  O.fold(
    () => '',
    paginationControls,
  ),
  toHtmlFragment,
);

const pageSize = 10;

export const followers = (
  ports: Ports,
) => (
  group: { id: GroupId },
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(findFollowers(group.id)),
  T.map((partial) => ({
    followers: partial,
    followerCount: partial.length,
  })),
  T.map(paginate(pageNumber, pageSize)),
  TE.chain(augmentFollowersWithUserDetails(ports)),
  TE.map((partial) => ({
    ...partial,
    nextLink: renderNextLink(group.id)(partial.nextPage),
  })),
  TE.map(renderFollowers),
);
