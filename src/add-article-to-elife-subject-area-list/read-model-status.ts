import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';

const formatForJson = (articleIds: ReadonlyArray<Doi>) => pipe(
  articleIds,
  RA.map((articleId) => articleId.value),
  (ids) => ({
    evaluated: {
      articleIds: ids,
      articleCount: ids.length,
    },
    listed: { articleIds: [], articleCount: 0 },
    'category-known': { articleIds: [], articleCount: 0 },
    'evaluated-and-category-known': { articleIds: [], articleCount: 0 },
  }),
);

export type ArticleIdsByState = {
  evaluated: ReadonlyArray<string>,
  listed: ReadonlyArray<string>,
  'category-known': ReadonlyArray<string>,
  'evaluated-and-category-known': ReadonlyArray<string>,
};

type Ports = {
  getAllMissingArticleIds: () => ReadonlyArray<Doi>,
  getArticleIdsByState: () => ArticleIdsByState,
};

type ReadModelStatus = {
  evaluated: { articleIds: ReadonlyArray<string>, articleCount: number },
  listed: { articleIds: ReadonlyArray<string>, articleCount: number },
  'category-known': { articleIds: ReadonlyArray<string>, articleCount: number },
  'evaluated-and-category-known': { articleIds: ReadonlyArray<string>, articleCount: number },
};

export const readModelStatus = (
  ports: Ports,
): ReadModelStatus => pipe(
  ports.getAllMissingArticleIds(),
  formatForJson,
);
