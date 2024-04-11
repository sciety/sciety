import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { constructListCards } from './construct-list-cards';
import { Dependencies } from './dependencies';
import { Params } from './params';

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  O.map((group) => pipe(
    {
      header: {
        title: `${group.name} lists`,
        group,
      },
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
      listCards: constructListCards(dependencies, group),
      groupFollowersPageHref: `/groups/${group.slug}/followers`,
    },
  )),
  TE.fromOption(() => DE.notFound),
);
