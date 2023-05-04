import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { constructListCardViewModelWithAvatar, ConstructListCardViewModelWithAvatarPorts, renderListCard } from '../../../shared-components/list-card';
import { Queries } from '../../../shared-read-models';

export type Ports = Queries & ConstructListCardViewModelWithAvatarPorts;

export const generateMostActiveListCard = (
  ports: Ports,
) => (listId: ListId): O.Option<HtmlFragment> => pipe(
  listId,
  ports.lookupList,
  O.map(constructListCardViewModelWithAvatar(ports)),
  O.map(renderListCard),
);
