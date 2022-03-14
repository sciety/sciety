import * as TE from 'fp-ts/TaskEither';
import { ListsEvent } from './lists-event';
import * as DE from '../types/data-error';

export type GetListsEvents = TE.TaskEither<DE.DataError, ReadonlyArray<ListsEvent>>;
