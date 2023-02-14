/* eslint-disable @typescript-eslint/no-unused-vars */
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { Doi } from '../../types/doi';
import { getActivityForDoi } from './get-activity-for-doi';
import { ReadModel } from './handle-event';

// ts-unused-exports:disable-next-line
export const getActivityForDois = (readmodel: ReadModel) => (articleIds: ReadonlyArray<Doi>) => pipe(
  articleIds,
  RA.map(getActivityForDoi(readmodel)),
);
