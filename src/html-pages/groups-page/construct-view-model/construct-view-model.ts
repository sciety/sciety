import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Ports as ViewModelPorts, toListOfGroupCardViewModels } from '../to-list-of-group-card-view-models';
import { GetAllGroups } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import { GroupViewModel } from '../../../shared-components/group-card';

export type Ports = ViewModelPorts & {
  getAllGroups: GetAllGroups,
};

export const constructViewModel = (ports: Ports): TE.TaskEither<DE.DataError, ReadonlyArray<GroupViewModel>> => pipe(
  ports.getAllGroups(),
  toListOfGroupCardViewModels(ports),
);
