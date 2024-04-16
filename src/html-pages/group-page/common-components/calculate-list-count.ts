import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as LOID from '../../../types/list-owner-id';
import { GroupId } from '../../../types/group-id';
import { Queries } from '../../../read-models';

type Dependencies = Queries;

export const calculateListCount = (dependencies: Dependencies) => (groupId: GroupId): number => pipe(
  groupId,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  RA.size,
);
