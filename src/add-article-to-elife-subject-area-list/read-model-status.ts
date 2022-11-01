import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';

const formatForJson = (articleIds: ReadonlyArray<Doi>) => pipe(
  articleIds,
  RA.map((articleId) => articleId.value),
  (ids) => ({
    articleIds: ids,
    articleCount: ids.length,
  }),
);

type Ports = {
  getAllMissingArticleIds: () => ReadonlyArray<Doi>,
};

type ReadModelStatus = (ports: Ports)
=> { articleIds: ReadonlyArray<string>, articleCount: number };

export const readModelStatus: ReadModelStatus = (
  ports,
) => pipe(
  ports.getAllMissingArticleIds(),
  formatForJson,
);
