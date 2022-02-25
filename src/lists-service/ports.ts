import * as TE from 'fp-ts/TaskEither';
import { ListsEvent } from './lists-event';
import { Logger } from '../infrastructure/logger';
import { List } from '../shared-read-models/lists';
import { GroupId } from '../types/group-id';

type ListsReadModel = Map<GroupId, List>;

export type Ports = {
  getListsEvents: TE.TaskEither<Error, ReadonlyArray<ListsEvent>>,
  logger: Logger,
  listsReadModel: TE.TaskEither<Error, ListsReadModel>,
};
