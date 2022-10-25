import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { handleEvent, MissingArticles } from './handle-event';
import { GetAllEvents } from '../../shared-ports';

type Ports = {
  getAllEvents: GetAllEvents,
};

export const elifeArticleMissingFromSubjectAreaLists = (ports: Ports): T.Task<MissingArticles> => pipe(
  ports.getAllEvents,
  T.map(RA.reduce(
    { articleIds: [] },
    handleEvent,
  )),
);
