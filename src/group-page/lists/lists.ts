import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { callListsReadModelService } from './call-lists-read-model-service';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';
import { toListCardViewModel } from './to-list-card-view-model';
import { Logger } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = {
  logger: Logger,
};

export const lists = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  callListsReadModelService(ports.logger, group.id),
  TE.map(RA.map(toListCardViewModel)),
  TE.map(renderListOfListCardsWithFallback),
);
