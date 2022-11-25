import * as TE from 'fp-ts/TaskEither';
import { List } from '../shared-read-models/lists';
import * as DE from '../types/data-error';
import { ListOwnerId } from '../types/list-owner-id';

// ts-unused-exports:disable-next-line
export type GetListsOwnedBy = (ownerId: ListOwnerId) => TE.TaskEither<DE.DataError, ReadonlyArray<List>>;
