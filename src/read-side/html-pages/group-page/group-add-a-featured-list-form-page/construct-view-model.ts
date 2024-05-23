import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import { Group } from '../../../../types/group';
import { UserId } from '../../../../types/user-id';
import { constructGroupPageHref } from '../../../paths';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkUserIsAdminOfGroup = (userId: UserId, group: Group) => E.right(group);

export const constructViewModel = (dependencies: Dependencies) => (params: Params): E.Either<'no-such-group', ViewModel> => pipe(
  {
    group: dependencies.getGroupBySlug(params.slug),
    user: params.user,
  },
  sequenceS(O.Apply),
  E.fromOption(() => 'no-such-group' as const),
  E.chainW(({ group, user }) => checkUserIsAdminOfGroup(user.id, group)),
  E.map((group) => ({
    pageHeading: `Add a featured list for ${group.name}`,
    groupId: group.id,
    successRedirectPath: constructGroupPageHref(group),
  })),
);
