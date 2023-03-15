import * as O from 'fp-ts/Option';
import { List } from '../types/list';
import { ListId } from '../types/list-id';

export type LookupList = (listId: ListId) => O.Option<List>;
