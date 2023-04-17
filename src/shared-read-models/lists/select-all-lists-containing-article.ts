/* eslint-disable @typescript-eslint/no-unused-vars */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { SelectAllListsContainingArticle } from '../../shared-ports';

export const selectAllListsContainingArticle = (
  readModel: ReadModel,
): SelectAllListsContainingArticle => (articleId) => pipe(
  Object.values(readModel),
  RA.filter((list) => list.articleIds.includes(articleId.value)),
);
