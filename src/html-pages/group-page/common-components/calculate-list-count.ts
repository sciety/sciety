import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../../read-models';
import { GroupId } from '../../../types/group-id';
import * as LOID from '../../../types/list-owner-id';

type Dependencies = Queries;

export const calculateListCount = (dependencies: Dependencies) => (groupId: GroupId): number => pipe(
  groupId,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  RA.size,
);
