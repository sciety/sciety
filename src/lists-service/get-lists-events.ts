import * as TE from 'fp-ts/TaskEither';
import { ListsEvent } from './lists-event';

export type GetListsEvents = TE.TaskEither<Error, ReadonlyArray<ListsEvent>>;
