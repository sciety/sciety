import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ListsEvent } from './lists-event';

type AppendNewListsEventsFromDatabase = (listEvents: ReadonlyArray<ListsEvent>)
=> TE.TaskEither<Error, ReadonlyArray<ListsEvent>>;

const queryDatabaseForEventsWithNewerDate = (): TE.TaskEither<Error, ReadonlyArray<ListsEvent>> => TE.right([]);

export const appendNewListsEventsFromDatabase: AppendNewListsEventsFromDatabase = (sortedListEvents) => pipe(
  sortedListEvents,
  RA.last,
  TE.fromOption(() => new Error('no lists events')),
  TE.map((event) => event.date),
  TE.chainW(queryDatabaseForEventsWithNewerDate),
  TE.map((newEvents) => RA.concat(newEvents)(sortedListEvents)),
);
