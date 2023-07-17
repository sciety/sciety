import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as Eq from 'fp-ts/Eq';
import * as S from 'fp-ts/string';
import { GroupCardViewModel } from './render-group-card';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';
import { sanitise } from '../../types/sanitised-html-fragment';
import { Queries } from '../../shared-read-models';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

const evaluatesTheSameArticle: Eq.Eq<RecordedEvaluation> = pipe(
  S.Eq,
  Eq.contramap((recordedEvaluation) => recordedEvaluation.articleId.value),
);

const calculateCuratedArticlesCount = (groupId: GroupId, queries: Queries) => pipe(
  groupId,
  queries.getEvaluationsByGroup,
  RA.uniq(evaluatesTheSameArticle),
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
  E.fromOption(() => DE.notFound),
  E.chainOptionK(() => DE.notFound)((group) => pipe(
    group.id,
    queries.getActivityForGroup,
    O.map((meta) => ({
      ...group,
      ...meta,
      followerCount: queries.getFollowers(groupId).length,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
      curatedArticlesCount: calculateCuratedArticlesCount(groupId, queries),
      listCount: calculateListCount(groupId, queries),
    })),
  )),
);
