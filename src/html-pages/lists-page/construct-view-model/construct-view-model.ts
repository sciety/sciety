import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { GetNonEmptyUserLists } from '../../../shared-ports';
import { List } from '../../../types/list';
import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { addListOwnershipInformation, Ports as AddListOwnershipInformationPorts } from '../../sciety-feed-page/construct-view-model/add-list-ownership-information';

export type Ports = AddListOwnershipInformationPorts & {
  getNonEmptyUserLists: GetNonEmptyUserLists,
};

const constructListCardViewModel = (ports: Ports) => (list: List): ListCardViewModel => pipe(
  list,
  addListOwnershipInformation(ports),
  (ownershipInformation) => ({
    listId: list.id,
    articleCount: list.articleIds.length,
    updatedAt: O.some(list.updatedAt),
    title: list.name,
    description: list.description,
    avatarUrl: ownershipInformation.ownerAvatarUrl,
  }),
);

export const constructViewModel = (ports: Ports) => pipe(
  ports.getNonEmptyUserLists(),
  RA.map(constructListCardViewModel(ports)),
);
