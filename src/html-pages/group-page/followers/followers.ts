import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { paginate } from './paginate';
import { paginationControls } from '../../../shared-components/pagination-controls';
import * as DE from '../../../types/data-error';
import { ContentModel } from '../content-model';
import { FollowerListViewModel } from '../render-as-html/render-followers';

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
