import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { getAllMissingArticleIds } from '../shared-read-models/elife-articles-missing-from-subject-area-lists';
import { MissingArticles } from '../shared-read-models/elife-articles-missing-from-subject-area-lists/handle-event';
import { Doi } from '../types/doi';

const formatForJson = (articleIds: ReadonlyArray<Doi>) => pipe(
  articleIds,
  RA.map((articleId) => articleId.value),
  (ids) => ({
    articleIds: ids,
    articleCount: ids.length,
  }),
);
type ELifeArticleMissingFromSubjectAreaListsJson = (readModel: MissingArticles)
=> { articleIds: ReadonlyArray<string>, articleCount: number };

export const elifeArticlesMissingFromSubjectAreaListsJson: ELifeArticleMissingFromSubjectAreaListsJson = (
  readModel,
) => pipe(
  readModel,
  getAllMissingArticleIds,
  formatForJson,
);
