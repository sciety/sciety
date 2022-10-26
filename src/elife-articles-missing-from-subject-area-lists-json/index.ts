import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { elifeArticleMissingFromSubjectAreaLists, Ports } from '../shared-read-models/elife-articles-missing-from-subject-area-lists';
import { Doi } from '../types/doi';

const formatForJson = (articleIds: ReadonlyArray<Doi>) => pipe(
  articleIds,
  RA.map((articleId) => articleId.value),
  (ids) => ({
    articleIds: ids,
    articleCount: ids.length,
  }),
);

export const elifeArticlesMissingFromSubjectAreaListsJson = (ports: Ports):
T.Task<{ articleIds: ReadonlyArray<string>, articleCount: number }> => pipe(
  elifeArticleMissingFromSubjectAreaLists(ports),
  T.map(formatForJson),
);
