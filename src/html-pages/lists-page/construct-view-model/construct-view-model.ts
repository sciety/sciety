import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  GetNonEmptyUserLists,
} from '../../../shared-ports';
import { constructListCardViewModel, Ports as ConstructListCardViewModelPorts } from '../../../shared-components/list-card';

export type Ports = ConstructListCardViewModelPorts & {
  getNonEmptyUserLists: GetNonEmptyUserLists,
};

export const constructViewModel = (ports: Ports) => pipe(
  ports.getNonEmptyUserLists(),
  RA.map(constructListCardViewModel(ports)),
);
