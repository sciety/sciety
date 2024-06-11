import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { identity } from 'io-ts';
import { Dependencies } from './dependencies';
import { Params } from './params';
import * as DE from '../../../../../types/data-error';
import { Group } from '../../../../../types/group';
import { UserId } from '../../../../../types/user-id';
import { constructGroupPageHref } from '../../../../paths';
import { constructGroupManagementPageHref } from '../../../../paths/construct-group-page-href';
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
    groupId: group.id,
    successRedirectPath: constructGroupManagementPageHref(group),
    groupHomePageHref: constructGroupPageHref(group),
    currentlyFeaturedLists: pipe(
      dependencies.selectAllListsPromotedByGroup(group.id),
      RA.map((list) => ({
        listName: list.name,
        listId: list.id,
        forGroup: group.id,
        successRedirectPath: constructGroupManagementPageHref(group),
      })),
    ),
    listsThatCanBeFeatured: pipe(
      dependencies.getNonEmptyUserLists(),
      RA.map((list) => ({
        listName: list.name,
        listId: list.id,
        forGroup: group.id,
        successRedirectPath: constructGroupManagementPageHref(group),
      })),
    ),
  })),
);
