import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { GroupCardViewModel } from './view-model';
import { Queries } from '../../../../read-models';
import { constructGroupPagePath } from '../../../../standards/paths';
import * as DE from '../../../../types/data-error';
import { GroupId } from '../../../../types/group-id';
import { toHtmlFragment } from '../../../../types/html-fragment';
import * as LOID from '../../../../types/list-owner-id';
import { RecordedEvaluation } from '../../../../types/recorded-evaluation';
import { sanitise } from '../../../../types/sanitised-html-fragment';

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
      avatarSrc: group.avatarPath,
      followerCount: dependencies.getFollowers(groupId).length,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
      curatedArticlesCount: calculateCuratedArticlesCount(groupId, dependencies),
      listCount: calculateListCount(groupId, dependencies),
      groupPageHref: constructGroupPagePath.home.href(group),
    })),
  )),
  E.fromOption(() => DE.notFound),
);
