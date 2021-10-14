import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as DE from './data-error';
import { Group } from './group';
import { GroupId } from './group-id';

export type GroupRepository = {
  all: TE.TaskEither<DE.DataError, RNEA.ReadonlyNonEmptyArray<Group>>,
  lookup(id: GroupId): TE.TaskEither<DE.DataError, Group>,
  lookupBySlug(slug: string): TE.TaskEither<DE.DataError, Group>,
};
