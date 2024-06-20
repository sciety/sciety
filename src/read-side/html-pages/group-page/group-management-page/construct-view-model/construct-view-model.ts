import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { identity } from 'io-ts';
import { constructCurrentlyFeaturedLists } from './construct-currently-featured-lists';
import { constructListsThatCanBeFeatured } from './construct-lists-that-can-be-featured';
import { Dependencies } from './dependencies';
import { Params } from './params';
import * as DE from '../../../../../types/data-error';
import { Group } from '../../../../../types/group';
import { UserId } from '../../../../../types/user-id';
import { constructGroupPagePath } from '../../../../paths';
import { ViewModel } from '../view-model';

const checkUserIsAdminOfGroup = (dependencies: Dependencies, userId: UserId, group: Group) => pipe(
  dependencies.isUserAdminOfGroup(userId, group.id),
  E.fromPredicate(
    identity,
    () => DE.notAuthorised,
  ),
  E.map(() => group),
);

type ConstructViewModel = (dependencies: Dependencies, userId: UserId)
=> (params: Params)
=> E.Either<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies, userId) => (params) => pipe(
  params.slug,
  dependencies.getGroupBySlug,
  E.fromOption(() => DE.notFound),
  E.chainW((group) => checkUserIsAdminOfGroup(dependencies, userId, group)),
  E.map((group) => ({
    pageHeading: `Group management details for ${group.name}`,
    groupHomePageHref: constructGroupPagePath.home.href(group),
    groupEngagementDashboardHref: `https://datastudio.google.com/reporting/b7e23806-11a3-487b-9fac-c53df161fe73?params=%7B%22group_id%22:%22${group.id}%22%7D`,
    currentlyFeaturedLists: constructCurrentlyFeaturedLists(dependencies, group),
    listsThatCanBeFeatured: constructListsThatCanBeFeatured(dependencies, group, userId),
  })),
);
