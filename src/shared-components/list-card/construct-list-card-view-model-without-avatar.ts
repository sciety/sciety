import * as O from 'fp-ts/Option';
import { List } from '../../read-models/lists';
import { ListCardViewModel } from './render-list-card';

export const constructListCardViewModelWithoutAvatar = (
  ownerName: O.Option<string>,
) => (list: List): ListCardViewModel => ({
  listId: list.id,
  articleCount: list.entries.length,
  updatedAt: O.some(list.updatedAt),
  title: list.name,
  description: list.description,
  avatarUrl: O.none,
  curatedByUser: O.isSome(ownerName),
  ownerDisplayName: O.getOrElse(() => 'unused')(ownerName),
});
