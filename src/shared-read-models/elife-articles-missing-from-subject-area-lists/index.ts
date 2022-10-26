import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {
  ArticleState, handleEvent, initialState, MissingArticles,
} from './handle-event';
import { GetAllEvents } from '../../shared-ports';
import { Doi } from '../../types/doi';

export type Ports = {
  getAllEvents: GetAllEvents,
};

const readModelBuiltWithAllCurrentEvents = (ports: Ports) => pipe(
  ports.getAllEvents,
  T.map(RA.reduce(initialState, handleEvent)),
);

const getAllMissingArticleIds = (readModel: MissingArticles) => pipe(
  readModel,
  R.filter((item) => item === 'missing' as ArticleState),
  R.keys,
  RA.map((value) => new Doi(value)),
);

export const elifeArticleMissingFromSubjectAreaLists = (ports: Ports): T.Task<ReadonlyArray<Doi>> => pipe(
  readModelBuiltWithAllCurrentEvents(ports),
  T.map(getAllMissingArticleIds),
);
