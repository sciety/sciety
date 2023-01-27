import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { paginate } from './paginate';
import { FollowerListViewModel, renderFollowers } from './render-followers';
import { paginationControls } from '../../../shared-components/pagination-controls';
import * as DE from '../../../types/data-error';
import { HtmlFragment } from '../../../types/html-fragment';
import { ContentModel } from '../content-model';

export type Ports = AugmentWithUserDetailsPorts;

const pageSize = 10;

export const constructFollowersTab = (
  ports: Ports,
) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, FollowerListViewModel> => pipe(
  contentModel.followers,
  paginate(contentModel.pageNumber, pageSize),
  E.map((pageOfFollowers) => ({
    followerCount: pageOfFollowers.numberOfOriginalItems,
    followers: pipe(
      pageOfFollowers.items,
      augmentWithUserDetails(ports),
    ),
    nextLink: paginationControls(`/groups/${contentModel.group.slug}/followers?`, pageOfFollowers.nextPage),
  })),
  TE.fromEither,
);

export const followers = (
  ports: Ports,
) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  contentModel,
  constructFollowersTab(ports),
  TE.map(renderFollowers),
);
