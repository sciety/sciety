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
import { HtmlFragment } from '../../types/html-fragment';

const callPing = (logger: Logger) => () => pipe(
  TE.tryCatch(
    async () => {
      const uri = '';
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
  TE.chainFirstW(callPing(ports.logger)),
  TE.chain(toListOfListCards(ports, group)),
);
