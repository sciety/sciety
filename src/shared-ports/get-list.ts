import * as O from 'fp-ts/Option';
import { List } from './select-all-lists-owned-by';
import { ListId } from '../types/list-id';

export type GetList = (listId: ListId) => O.Option<List>;
