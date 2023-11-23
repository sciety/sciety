/* eslint-disable @typescript-eslint/no-unused-vars */
import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ReadModel } from './handle-event';
import { ArticleId } from '../../types/article-id';

type FindAllVersionsForArticleId = (
  articleId: ArticleId,
) => O.Option<RNEA.ReadonlyNonEmptyArray<{ source: URL, publishedAt: Date, version: number }>>;

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
