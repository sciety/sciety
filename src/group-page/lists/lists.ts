import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { callListsReadModelService } from './call-lists-read-model-service';
import { toListOfListCards } from './to-list-of-list-cards';
import { DomainEvent } from '../../domain-events';
import { Logger } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
  logger: Logger,
};

export const lists = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(callListsReadModelService(ports.logger, group.id)),
  TE.map(toListOfListCards),
);
