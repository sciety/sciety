import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { paginate } from './paginate';
import { paginationControls } from '../../../../shared-components/pagination-controls';
import * as DE from '../../../../types/data-error';
import { ContentModel } from '../content-model';
import { FollowersTab } from '../view-model';

export type Ports = AugmentWithUserDetailsPorts;

const pageSize = 10;

export const constructFollowersTab = (
  ports: Ports,
) => (contentModel: ContentModel): E.Either<DE.DataError, FollowersTab> => pipe(
  contentModel.followers,
  paginate(contentModel.pageNumber, pageSize),
  E.map((pageOfFollowers) => ({
    selector: 'followers' as const,
    followerCount: pageOfFollowers.numberOfOriginalItems,
    followers: pipe(
      pageOfFollowers.items,
      augmentWithUserDetails(ports),
    ),
    nextLink: paginationControls(`/groups/${contentModel.group.slug}/followers?`, pageOfFollowers.nextPage),
  })),
);
