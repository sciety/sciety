import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { ArticleItem, MatchedArticle } from './data-types';

export type FindArticles = (query: string) => TE.TaskEither<'unavailable', {
  items: ReadonlyArray<MatchedArticle>,
  total: number,
}>;

type FindMatchingArticles = (f: FindArticles) => (q: string) => TE.TaskEither<'unavailable', {
  items: ReadonlyArray<ArticleItem>,
  total: number,
}>;

export const findMatchingArticles: FindMatchingArticles = (findArticles) => flow(
  findArticles,
  TE.map((results) => ({
    ...results,
    items: results.items.map((article) => ({
      _tag: 'Article' as const,
      ...article,
    })),
  })),
);
