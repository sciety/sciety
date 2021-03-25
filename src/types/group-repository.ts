import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { Group } from './group';
import { GroupId } from './group-id';

export type GroupRepository = {
  all: T.Task<RNEA.ReadonlyNonEmptyArray<Group>>,
  lookup(id: GroupId): T.Task<O.Option<Group>>,
};
