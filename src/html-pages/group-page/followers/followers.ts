import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { findFollowers } from './find-followers';
import { paginate } from './paginate';
import { renderFollowers } from './render-followers';
import { paginationControls } from '../../../shared-components/pagination-controls';
import * as DE from '../../../types/data-error';
import { HtmlFragment } from '../../../types/html-fragment';
import { GetAllEvents } from '../../../shared-ports';
import { ContentModel } from '../content-model';

export type Ports = AugmentWithUserDetailsPorts & {
  getAllEvents: GetAllEvents,
};

const pageSize = 10;

export const followers = (
  ports: Ports,
) => (
  contentModel: ContentModel,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(findFollowers(contentModel.group.id)),
  T.map(paginate(contentModel.pageNumber, pageSize)),
  TE.map((pageOfFollowers) => ({
    followerCount: pageOfFollowers.numberOfOriginalItems,
    followers: pipe(
      pageOfFollowers.items,
      augmentWithUserDetails(ports),
    ),
    nextLink: paginationControls(`/groups/${contentModel.group.slug}/followers?`, pageOfFollowers.nextPage),
  })),
  TE.map(renderFollowers),
);
