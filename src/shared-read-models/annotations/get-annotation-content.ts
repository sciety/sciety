/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import { ReadModel } from './handle-event';
import { ListId } from '../../types/list-id';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';

export type GetAnnotationContent = (listId: ListId, articleId: Doi) => O.Option<HtmlFragment>;

// ts-unused-exports:disable-next-line
export const getAnnotationContent = (readModel: ReadModel): GetAnnotationContent => (listId, articleId) => pipe(
  readModel,
  R.lookup(listId),
  O.chain(R.lookup(articleId.value)),
);
