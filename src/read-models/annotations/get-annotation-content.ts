/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { RawUserInput } from '../../read-side';
import { ExpressionDoi } from '../../types/expression-doi';
import { ListId } from '../../types/list-id';

type GetAnnotationContent = (listId: ListId, expressionDoi: ExpressionDoi) => O.Option<RawUserInput>;

export const getAnnotationContent = (readModel: ReadModel): GetAnnotationContent => (listId, expressionDoi) => pipe(
  readModel,
  R.lookup(listId),
  O.flatMap(R.lookup(expressionDoi)),
);
