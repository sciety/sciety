import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import { constructContent } from './construct-content';
import { Params } from './params';
import { constructFeaturedLists } from './construct-featured-lists';

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  O.map((group) => ({
    group,
    isFollowing: pipe(
      params.user,
      O.fold(
        () => false,
        (u) => dependencies.isFollowing(group.id)(u.id),
      ),
    ),
    followerCount: pipe(
      dependencies.getFollowers(group.id),
      RA.size,
    ),
    groupAboutPageHref: `/groups/${group.slug}/about`,
    groupListsPageHref: O.some(`/groups/${group.slug}/lists`),
    groupFollowersPageHref: `/groups/${group.slug}/followers`,
  })),
  TE.fromOption(() => DE.notFound),
  TE.chain((partial) => pipe(
    constructContent(dependencies, partial.group, 10, params.page),
    TE.map((content) => ({
      ...partial,
      featuredLists: constructFeaturedLists(dependencies, partial.group.id),
      content,
    })),
  )),
);
