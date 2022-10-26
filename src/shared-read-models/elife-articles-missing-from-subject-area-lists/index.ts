import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ArticleState, handleEvent, initialState } from './handle-event';
import { GetAllEvents } from '../../shared-ports';
import { Doi } from '../../types/doi';

export type Ports = {
  getAllEvents: GetAllEvents,
};

export const elifeArticleMissingFromSubjectAreaLists = (ports: Ports): T.Task<ReadonlyArray<Doi>> => pipe(
  ports.getAllEvents,
  T.map(RA.reduce(initialState, handleEvent)),
  T.map(R.filter((item) => item === 'missing' as ArticleState)),
  T.map(R.keys),
  T.map(RA.map((value) => new Doi(value))),
);
