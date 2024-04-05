import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { paginate, renderLegacyPaginationControls } from '../../../../shared-components/pagination';
import { augmentWithUserDetails } from './augment-with-user-details';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { findFollowers } from './find-followers';
import { GroupId } from '../../../../types/group-id';
import { Dependencies } from './dependencies';
import { Params } from './params';

const pageSize = 10;

const isFollowing = (dependencies: Dependencies) => (groupId: GroupId, user: Params['user']) => pipe(
  user,
  O.fold(
    () => false,
    (u) => dependencies.isFollowing(groupId)(u.id),
  ),
);

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  E.fromOption(() => DE.notFound),
  E.chain((group) => pipe(
    group.id,
    findFollowers(dependencies),
    paginate(pageSize, params.page),
    E.map((pageOfFollowers) => ({
      group,
      isFollowing: isFollowing(dependencies)(group.id, params.user),
      followerCount: pageOfFollowers.numberOfOriginalItems,
      followers: augmentWithUserDetails(dependencies)(pageOfFollowers.items),
      nextLink: renderLegacyPaginationControls({
        nextPageHref: pipe(
          pageOfFollowers.nextPage,
          O.map(
            (nextPage) => `/groups/${group.slug}/followers?page=${nextPage}`,
          ),
        ),
      }),
    } satisfies ViewModel)),
  )),
  TE.fromEither,
);
