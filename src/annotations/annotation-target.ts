import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import { Doi, eqDoi } from '../types/doi';
import { eqListId, ListId } from '../types/list-id';

export type AnnotationTarget = {
  articleId: Doi,
  listId: ListId,
};

export const eqAnnotationTarget: Eq.Eq<AnnotationTarget> = pipe(
  {
    articleId: eqDoi,
    listId: eqListId,
  },
  Eq.struct,
);
