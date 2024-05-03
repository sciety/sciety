import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as jsonwebtoken from 'jsonwebtoken';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import { constructGroupPageHref } from '../../../paths';

export const constructViewModel = (dependencies: Dependencies) => (groupSlug: Params['slug']): E.Either<'no-such-group', ViewModel> => pipe(
  groupSlug,
  dependencies.getGroupBySlug,
  E.fromOption(() => 'no-such-group' as const),
  E.map((group) => ({
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
