import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { GroupId } from '../../../../types/group-id';
import { DependenciesForViews } from '../../../dependencies-for-views';

const constructGroupAdmins = (dependencies: DependenciesForViews, groupId: GroupId) => pipe(
  groupId,
  dependencies.getAdminsForGroup,
  RA.map((userId) => dependencies.lookupUser(userId)),
  RA.map(
    O.map((userDetails) => ({ userHandle: userDetails.handle })),
  ),
);

export const constructViewModel = (dependencies: DependenciesForViews): ViewModel => pipe(
  dependencies.getAllGroups(),
  RA.map((group) => ({
    ...group,
    admins: constructGroupAdmins(dependencies, group.id),
  })),
);
