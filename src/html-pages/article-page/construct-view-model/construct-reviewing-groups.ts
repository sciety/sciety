import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { RecordedEvaluation } from '../../../types/recorded-evaluation';
import { Doi } from '../../../types/doi';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import * as GID from '../../../types/group-id';

const isNotCurationStatement = (evaluation: RecordedEvaluation) => pipe(
  evaluation.type,
  O.getOrElseW(() => undefined),
) !== 'curation-statement';

const getGroup = (dependencies: Dependencies) => (groupId: GID.GroupId) => pipe(
  groupId,
  dependencies.getGroup,
  O.orElse(() => {
    dependencies.logger('error', 'Group missing from readmodel', { groupId });
    return O.none;
  }),
);

const unique = <A>(input: ReadonlyArray<A>) => [...new Set(input)];

export const constructReviewingGroups = (
  dependencies: Dependencies,
  articleId: Doi,
): ViewModel['reviewingGroups'] => pipe(
  articleId,
  dependencies.getEvaluationsForDoi,
  RA.filter(isNotCurationStatement),
  RA.map((evaluation) => evaluation.groupId),
  unique,
  RA.map((groupId) => pipe(
    groupId,
    getGroup(dependencies),
    O.map((group) => ({ groupName: group.name, href: `/groups/${group.slug}`, logoPath: group.largeLogoPath })),
  )),
  RA.compact,
);
