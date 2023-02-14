import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import { getActivityForDoi } from './get-activity-for-doi';
import { ReadModel } from './handle-event';

type GetActivityForDois = (articleIds: ReadonlyArray<Doi>) => ReadonlyArray<ArticleActivity>;

export const getActivityForDois = (readmodel: ReadModel): GetActivityForDois => (articleIds) => pipe(
  articleIds,
  RA.map(getActivityForDoi(readmodel)),
);
