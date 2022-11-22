import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ArticleIdsByState, GetArticleIdsByState } from '../shared-ports';

const formatForJson = (articleIds: ArticleIdsByState) => pipe(
  articleIds,
  R.map((ids) => ({
    articleIds: ids,
    articleCount: ids.length,
  })),
);

type Ports = {
  getArticleIdsByState: GetArticleIdsByState,
};

type ArticlesInState = { articleIds: ReadonlyArray<string>, articleCount: number };

type ReadModelStatus = Record<string, ArticlesInState>;

export const readModelStatus = (
  adapters: Ports,
): ReadModelStatus => pipe(
  adapters.getArticleIdsByState(),
  formatForJson,
);
