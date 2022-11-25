import * as TE from 'fp-ts/TaskEither';
import { ListsEvent } from './lists-event';
import * as DE from '../types/data-error';

// ts-unused-exports:disable-next-line
export type GetListsEvents = TE.TaskEither<DE.DataError, ReadonlyArray<ListsEvent>>;
