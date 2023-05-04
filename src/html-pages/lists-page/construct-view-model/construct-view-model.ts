import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { constructListCardViewModelWithAvatar, ConstructListCardViewModelWithAvatarPorts } from '../../../shared-components/list-card';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { Queries } from '../../../shared-read-models';

export type Ports = Queries & ConstructListCardViewModelWithAvatarPorts;

export const constructViewModel = (ports: Ports) => pipe(
  ports.getNonEmptyUserLists(),
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithAvatar(ports)),
);
