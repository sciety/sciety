import { List } from '../types/list';
import { ListOwnerId } from '../types/list-owner-id';

export type SelectAllListsOwnedBy = (listOwnerId: ListOwnerId) => ReadonlyArray<List>;
