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
  }),
);

type Ports = {
  getAllMissingArticleIds: () => ReadonlyArray<Doi>,
};

type ReadModelStatus = {
  evaluated: { articleIds: ReadonlyArray<string>, articleCount: number },
};

export const readModelStatus = (
  ports: Ports,
): ReadModelStatus => pipe(
  ports.getAllMissingArticleIds(),
  formatForJson,
);
