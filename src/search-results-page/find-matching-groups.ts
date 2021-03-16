import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { GroupItem } from './data-types';
import { GroupId } from '../types/group-id';

export type FindGroups = (q: string) => T.Task<ReadonlyArray<GroupId>>;

type FindMatchingGroups = (fg: FindGroups) => (q: string) => TE.TaskEither<never, ReadonlyArray<GroupItem>>;

export const findMatchingGroups: FindMatchingGroups = (findGroups) => flow(
  findGroups, // TODO: should only ask for 10 of n; should return a TE
  T.map(RA.map((groupId) => ({
    _tag: 'Group' as const,
    id: groupId,
  }))),
  TE.rightTask,
);
