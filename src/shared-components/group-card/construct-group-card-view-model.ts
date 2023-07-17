import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { GroupCardViewModel } from './render-group-card';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';
import { sanitise } from '../../types/sanitised-html-fragment';
import { Queries } from '../../shared-read-models';

const calculateCuratedArticlesCount = (groupId: GroupId, queries: Queries) => pipe(
  groupId,
  queries.getEvaluationsByGroup,
  RA.map((recordedEvaluation) => recordedEvaluation.type),
  RA.map(O.getOrElse(() => 'not-provided')),
  RA.filter((evaluationType) => evaluationType === 'curation-statement'),
  RA.size,
);

const calculateListCount = (groupId: GroupId, queries: Queries) => pipe(
  groupId,
  LOID.fromGroupId,
  queries.selectAllListsOwnedBy,
  RA.size,
);

export const constructGroupCardViewModel = (
  queries: Queries,
) => (
  groupId: GroupId,
): E.Either<DE.DataError, GroupCardViewModel> => pipe(
  queries.getGroup(groupId),
  O.chain((group) => pipe(
    group.id,
    queries.getActivityForGroup,
    O.map((activity) => ({
      ...group,
      ...activity,
      followerCount: queries.getFollowers(groupId).length,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
      curatedArticlesCount: calculateCuratedArticlesCount(groupId, queries),
      listCount: calculateListCount(groupId, queries),
    })),
  )),
  E.fromOption(() => DE.notFound),
);
