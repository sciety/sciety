import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ArticleIdsByState, Queries } from './read-model';

const formatForJson = (articleIds: ArticleIdsByState) => pipe(
  articleIds,
  R.map((ids) => ({
    articleIds: ids,
    articleCount: ids.length,
  })),
);

type ArticlesInState = { articleIds: ReadonlyArray<string>, articleCount: number };

type ReadModelStatus = Record<string, ArticlesInState>;

export const readModelStatus = (
  queries: Queries,
): ReadModelStatus => pipe(
  queries.getArticleIdsByState(),
  formatForJson,
);
