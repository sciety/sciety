import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import * as GID from '../../../types/group-id';
import { constructGroupLink } from '../../shared-components/group-link';
import * as EDOI from '../../../types/expression-doi';

export const constructRelatedGroups = (dependencies: Dependencies) => (expressionDois: ReadonlyArray<EDOI.ExpressionDoi>): ViewModel['relatedGroups'] => pipe(
  expressionDois,
  RA.flatMap(dependencies.getEvaluationsOfExpression),
  RA.map((recordedEvaluation) => recordedEvaluation.groupId),
  RA.uniq(GID.eq),
  RA.map(constructGroupLink(dependencies)),
  RA.compact,
  RA.matchW(
    () => ({ tag: 'no-groups-evaluated-the-found-articles' as const }),
    (groupLinkWithLogoViewModels) => ({
      tag: 'some-related-groups' as const,
      items: groupLinkWithLogoViewModels,
    }),
  ),
);
