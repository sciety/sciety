import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as DE from '../../types/data-error.js';
import { GroupId } from '../../types/group-id.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import * as LOID from '../../types/list-owner-id.js';
import { sanitise } from '../../types/sanitised-html-fragment.js';
import { Queries } from '../../read-models/index.js';
import { GroupCardViewModel } from './view-model.js';
import { RecordedEvaluation } from '../../types/recorded-evaluation.js';

type Dependencies = Queries;

const isCurationStatement = (
  recordedEvaluation: RecordedEvaluation,
) => {
  if (O.isNone(recordedEvaluation.type)) {
    return false;
  }
  return recordedEvaluation.type.value === 'curation-statement';
};

const calculateCuratedArticlesCount = (groupId: GroupId, dependencies: Dependencies) => pipe(
  groupId,
  dependencies.getEvaluationsByGroup,
  RA.filter(isCurationStatement),
  RA.map((curationStatement) => curationStatement.expressionDoi),
  RA.uniq(S.Eq),
  RA.size,
);

const calculateListCount = (groupId: GroupId, dependencies: Dependencies) => pipe(
  groupId,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  RA.size,
);

export const constructGroupCard = (
  dependencies: Dependencies,
) => (
  groupId: GroupId,
): E.Either<DE.DataError, GroupCardViewModel> => pipe(
  dependencies.getGroup(groupId),
  O.chain((group) => pipe(
    group.id,
    dependencies.getActivityForGroup,
    O.map((activity) => ({
      ...group,
      ...activity,
      followerCount: dependencies.getFollowers(groupId).length,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
      curatedArticlesCount: calculateCuratedArticlesCount(groupId, dependencies),
      listCount: calculateListCount(groupId, dependencies),
      groupPageHref: `/groups/${group.slug}`,
    })),
  )),
  E.fromOption(() => DE.notFound),
);
