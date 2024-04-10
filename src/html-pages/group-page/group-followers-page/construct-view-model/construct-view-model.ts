import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { paginate } from '../../../shared-components/pagination';
import { augmentWithUserDetails } from './augment-with-user-details';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { findFollowers } from './find-followers';
import { Dependencies } from './dependencies';
import { Params } from './params';

const pageSize = 10;

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

const buildPaginationHref = (path: string, pageNumber: O.Option<number>) => pipe(
  pageNumber,
  O.map((number) => `${path}?page=${number}`),
);

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  E.fromOption(() => DE.notFound),
  E.chain((group) => pipe(
    group.id,
    findFollowers(dependencies),
    paginate(pageSize, params.page),
    E.map((pageOfFollowers) => ({
      title: `${group.name} followers`,
      group,
      followerCount: pageOfFollowers.numberOfOriginalItems,
      followers: augmentWithUserDetails(dependencies)(pageOfFollowers.items),
      pagination: {
        backwardPageHref: buildPaginationHref(`/groups/${group.slug}/followers`, pageOfFollowers.prevPage),
        forwardPageHref: buildPaginationHref(`/groups/${group.slug}/followers`, pageOfFollowers.nextPage),
        page: pageOfFollowers.pageNumber,
        pageCount: pageOfFollowers.numberOfPages,
      },
    } satisfies ViewModel)),
  )),
  TE.fromEither,
);
