import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { elifeArticleMissingFromSubjectAreaLists, Ports } from '.';

export const calculateElifeArticlesMissingFromSubjectAreaLists = (ports: Ports):
T.Task<{ articleIds: ReadonlyArray<string>, articleCount: number }> => pipe(
  elifeArticleMissingFromSubjectAreaLists(ports),
  T.map(RA.map((articleId) => articleId.value)),
  T.map((articleIds) => ({
    articleIds,
    articleCount: articleIds.length,
  })),
);
