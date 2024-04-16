/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { RawUserInput } from '../../read-side';
import { ArticleId } from '../../types/article-id';
import { ListId } from '../../types/list-id';

type GetAnnotationContent = (listId: ListId, articleId: ArticleId) => O.Option<RawUserInput>;

export const getAnnotationContent = (readModel: ReadModel): GetAnnotationContent => (listId, articleId) => pipe(
  readModel,
  R.lookup(listId),
  O.chain(R.lookup(articleId.value)),
);
