import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { Group } from './group';
import { GroupId } from './group-id';

export type GroupRepository = {
  all: T.Task<RNEA.ReadonlyNonEmptyArray<Group>>,
  lookup(id: GroupId): TO.TaskOption<Group>,
  lookupBySlug(slug: string): TO.TaskOption<Group>,
};
