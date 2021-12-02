import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { populateGroupViewModel, Ports as ViewModelPorts } from '../shared-components/group-card/populate-group-view-model';
import { GroupViewModel } from '../shared-components/group-card/render-group-card';
import * as DE from '../types/data-error';
import { Group } from '../types/group';

export type Ports = ViewModelPorts;

type ToListOfGroupCardViewModels = (ports: Ports)
=> (groups: ReadonlyArray<Group>)
=> TE.TaskEither<DE.DataError, ReadonlyArray<GroupViewModel>>;

export const toListOfGroupCardViewModels: ToListOfGroupCardViewModels = (ports) => flow(
  RA.map((group) => group.id),
  TE.traverseArray(populateGroupViewModel(ports)),
);
