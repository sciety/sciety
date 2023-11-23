/* eslint-disable @typescript-eslint/no-unused-vars */
import { URL } from 'url';
import { ReadModel } from './handle-event';
import { ArticleId } from '../../types/article-id';

type FindAllVersionsForArticleId = (articleId: ArticleId) => unknown;

export const findAllVersionsForArticleId = (
  readModel: ReadModel,
): FindAllVersionsForArticleId => () => [{
  source: new URL('https://doi.org/10.1099/acmi.0.000530.v1'),
  publishedAt: new Date('2022-11-29'),
  version: 1,
},
{
  source: new URL('https://doi.org/10.1099/acmi.0.000530.v2'),
  publishedAt: new Date('2023-10-20'),
  version: 2,
}];
