import * as O from 'fp-ts/Option';
import { ListCardViewModel } from './render-list-card';
import { List } from '../../../../read-models/lists';

export const constructListCardViewModelWithoutCurator = (list: List): ListCardViewModel => ({
  listId: list.id,
  articleCount: list.entries.length,
  updatedAt: list.updatedAt,
  title: list.name,
  description: list.description,
  imageUrl: O.none,
  curator: O.none,
});
