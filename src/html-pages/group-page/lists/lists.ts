import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';
import { toListCardViewModel } from './to-list-card-view-model';
import { SelectAllListsOwnedBy } from '../../../shared-ports';
import { Group } from '../../../types/group';
import { HtmlFragment } from '../../../types/html-fragment';
import * as LOID from '../../../types/list-owner-id';

export type Ports = {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const lists = (ports: Ports) => (group: Group): TE.TaskEither<never, HtmlFragment> => pipe(
  group.id,
  LOID.fromGroupId,
  ports.selectAllListsOwnedBy,
  RA.reverse,
  RA.map(toListCardViewModel),
  renderListOfListCardsWithFallback,
  TE.right,
);
