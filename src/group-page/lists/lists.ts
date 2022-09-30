import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';
import { toListCardViewModel } from './to-list-card-view-model';
import { GetListsOwnedBy } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';

export type Ports = {
  getListsOwnedBy: GetListsOwnedBy,
};

export const lists = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  group.id,
  LOID.fromGroupId,
  ports.getListsOwnedBy,
  TE.map(RA.map(toListCardViewModel)),
  TE.map(renderListOfListCardsWithFallback),
);
