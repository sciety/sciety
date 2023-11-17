import { pipe } from 'fp-ts/function';
import { Json } from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import { ReadModel } from './handle-event.js';

export const annotationsStatus = (readModel: ReadModel) => (): Json => pipe(
  Object.values(readModel),
  RA.chain((listState) => Object.values(listState)),
  (annotations) => ({
    total: annotations.length,
  }),
);
