import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { LookupList } from '../../../shared-ports';
import { HtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { constructListCardViewModelWithAvatar, ConstructListCardViewModelWithAvatarPorts, renderListCard } from '../../../shared-components/list-card';

export type Ports = ConstructListCardViewModelWithAvatarPorts & {
  lookupList: LookupList,
};

export const generateMostActiveListCard = (
  ports: Ports,
) => (listId: ListId): O.Option<HtmlFragment> => pipe(
  listId,
  ports.lookupList,
  O.map(constructListCardViewModelWithAvatar(ports)),
  O.map(renderListCard),
);
