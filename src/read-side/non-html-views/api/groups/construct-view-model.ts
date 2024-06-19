import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { Queries } from '../../../../read-models';
import { GroupId } from '../../../../types/group-id';

const constructGroupAdmins = (queries: Queries, groupId: GroupId) => pipe(
  groupId,
  queries.getAdminsForAGroup,
  () => [],
);

export const constructViewModel = (queries: Queries): ViewModel => pipe(
  queries.getAllGroups(),
  RA.map((group) => ({
    ...group,
    admins: constructGroupAdmins(queries, group.id),
  })),
);
