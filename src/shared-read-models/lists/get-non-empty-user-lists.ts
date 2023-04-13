import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { GetNonEmptyUserLists } from '../../shared-ports';

export const getNonEmptyUserLists = (
  readModel: ReadModel,
): GetNonEmptyUserLists => () => pipe(
  Object.values(readModel),
);
