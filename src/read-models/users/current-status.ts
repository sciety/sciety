import * as R from 'fp-ts/Record';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Json } from 'fp-ts/Json';
import { ReadModel } from './handle-event.js';

type CurrentStatus = () => Json;

export const currentStatus = (readModel: ReadModel): CurrentStatus => () => pipe(
  readModel,
  R.toEntries,
  RA.map((entry) => entry[1]),
  RA.partition((user) => user.id.startsWith('auth0')),
  ({ left, right }) => ({
    twitter: left.length,
    auth0: right.length,
  }),
);
