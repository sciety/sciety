import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { findFollowers } from './find-followers';
import { paginate } from './paginate';
import { renderFollowers } from './render-followers';
import { DomainEvent } from '../../../domain-events';
import { paginationControls } from '../../../shared-components/pagination-controls';
import * as DE from '../../../types/data-error';
import { GroupId } from '../../../types/group-id';
import { HtmlFragment } from '../../../types/html-fragment';

export type Ports = AugmentWithUserDetailsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

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
  TE.map((pageOfFollowers) => ({
    followerCount: pageOfFollowers.numberOfOriginalItems,
    followers: pipe(
      pageOfFollowers.items,
      augmentWithUserDetails(ports),
    ),
    nextLink: paginationControls(`/groups/${group.slug}/followers?`, pageOfFollowers.nextPage),
  })),
  TE.map(renderFollowers),
);
