import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {
  ArticleState, handleEvent, initialState, MissingArticles,
} from './handle-event';
import { GetAllEvents } from '../../shared-ports';
import { Doi } from '../../types/doi';

type Ports = {
  getAllEvents: GetAllEvents,
};

type ReadModelBuiltWithAllCurrentEvents = (ports: Ports) => T.Task<MissingArticles>;

export const readModelBuiltWithAllCurrentEvents: ReadModelBuiltWithAllCurrentEvents = (ports) => pipe(
  ports.getAllEvents,
  T.map(RA.reduce(initialState(), handleEvent)),
);

export const getAllMissingArticleIds = (readModel: MissingArticles): ReadonlyArray<Doi> => pipe(
  readModel,
  R.filter((item) => item === 'missing' as ArticleState),
  R.keys,
  RA.map((value) => new Doi(value)),
);
