import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
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
  })),
);
