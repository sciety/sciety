import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { LookupList } from '../../../shared-ports';
import { HtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { renderListCard } from '../../../shared-components/list-card/render-list-card';
import { constructListCardViewModel, Ports as ConstructListCardViewModelPorts } from '../../../shared-components/list-card/construct-list-card-view-model';

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
