import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { identity } from 'io-ts';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import * as DE from '../../../../types/data-error';
import { Group } from '../../../../types/group';
import { UserId } from '../../../../types/user-id';
import { constructGroupPageHref } from '../../../paths';

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
    successRedirectPath: constructGroupPageHref(group),
    groupHomePageHref: constructGroupPageHref(group),
  })),
);