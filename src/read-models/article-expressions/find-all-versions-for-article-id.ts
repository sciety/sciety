/* eslint-disable @typescript-eslint/no-unused-vars */
import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ReadModel } from './handle-event';
import { ArticleId } from '../../types/article-id';

type ReadModelEntry = { source: URL, publishedAt: Date, version: number };

type HardcodedReadModel = Map<string, RNEA.ReadonlyNonEmptyArray<ReadModelEntry>>;

const hardcodedReadModel: HardcodedReadModel = new Map();

hardcodedReadModel.set(
  'uuid:30374f3c-92dc-4692-aac0-ed95883b9ea0',
  [{
    source: new URL('https://doi.org/10.1099/acmi.0.000530.v1'),
    publishedAt: new Date('2022-11-29'),
    version: 1,
  },
  {
    source: new URL('https://doi.org/10.1099/acmi.0.000530.v2'),
    publishedAt: new Date('2023-10-20'),
    version: 2,
  }],
);

type FindAllVersionsForArticleId = (
  articleId: ArticleId,
) => O.Option<RNEA.ReadonlyNonEmptyArray<ReadModelEntry>>;

export const findAllVersionsForArticleId = (
  readModel: ReadModel,
): FindAllVersionsForArticleId => () => O.some([{
  source: new URL('https://doi.org/10.1099/acmi.0.000530.v1'),
  publishedAt: new Date('2022-11-29'),
  version: 1,
},
{
  source: new URL('https://doi.org/10.1099/acmi.0.000530.v2'),
  publishedAt: new Date('2023-10-20'),
  version: 2,
}]);
