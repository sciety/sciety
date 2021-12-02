import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { populateGroupViewModel, Ports as ViewModelPorts } from '../shared-components/group-card/populate-group-view-model';
import { GroupViewModel } from '../shared-components/group-card/render-group-card';
import * as DE from '../types/data-error';
import { Group } from '../types/group';

const byLatestActivity: Ord.Ord<GroupViewModel> = pipe(
  O.getOrd(D.Ord),
  Ord.reverse,
  Ord.contramap((group) => (group.latestActivity)),
);

export type Ports = ViewModelPorts;

type ToListOfGroupCardViewModels = (ports: Ports)
=> (groups: ReadonlyArray<Group>)
=> TE.TaskEither<DE.DataError, ReadonlyArray<GroupViewModel>>;

export const toListOfGroupCardViewModels: ToListOfGroupCardViewModels = (ports) => flow(
  RA.map((group) => group.id),
  TE.traverseArray(populateGroupViewModel(ports)),
  TE.map(RA.sort(byLatestActivity)),
);
