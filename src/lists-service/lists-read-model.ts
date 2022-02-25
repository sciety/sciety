import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetListsEvents } from './get-lists-events';
import { Logger } from '../infrastructure/logger';
import { List } from '../shared-read-models/lists';
import { constructListsReadModel } from '../shared-read-models/lists/construct-lists-read-model';
import { GroupId } from '../types/group-id';

type ListsReadModel = Map<GroupId, List>;

export const listsReadModel = (
  getListsEvents: GetListsEvents,
  logger: Logger,
): TE.TaskEither<Error, ListsReadModel> => pipe(
  getListsEvents,
  TE.chainFirst(() => {
    logger('debug', 'Loaded lists events');
    return TE.right('everything is ok');
  }),
  TE.chainTaskK(constructListsReadModel),
  TE.chainFirst(() => {
    logger('debug', 'Constructed read model');
    return TE.right('everything is ok');
  }),
);
