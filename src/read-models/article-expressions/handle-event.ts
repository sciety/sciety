/* eslint-disable no-param-reassign */
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { URL } from 'url';
import { DomainEvent } from '../../domain-events';
import { ArticleExpressionDoi } from '../../types/article-expression-doi';

export type ReadModelEntry = {
  source: URL,
  articleExpressionDoi: ArticleExpressionDoi,
  publishedAt: Date,
  version: number,
};

type HardcodedReadModel = Map<string, RNEA.ReadonlyNonEmptyArray<ReadModelEntry>>;

export type ReadModel = HardcodedReadModel;

const hardcodedReadModel: HardcodedReadModel = new Map();

hardcodedReadModel.set(
  'uuid:30374f3c-92dc-4692-aac0-ed95883b9ea0',
  [{
    source: new URL('https://doi.org/10.1099/acmi.0.000530.v1'),
    articleExpressionDoi: new ArticleExpressionDoi('10.1099/acmi.0.000530.v1'),
    publishedAt: new Date('2022-11-29'),
    version: 1,
  },
  {
    source: new URL('https://doi.org/10.1099/acmi.0.000530.v2'),
    articleExpressionDoi: new ArticleExpressionDoi('10.1099/acmi.0.000530.v2'),
    publishedAt: new Date('2023-10-20'),
    version: 2,
  }],
);

export const initialState = (): ReadModel => hardcodedReadModel;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
