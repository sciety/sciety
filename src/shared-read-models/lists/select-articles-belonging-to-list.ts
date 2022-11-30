import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { flow, pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { SelectArticlesBelongingToList } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { fromString } from '../../types/doi';

export const selectArticlesBelongingToList = (
  readModel: ReadModel,
): SelectArticlesBelongingToList => (listId) => pipe(
  readModel,
  R.lookup(listId),
  E.fromOption(() => DE.notFound),
  E.map((listsState) => listsState.articleIds),
  E.chainW(flow(
    O.traverseArray(fromString),
    E.fromOption(() => DE.unavailable),
  )),
  E.map(RA.reverse),
);
