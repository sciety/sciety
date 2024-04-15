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
import { Group } from '../../../../types/group';

const constructGroupListsPageHref = (group: Group): O.Option<string> => O.some(`/groups/${group.slug}/lists`);

const constructHeader = (dependencies: Dependencies, user: Params['user']) => (group: Group) => ({
  group,
  isFollowing: pipe(
    user,
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
  groupListsPageHref: constructGroupListsPageHref(group),
  groupFollowersPageHref: `/groups/${group.slug}/followers`,
});

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  O.map(constructHeader(dependencies, params.user)),
  TE.fromOption(() => DE.notFound),
  TE.chain((header) => pipe(
    constructContent(dependencies, header.group, 10, params.page),
    TE.map((content) => ({
      header,
      group: header.group,
      featuredLists: constructFeaturedLists(dependencies, header.group.id),
      content,
    })),
  )),
);
