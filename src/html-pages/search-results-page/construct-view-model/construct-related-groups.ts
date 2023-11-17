import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleId } from '../../../types/article-id.js';
import { ViewModel } from '../view-model.js';
import { Dependencies } from './dependencies.js';
import * as GID from '../../../types/group-id.js';
import { constructGroupLink } from '../../../shared-components/group-link/index.js';

export const constructRelatedGroups = (dependencies: Dependencies) => (articleIds: ReadonlyArray<ArticleId>): ViewModel['relatedGroups'] => pipe(
  articleIds,
  RA.flatMap(dependencies.getEvaluationsForArticle),
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
