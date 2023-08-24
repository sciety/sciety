import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../../types/doi';
import { ArticlesCategoryViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import * as GID from '../../../types/group-id';

export const constructRelatedGroups = (dependencies: Dependencies) => (articleIds: ReadonlyArray<Doi>): ArticlesCategoryViewModel['relatedGroups'] => pipe(
  articleIds,
  RA.flatMap(dependencies.getEvaluationsForDoi),
  RA.map((recordedEvaluation) => recordedEvaluation.groupId),
  RA.uniq(GID.eq),
  RA.map(dependencies.getGroup),
  RA.compact,
  RA.matchW(
    () => ({ tag: 'no-groups-evaluated-the-found-articles' as const }),
    (foundGroups) => ({
      tag: 'some-related-groups' as const,
      items: pipe(
        foundGroups,
        RA.map((foundGroup) => ({
          groupPageHref: `/groups/${foundGroup.slug}`,
          groupName: foundGroup.name,
        })),
      ),
    }),
  ),
);
