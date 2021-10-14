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
) => (pageOfFollowers: PartialViewModel) => pipe(
  {
    followerCount: TE.right(pageOfFollowers.numberOfOriginalItems),
    nextPage: TE.right(pageOfFollowers.nextPage),
    followers: pipe(
      pageOfFollowers.items,
      augmentWithUserDetails(ports),
    ),
  },
  sequenceS(TE.ApplyPar),
);

const renderNextLink = (groupSlug: string) => flow(
  O.map((nextPage: number) => `/groups/${groupSlug}/followers?page=${nextPage}`),
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
  group: { id: GroupId, slug: string },
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(findFollowers(group.id)),
  T.map(paginate(pageNumber, pageSize)),
  TE.chain(augmentFollowersWithUserDetails(ports)),
  TE.map((partial) => ({
    ...partial,
    nextLink: renderNextLink(group.slug)(partial.nextPage),
  })),
  TE.map(renderFollowers),
);
