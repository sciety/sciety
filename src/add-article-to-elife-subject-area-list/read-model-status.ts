import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ArticleStateName } from './read-model/handle-event';
import { GetArticleIdsByState } from '../shared-ports';

const formatForJson = (articleIds: ArticleIdsByState) => pipe(
  articleIds,
  R.map((ids) => ({
    articleIds: ids,
    articleCount: ids.length,
  })),
);

export type ArticleIdsByState = Record<ArticleStateName, ReadonlyArray<string>>;

type Ports = {
  getArticleIdsByState: GetArticleIdsByState,
};

type ArticlesInState = { articleIds: ReadonlyArray<string>, articleCount: number };

type ReadModelStatus = Record<ArticleStateName, ArticlesInState>;

export const readModelStatus = (
  adapters: Ports,
): ReadModelStatus => pipe(
  adapters.getArticleIdsByState(),
  formatForJson,
);
