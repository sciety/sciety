import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';

type GetGroup = (readModel: ReadModel) => (groupId: GroupId) => O.Option<Group>;

export const getGroup: GetGroup = (readModel) => (groupId) => pipe(
  readModel[groupId],
  O.fromNullable,
);
