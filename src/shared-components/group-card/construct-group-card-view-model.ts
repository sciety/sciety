import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { GroupCardViewModel } from './render-group-card';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import * as LOID from '../../types/list-owner-id';
import { Queries } from '../../shared-read-models';
import { annotateWithLanguage } from '../../types/language-annotated';

export const constructGroupCardViewModel = (
  queries: Queries,
) => (
  groupId: GroupId,
): E.Either<DE.DataError, GroupCardViewModel> => pipe(
  queries.getGroup(groupId),
  E.fromOption(() => DE.notFound),
  E.chainOptionK(() => DE.notFound)((group) => pipe(
    group.id,
    queries.getActivityForGroup,
    O.map((meta) => ({
      ...group,
      ...meta,
      followerCount: queries.getFollowers(group.id).length,
      description: annotateWithLanguage(group.shortDescription),
    })),
  )),
  E.map((partial) => pipe(
    groupId,
    LOID.fromGroupId,
    queries.selectAllListsOwnedBy,
    RA.size,
    ((listCount) => ({
      ...partial,
      listCount,
    })),
  )),
);
