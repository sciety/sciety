import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../../types/doi';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import * as GID from '../../../types/group-id';
import { constructGroupLinkWithLogo } from '../../../shared-components/group-link';

export const constructRelatedGroups = (dependencies: Dependencies) => (articleIds: ReadonlyArray<Doi>): ViewModel['relatedGroups'] => pipe(
  articleIds,
  RA.flatMap(dependencies.getEvaluationsForDoi),
  RA.map((recordedEvaluation) => recordedEvaluation.groupId),
  RA.uniq(GID.eq),
  RA.map(constructGroupLinkWithLogo(dependencies)),
  RA.compact,
  RA.matchW(
    () => ({ tag: 'no-groups-evaluated-the-found-articles' as const }),
    (groupLinkWithLogoViewModels) => ({
      tag: 'some-related-groups' as const,
      items: groupLinkWithLogoViewModels,
    }),
  ),
);
