import { pipe } from 'fp-ts/function';

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

export type ArticleIdsByState = {
  evaluated: ReadonlyArray<string>,
  listed: ReadonlyArray<string>,
  'category-known': ReadonlyArray<string>,
  'evaluated-and-category-known': ReadonlyArray<string>,
};

type Ports = {
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
  ports.getArticleIdsByState(),
  formatForJson,
);
