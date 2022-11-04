import { pipe } from 'fp-ts/function';
import { ArticleState } from './read-model/handle-event';
import { GetArticleIdsByState } from '../shared-ports';

const formatForJson = (articleIds: ArticleIdsByState) => ({
  evaluated: {
    articleIds: articleIds.evaluated,
    articleCount: articleIds.evaluated.length,
  },
  listed: {
    articleIds: articleIds.listed,
    articleCount: articleIds.listed.length,
  },
  'category-known': {
    articleIds: articleIds['category-known'],
    articleCount: articleIds['category-known'].length,
  },
  'evaluated-and-category-known': {
    articleIds: articleIds['evaluated-and-category-known'],
    articleCount: articleIds['evaluated-and-category-known'].length,
  },
});

export type ArticleIdsByState = Record<ArticleState, ReadonlyArray<string>>;

type Ports = {
  getArticleIdsByState: GetArticleIdsByState,
};

type ArticlesInState = { articleIds: ReadonlyArray<string>, articleCount: number };

type ReadModelStatus = Record<ArticleState, ArticlesInState>;

export const readModelStatus = (
  ports: Ports,
): ReadModelStatus => pipe(
  ports.getArticleIdsByState(),
  formatForJson,
);
