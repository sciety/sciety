import * as E from 'fp-ts/Either';
import * as RM from 'fp-ts/ReadonlyMap';
import { flow } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';

type ReadModel = Map<GroupId, Group>;

type GetGroup = (groupId: GroupId) => (groupsReadModel: ReadModel) => E.Either<DE.DataError, Group>;

export const getGroup: GetGroup = (groupId: GroupId) => flow(
  RM.lookup(S.Eq)(groupId),
  E.fromOption(() => DE.notFound),
);
