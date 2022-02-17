import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toListOfListCards } from './to-list-of-list-cards';
import { DomainEvent } from '../../domain-events';
import { fetchData } from '../../infrastructure/fetchers';
import { Logger } from '../../infrastructure/logger';
import { selectAllListsOwnedBy } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';

const callListReadModelService = (logger: Logger, groupId: GroupId) => () => pipe(
  TE.tryCatch(
    async () => {
      const uri = `http://${process.env.LISTS_READ_MODEL_HOST ?? 'lists'}/owned-by/${groupId}`;
      const response = await fetchData(logger)<string>(uri);
      return response.data;
    },
    () => DE.unavailable,
  ),
  TE.match(
    () => E.right(undefined),
    () => E.right(undefined),
  ),
);
type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
  logger: Logger,
};

export const lists = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(selectAllListsOwnedBy(group.id)),
  TE.chainFirstW(callListReadModelService(ports.logger, group.id)),
  TE.chain(toListOfListCards(ports, group)),
);
