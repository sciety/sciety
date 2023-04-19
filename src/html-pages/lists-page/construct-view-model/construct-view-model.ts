import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  GetNonEmptyUserLists,
} from '../../../shared-ports';
import { constructListCardViewModelWithAvatar, ConstructListCardViewModelWithAvatarPorts } from '../../../shared-components/list-card';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';

export type Ports = ConstructListCardViewModelWithAvatarPorts & {
  getNonEmptyUserLists: GetNonEmptyUserLists,
};

export const constructViewModel = (ports: Ports) => pipe(
  ports.getNonEmptyUserLists(),
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithAvatar(ports)),
);
