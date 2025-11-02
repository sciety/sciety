import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';

export const annotationsStatus = (readModel: ReadModel) => (): { total: number } => pipe(
  Object.values(readModel),
  RA.flatMap((listState) => Object.values(listState)),
  (annotations) => ({
    total: annotations.length,
  }),
);
