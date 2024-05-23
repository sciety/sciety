import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { identity } from 'io-ts';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import { Group } from '../../../../types/group';
import { UserId } from '../../../../types/user-id';
import { constructGroupPageHref } from '../../../paths';

const checkUserIsAdminOfGroup = (dependencies: Dependencies, userId: UserId, group: Group) => pipe(
  dependencies.isUserAdminOfGroup(userId, group.id),
  E.fromPredicate(
    identity,
    () => 'no-such-group' as const,
  ),
  E.map(() => group),
);

export const constructViewModel = (dependencies: Dependencies) => (params: Params): E.Either<'no-such-group', ViewModel> => pipe(
  {
    group: dependencies.getGroupBySlug(params.slug),
    user: params.user,
  },
  sequenceS(O.Apply),
  E.fromOption(() => 'no-such-group' as const),
  E.chainW(({ group, user }) => checkUserIsAdminOfGroup(dependencies, user.id, group)),
  E.map((group) => ({
    pageHeading: `Add a featured list for ${group.name}`,
    groupId: group.id,
    successRedirectPath: constructGroupPageHref(group),
  })),
);
