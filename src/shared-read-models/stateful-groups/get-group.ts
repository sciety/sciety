import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';

type GetGroup = (readModel: ReadModel) => (groupId: GroupId) => E.Either<DE.DataError, Group>;

export const getGroup: GetGroup = (readModel) => (groupId) => pipe(
  readModel[groupId],
  E.fromNullable(DE.notFound),
);
