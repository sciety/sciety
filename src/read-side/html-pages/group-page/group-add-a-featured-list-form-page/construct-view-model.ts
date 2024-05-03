import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as jsonwebtoken from 'jsonwebtoken';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import { GroupId } from '../../../../types/group-id';
import { UserId } from '../../../../types/user-id';
import { constructGroupPageHref } from '../../../paths';

const groupAdministratedBy: Record<UserId, string> = {
  ['auth0|650a91161c07d3acf5ff7da5' as UserId]: 'd6e1a913-76f8-40dc-9074-8eac033e1bc8',
  ['twitter|1384541806231175172' as UserId]: '4bbf0c12-629b-4bb8-91d6-974f4df8efb2',
  ['auth0|65faae8fd0f034a2c4c72b7c' as UserId]: '10360d97-bf52-4aef-b2fa-2f60d319edd7',
  ['twitter|1443469693621309444' as UserId]: 'b5f31635-d32b-4df9-92a5-0325a1524343',
  ['twitter|380816062' as UserId]: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
};

const isUserAdminOfThisGroup = (userId: UserId, groupId: GroupId) => (
  groupAdministratedBy[userId] === groupId
);

export const constructViewModel = (dependencies: Dependencies) => (params: Params): E.Either<'no-such-group', ViewModel> => pipe(
  params.slug,
  dependencies.getGroupBySlug,
  E.fromOption(() => 'no-such-group' as const),
  E.chainW((group) => pipe(
    params.user,
    E.fromOption(() => 'user-not-logged-in' as const),
    E.filterOrElseW(
      (user) => isUserAdminOfThisGroup(user.id, group.id),
      () => 'user-not-admin' as const,
    ),
    E.map((userId) => ({ group, userId })),
  )),
  E.map(({ group, userId }) => ({
    pageHeading: `Add a featured list for ${group.name}`,
    groupId: group.id,
    successRedirectPath: constructGroupPageHref(group),
    authorizationToken: jsonwebtoken.sign({
      command: 'list-promotion.create',
      parameters: {
        groupId: group.id,
      },
    }, process.env.APP_SECRET ?? 'a-secret'),
  })),
);
