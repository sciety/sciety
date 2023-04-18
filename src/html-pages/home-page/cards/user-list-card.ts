import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { LookupList } from '../../../shared-ports';
import { HtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { constructListCardViewModel, Ports as ConstructListCardViewModelPorts, renderListCard } from '../../../shared-components/list-card';

export type Ports = ConstructListCardViewModelPorts & {
  lookupList: LookupList,
};

export const userListCard = (
  ports: Ports,
) => (listId: ListId): O.Option<HtmlFragment> => pipe(
  listId,
  ports.lookupList,
  O.map(constructListCardViewModel(ports)),
  O.map(renderListCard),
);
