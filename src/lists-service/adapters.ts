import * as TE from 'fp-ts/TaskEither';
import { ListsEvent } from './lists-event';
import { Logger } from '../infrastructure/logger';

export type Adapters = {
  getListsEvents: TE.TaskEither<Error, ReadonlyArray<ListsEvent>>,
  logger: Logger,
};
