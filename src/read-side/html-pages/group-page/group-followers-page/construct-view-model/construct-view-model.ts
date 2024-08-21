import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails } from './augment-with-user-details';
import { findFollowers } from './find-followers';
import { Params } from './params';
import { constructGroupPagePath } from '../../../../../standards/paths';
import * as DE from '../../../../../types/data-error';
import { ConstructViewModel } from '../../../construct-view-model';
import { paginate, constructDefaultPaginationControls } from '../../../shared-components/pagination';
import { ViewModel } from '../view-model';

const pageSize = 10;

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  E.fromOption(() => DE.notFound),
  E.chain((group) => pipe(
    group.id,
    findFollowers(dependencies),
    paginate(pageSize, params.page),
    E.map((pageOfFollowers) => ({
      header: {
        title: `${group.name} followers`,
        group,
      },
      followerCount: pageOfFollowers.numberOfOriginalItems,
      followers: augmentWithUserDetails(dependencies)(pageOfFollowers.items),
      pagination: constructDefaultPaginationControls(constructGroupPagePath.followers.href(group), pageOfFollowers),
    } satisfies ViewModel)),
  )),
  TE.fromEither,
);
