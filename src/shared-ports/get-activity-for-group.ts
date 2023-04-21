import * as O from 'fp-ts/Option';
import { GroupId } from '../types/group-id';

export type GroupActivity = {
  evaluationCount: number,
  latestActivityAt: O.Option<Date>,
};

// ts-unused-exports:disable-next-line
export type GetActivityForGroup = (groupId: GroupId) => GroupActivity;
