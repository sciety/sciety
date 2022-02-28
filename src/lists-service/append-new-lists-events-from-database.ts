import * as TE from 'fp-ts/TaskEither';
import { ListsEvent } from './lists-event';

type AppendNewListsEventsFromDatabase = (listEvents: ReadonlyArray<ListsEvent>)
=> TE.TaskEither<never, ReadonlyArray<ListsEvent>>;

export const appendNewListsEventsFromDatabase: AppendNewListsEventsFromDatabase = (listEvents) => TE.right(listEvents);
