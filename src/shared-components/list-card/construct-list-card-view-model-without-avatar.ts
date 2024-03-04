import * as O from 'fp-ts/Option';
import { List } from '../../read-models/lists';
import { ListCardViewModel } from './render-list-card';
import { rawUserInput } from '../../read-side';

export const constructListCardViewModelWithoutAvatar = (list: List): ListCardViewModel => ({
  listId: list.id,
  articleCount: list.entries.length,
  updatedAt: O.some(list.updatedAt),
  title: list.name,
  description: rawUserInput(list.description),
  avatarUrl: O.none,
});
