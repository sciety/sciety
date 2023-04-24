import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';

export type GetGroup = (groupId: GroupId) => O.Option<Group>;

export const getGroup = (readModel: ReadModel): GetGroup => (groupId) => pipe(
  readModel[groupId],
  O.fromNullable,
);
